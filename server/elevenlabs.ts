/**
 * ElevenLabs API integration for text-to-speech and voice cloning
 */

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category?: string;
  labels?: Record<string, string>;
  description?: string;
}

export interface VoiceCloneParams {
  name: string;
  audioBuffer: Buffer;
  fileName: string;
}

export interface TextToSpeechParams {
  text: string;
  voiceId: string;
  modelId?: string;
  outputFormat?: string;
}

/**
 * Get all available voices from ElevenLabs
 */
export async function getElevenLabsVoices(): Promise<ElevenLabsVoice[]> {
  if (!ELEVENLABS_API_KEY) {
    console.warn("ELEVENLABS_API_KEY is not configured");
    return [];
  }

  try {
    const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch voices: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error("Error fetching ElevenLabs voices:", error);
    return [];
  }
}

/**
 * Create a voice clone from an audio file
 */
export async function createVoiceClone(params: VoiceCloneParams): Promise<string> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  const formData = new FormData();
  formData.append("name", params.name);
  
  // Create a Blob from the buffer
  const blob = new Blob([params.audioBuffer as any], { type: "audio/mpeg" });
  formData.append("files", blob as any, params.fileName);

  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/add`, {
    method: "POST",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to clone voice: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.voice_id;
}

/**
 * Generate speech from text using a voice
 */
export async function generateSpeech(params: TextToSpeechParams): Promise<Buffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${params.voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: params.text,
        model_id: params.modelId || "eleven_multilingual_v2",
        output_format: params.outputFormat || "mp3_44100_128",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate speech: ${response.statusText} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Delete a voice clone
 */
export async function deleteVoiceClone(voiceId: string): Promise<void> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is not configured");
  }

  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/${voiceId}`, {
    method: "DELETE",
    headers: {
      "xi-api-key": ELEVENLABS_API_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete voice: ${response.statusText}`);
  }
}
