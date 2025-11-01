import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";
import { generateLongSpeech } from "./audioChunker";
import { 
  getElevenLabsVoices, 
  createVoiceClone as createElevenLabsVoiceClone,
  generateSpeech,
  deleteVoiceClone as deleteElevenLabsVoiceClone,
  getUserCredits,
  estimateCreditCost
} from "./elevenlabs";
import { 
  createVoiceClone, 
  getUserVoiceClones, 
  deleteVoiceClone,
  createAudioFile,
  getUserAudioFiles,
  getAudioFileByShareToken,
  deleteAudioFile
} from "./db";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";

function generateShareToken(): string {
  return randomBytes(32).toString('hex');
}

function generateRandomSuffix(): string {
  return randomBytes(8).toString('hex');
}

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  credits: router({
    // Get user's credit balance and subscription info
    getBalance: publicProcedure.query(async () => {
      const credits = await getUserCredits();
      return credits;
    }),
    // Estimate credit cost for text
    estimateCost: publicProcedure
      .input(z.object({ text: z.string() }))
      .query(({ input }) => {
        const cost = estimateCreditCost(input.text.length);
        return { estimatedCost: cost, textLength: input.text.length };
      }),
  }),

  voices: router({
    // Get all available ElevenLabs voices (pre-built masculine and feminine)
    getAvailable: publicProcedure.query(async () => {
      const voices = await getElevenLabsVoices();
      return voices;
    }),

    // Get user's cloned voices
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return getUserVoiceClones(ctx.user.id);
    }),

    // Clone a voice from uploaded audio
    clone: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(255),
        audioData: z.string(), // base64 encoded audio
        fileName: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Convert base64 to buffer
        const audioBuffer = Buffer.from(input.audioData, 'base64');

        // Upload to S3
        const fileKey = `${ctx.user.id}/voice-samples/${input.fileName}-${generateRandomSuffix()}`;
        const { url: audioUrl } = await storagePut(
          fileKey,
          audioBuffer,
          "audio/mpeg"
        );

        // Create voice clone in ElevenLabs
        const voiceId = await createElevenLabsVoiceClone({
          name: input.name,
          audioBuffer,
          fileName: input.fileName,
        });

        // Save to database
        const clone = await createVoiceClone({
          userId: ctx.user.id,
          voiceId,
          name: input.name,
          originalAudioUrl: audioUrl,
          originalAudioKey: fileKey,
        });

        return clone;
      }),

    // Delete a cloned voice
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Note: We're not deleting from ElevenLabs API to avoid errors if already deleted
        await deleteVoiceClone(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  tts: router({
    // Generate speech from text
    generate: protectedProcedure
      .input(z.object({
        text: z.string().min(1),
        voiceId: z.string(),
        voiceName: z.string(),
        sourceLanguage: z.string().optional(),
        targetLanguage: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Translate text if requested
        let textToGenerate = input.text;
        if (input.targetLanguage) {
          try {
            let sourceLang = input.sourceLanguage;
            
            // Auto-detect if source language not specified
            if (!sourceLang) {
              const detectionResponse = await invokeLLM({
                messages: [
                  {
                    role: "system",
                    content: "You are a language detection expert. Identify the language of the given text and respond with ONLY the language name in English (e.g., 'Spanish', 'French', 'Japanese'). Nothing else.",
                  },
                  {
                    role: "user",
                    content: input.text,
                  },
                ],
              });
              const detectedLang = detectionResponse.choices[0].message.content;
              sourceLang = typeof detectedLang === 'string' ? detectedLang.trim() : 'Unknown';
              console.log(`Auto-detected input language: ${sourceLang}`);
            } else {
              console.log(`Using manually selected source language: ${sourceLang}`);
            }
            
            console.log(`Translating from ${sourceLang} to ${input.targetLanguage}`);

            // Translate from source language to target language
            const translationResponse = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content: `You are a professional translator. The input text is in ${sourceLang}. Translate it to ${input.targetLanguage}. Only return the translated text, nothing else.`,
                },
                {
                  role: "user",
                  content: input.text,
                },
              ],
            });
            const content = translationResponse.choices[0].message.content;
            textToGenerate = typeof content === 'string' ? content : input.text;
          } catch (error) {
            console.error("Translation failed, using original text:", error);
          }
        }

        // Generate speech using ElevenLabs (with chunking for long texts)
        const { audioBuffer, chunkCount } = await generateLongSpeech({
          text: textToGenerate,
          voiceId: input.voiceId,
          userId: ctx.user.id,
        });
        
        if (chunkCount > 1) {
          console.log(`Generated speech from ${chunkCount} chunks`);
        }

        // Upload to S3
        const fileKey = `${ctx.user.id}/audio/${Date.now()}-${generateRandomSuffix()}.mp3`;
        const { url: audioUrl } = await storagePut(
          fileKey,
          audioBuffer,
          "audio/mpeg"
        );

        // Generate share token
        const shareToken = generateShareToken();

        // Save to database
        const audioFile = await createAudioFile({
          userId: ctx.user.id,
          text: textToGenerate,
          voiceId: input.voiceId,
          voiceName: input.voiceName,
          audioUrl,
          audioKey: fileKey,
          format: "mp3",
          shareToken,
        });

        return audioFile;
      }),

    // Get user's generated audio files
    getMyAudios: protectedProcedure.query(async ({ ctx }) => {
      return getUserAudioFiles(ctx.user.id);
    }),

    // Get shared audio by token (public access)
    getShared: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        return getAudioFileByShareToken(input.token);
      }),

    // Delete an audio file
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteAudioFile(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
