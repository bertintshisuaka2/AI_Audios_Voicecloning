# Divalaser Voice TTS & Clone Platform

A professional text-to-speech and voice cloning platform powered by ElevenLabs API, featuring multi-language translation, credit management, and secure PIN authentication.

## Features

### 🎙️ Text-to-Speech Generation
- Convert text to natural-sounding speech using pre-built masculine and feminine voices
- Support for unlimited text length with automatic sentence-based chunking
- Real-time credit cost estimation
- Multi-language translation support (15+ languages)
- Automatic language detection

### 🎭 Voice Cloning
- Clone any voice from uploaded audio files (MP3, WAV, OGG)
- Instant voice cloning using ElevenLabs API
- Manage and organize custom cloned voices
- Use cloned voices for text-to-speech generation

### 🌍 Multi-Language Support
- Translate text to 15+ languages before speech generation
- Automatic source language detection
- Manual source language override option
- Supported languages: English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Hindi, Dutch, Polish, Turkish

### 💳 Credit Management
- Real-time credit balance display
- Cost estimation before generation
- Low credit warning notifications (< 5000 credits)
- Automatic prevention of insufficient credit attempts
- Direct link to purchase more credits

### 📚 Audio Library
- Store and manage all generated audio files
- Audio playback controls
- Download audio files (MP3 format)
- Share audio via public links
- Delete unwanted audio files

### 🔐 Security
- 4-digit PIN authentication
- Secure session management
- User authentication via Manus OAuth

### 📊 Dashboard
- Welcome message with user greeting
- Statistics cards (total audio files, voice clones, account status)
- Quick links to main features
- Recent activity feed showing latest 5 generated audio files

## Technology Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **tRPC** - End-to-end type-safe API
- **Wouter** - Lightweight routing
- **shadcn/ui** - High-quality UI components

### Backend
- **Node.js** - Runtime environment
- **Express 4** - Web server framework
- **tRPC 11** - Type-safe API layer
- **Drizzle ORM** - Database toolkit
- **MySQL/TiDB** - Database

### External Services
- **ElevenLabs API** - Text-to-speech and voice cloning
- **Manus OAuth** - Authentication
- **S3 Storage** - Audio file storage
- **Manus LLM** - Language translation

## Installation

### Prerequisites
- Node.js 22.x or higher
- pnpm package manager
- MySQL/TiDB database
- ElevenLabs API key

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd voice-tts-app
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Required environment variables (automatically injected by Manus platform):
- `DATABASE_URL` - MySQL/TiDB connection string
- `ELEVENLABS_API_KEY` - ElevenLabs API key
- `JWT_SECRET` - Session signing secret
- `OAUTH_SERVER_URL` - Manus OAuth server URL
- `VITE_OAUTH_PORTAL_URL` - OAuth login portal URL
- `VITE_APP_ID` - Application ID
- `VITE_APP_TITLE` - Application title
- `VITE_APP_LOGO` - Application logo URL
- `BUILT_IN_FORGE_API_URL` - Manus built-in API URL
- `BUILT_IN_FORGE_API_KEY` - Manus API key

4. **Push database schema**
```bash
pnpm db:push
```

5. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Usage

### Getting Started

1. **Access the platform** - Navigate to the application URL
2. **Enter PIN** - Use the 4-digit PIN (default: 1234) to access the platform
3. **View Dashboard** - See your statistics and quick links

### Generating Speech

1. Navigate to the **Generate** tab
2. Enter or paste your text (up to 10,000 characters per chunk)
3. Select a voice from the dropdown (masculine, feminine, or custom cloned)
4. Optional: Enable translation and select target language
5. Check the estimated credit cost
6. Click **Generate Speech**
7. Listen to the generated audio or download/share it

### Cloning a Voice

1. Navigate to the **Clone Voice** tab
2. Enter a name for your custom voice
3. Upload an audio file (MP3, WAV, or OGG format)
4. Click **Clone Voice**
5. Your cloned voice will appear in the voice selector

### Managing Audio Files

1. Navigate to the **My Library** tab
2. View all your generated audio files
3. Click play to listen
4. Download files using the download button
5. Share files via public link
6. Delete unwanted files

## Configuration

### PIN Authentication

Default PIN: `1234`

To change the PIN, modify the `PinLogin.tsx` component or implement a database-backed PIN system.

### Credit Threshold

Low credit warning appears when balance drops below 5,000 credits.

To adjust the threshold, modify line 216 in `client/src/pages/Home.tsx`:
```typescript
{creditInfo && (creditInfo.characterLimit - creditInfo.characterCount) < 5000 && (
```

### Supported Audio Formats

**Upload (Voice Cloning):**
- MP3
- WAV
- OGG

**Output (Generated Speech):**
- MP3 (44.1kHz, 128kbps)

## Database Schema

### Tables

**users**
- `id` - Auto-increment primary key
- `openId` - Manus OAuth identifier (unique)
- `name` - User's display name
- `email` - User's email address
- `loginMethod` - Authentication method
- `role` - User role (user/admin)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp
- `lastSignedIn` - Last sign-in timestamp

**voiceClones**
- `id` - Auto-increment primary key
- `userId` - Foreign key to users table
- `voiceId` - ElevenLabs voice ID
- `name` - Custom voice name
- `createdAt` - Creation timestamp

**audioFiles**
- `id` - Auto-increment primary key
- `userId` - Foreign key to users table
- `text` - Original text used for generation
- `voiceName` - Voice used for generation
- `audioUrl` - S3 storage URL
- `shareToken` - Unique token for public sharing
- `createdAt` - Creation timestamp

## API Endpoints

### Authentication
- `GET /api/oauth/callback` - OAuth callback handler
- `POST /api/trpc/auth.logout` - Logout user

### Credits
- `GET /api/trpc/credits.getBalance` - Get user's credit balance
- `GET /api/trpc/credits.estimateCost` - Estimate credit cost for text

### Voices
- `GET /api/trpc/voices.getAvailable` - Get all available pre-built voices
- `GET /api/trpc/voices.getMy` - Get user's cloned voices
- `POST /api/trpc/voices.clone` - Clone a new voice
- `DELETE /api/trpc/voices.delete` - Delete a cloned voice

### Text-to-Speech
- `POST /api/trpc/tts.generate` - Generate speech from text
- `GET /api/trpc/tts.getMyAudios` - Get user's audio files
- `GET /api/trpc/tts.getSharedAudio` - Get shared audio by token
- `DELETE /api/trpc/tts.deleteAudio` - Delete an audio file

## Deployment

### Manus Platform

The application is designed to run on the Manus platform with automatic deployment:

1. Save a checkpoint in the development environment
2. Click the **Publish** button in the Management UI
3. Your application will be deployed with automatic SSL and CDN

### Custom Domain

To use a custom domain:

1. Configure DNS records:
   - **CNAME:** `yourdomain.com` → `cname.manus.space`
   - **OR A Records:** `yourdomain.com` → `104.18.26.246` and `104.18.27.246`

2. Add domain in Management UI → Settings → Domains

3. Wait for DNS propagation (5 minutes to 48 hours)

## Troubleshooting

### "Unauthorized" Error
- Verify your ElevenLabs API key is correctly configured
- Ensure the API key has required permissions: `voices_read`, `voices_write`, `text_to_speech`

### "Quota Exceeded" Error
- Check your credit balance in the top-right corner
- Purchase more credits at https://elevenlabs.io/pricing
- Use shorter text to reduce credit consumption

### Voice Cloning Fails
- Ensure audio file is in supported format (MP3, WAV, OGG)
- Check that audio file is under 16MB
- Verify API key has `voices_write` permission

### Long Text Generation Issues
- The platform automatically chunks text over 10,000 characters
- Each chunk is processed separately and merged
- Ensure sufficient credits for the entire text length

## Credits and Attribution

- **ElevenLabs** - Text-to-speech and voice cloning API
- **Manus Platform** - Hosting and infrastructure
- **shadcn/ui** - UI component library
- **Lucide Icons** - Icon library

## License

Proprietary - © 2025 Divalaser Software Solutions. All rights reserved.

## Support

For technical support or questions:
- Visit: https://help.manus.im
- Email: support@divalasersoftwaresolutions.tech

## Version History

### v1.0.0 (Current)
- Initial release
- Text-to-speech with pre-built voices
- Voice cloning from audio files
- Multi-language translation support
- Credit management system
- PIN authentication
- Dashboard with statistics
- Audio library with sharing
