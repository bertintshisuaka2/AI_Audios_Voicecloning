# Voice TTS & Clone User Guide

## Purpose

Transform text into natural speech using AI-powered voices and create custom voice clones from audio samples.

## Access

Login required. All users can generate speech and clone voices.

## Powered by Manus

This application leverages cutting-edge AI technology to deliver professional-grade voice synthesis:

**Technology Stack:**
- **Frontend**: React 19 with TypeScript, Tailwind CSS 4, and shadcn/ui components for a modern, responsive interface
- **Backend**: Express 4 with tRPC 11 for type-safe API communication
- **Database**: MySQL with Drizzle ORM for efficient data management
- **Authentication**: Manus OAuth for secure user authentication
- **Voice AI**: ElevenLabs API for advanced text-to-speech and instant voice cloning
- **Storage**: AWS S3 for reliable audio file storage with global CDN delivery
- **Deployment**: Auto-scaling infrastructure with global CDN for optimal performance worldwide

## Using Your Website

### Generating Speech

Navigate to the "Generate" tab to convert text into speech. Enter your text in the text area, then click the "Voice" dropdown to select from pre-built voices including masculine and feminine options. Each voice displays its characteristics in parentheses. After selecting a voice, click "Generate Speech" to create your audio. The generated file appears in "My Library" where you can play, download, or share it.

### Cloning a Voice

Switch to the "Clone Voice" tab to create custom voices. Enter a name for your voice clone, then click "Choose File" to upload an audio sample. For best results, use at least 10 seconds of clear audio in MP3, WAV, or OGG format. Click "Clone Voice" to process the upload. Your cloned voice appears in the list below and becomes available in the voice selector for speech generation.

### Managing Your Library

Access "My Library" to view all generated audio files. Each entry shows the voice used, text content, and creation date. Use the built-in audio player to listen, click "Download" to save the MP3 file, or click "Share" to copy a public link to your clipboard. The share link allows anyone to listen to your audio without logging in.

## Managing Your Website

Use the Management UI (accessible via the header icon) to configure your application:

- **Settings → General**: Update website name and logo
- **Settings → Secrets**: Manage your ElevenLabs API key
- **Dashboard**: Monitor usage and analytics
- **Database**: View and manage voice clones and audio files

## Next Steps

Talk to Manus AI anytime to request changes or add features. Try generating speech with different voices to find your favorite, or clone your own voice to create personalized audio content.
