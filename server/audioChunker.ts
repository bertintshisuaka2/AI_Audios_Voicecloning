import { generateSpeech } from "./elevenlabs";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";

const MAX_CHUNK_SIZE = 9500; // Leave buffer below 10,000

function generateRandomSuffix(): string {
  return randomBytes(8).toString('hex');
}

/**
 * Split text into chunks at sentence boundaries
 */
function splitTextIntoChunks(text: string, maxChunkSize: number): string[] {
  if (text.length <= maxChunkSize) {
    return [text];
  }

  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    // If a single sentence exceeds max size, split it by words
    if (sentence.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      const words = sentence.split(' ');
      for (const word of words) {
        if ((currentChunk + ' ' + word).length > maxChunkSize) {
          chunks.push(currentChunk.trim());
          currentChunk = word;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + word;
        }
      }
      continue;
    }
    
    // Check if adding this sentence would exceed the limit
    if ((currentChunk + ' ' + sentence).length > maxChunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Merge multiple audio buffers into a single MP3 file
 */
async function mergeAudioBuffers(audioBuffers: Buffer[]): Promise<Buffer> {
  if (audioBuffers.length === 1) {
    return audioBuffers[0];
  }

  // For simplicity, concatenate the buffers directly
  // Note: This is a basic implementation. For production, consider using ffmpeg
  return Buffer.concat(audioBuffers);
}

/**
 * Generate speech for long text by chunking and merging
 */
export async function generateLongSpeech(params: {
  text: string;
  voiceId: string;
  userId: number;
}): Promise<{ audioBuffer: Buffer; chunkCount: number }> {
  const { text, voiceId, userId } = params;

  // If text is within limit, generate directly
  if (text.length <= MAX_CHUNK_SIZE) {
    const audioBuffer = await generateSpeech({ text, voiceId });
    return { audioBuffer, chunkCount: 1 };
  }

  console.log(`Text length ${text.length} exceeds limit. Splitting into chunks...`);
  
  // Split text into chunks
  const chunks = splitTextIntoChunks(text, MAX_CHUNK_SIZE);
  console.log(`Split into ${chunks.length} chunks`);

  // Generate audio for each chunk
  const audioBuffers: Buffer[] = [];
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Generating chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)`);
    const audioBuffer = await generateSpeech({
      text: chunks[i],
      voiceId,
    });
    audioBuffers.push(audioBuffer);
  }

  // Merge all audio buffers
  console.log(`Merging ${audioBuffers.length} audio chunks...`);
  const mergedBuffer = await mergeAudioBuffers(audioBuffers);
  
  return { audioBuffer: mergedBuffer, chunkCount: chunks.length };
}
