# Divalaser Voice TTS & Clone - Project Structure

## Overview

This document provides a comprehensive overview of the project's file structure and organization.

## Directory Tree

```
voice-tts-app/
├── client/                          # Frontend application
│   ├── public/                      # Static assets
│   │   ├── logo.png                # Divalaser logo image
│   │   └── .gitkeep
│   ├── src/                        # Source code
│   │   ├── _core/                  # Core framework utilities
│   │   │   └── hooks/              # Core React hooks
│   │   ├── components/             # React components
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── AIChatBox.tsx       # AI chat interface component
│   │   │   ├── DashboardLayout.tsx # Dashboard layout wrapper
│   │   │   ├── DashboardLayoutSkeleton.tsx # Loading skeleton
│   │   │   ├── ErrorBoundary.tsx   # Error handling component
│   │   │   └── ManusDialog.tsx     # Dialog component
│   │   ├── contexts/               # React contexts
│   │   │   └── ThemeContext.tsx    # Theme management context
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── useComposition.ts   # Composition hook
│   │   │   ├── useMobile.tsx       # Mobile detection hook
│   │   │   └── usePersistFn.ts     # Function persistence hook
│   │   ├── lib/                    # Utility libraries
│   │   │   ├── trpc.ts             # tRPC client configuration
│   │   │   └── utils.ts            # Utility functions
│   │   ├── pages/                  # Page components
│   │   │   ├── ComponentShowcase.tsx # UI component showcase
│   │   │   ├── Dashboard.tsx       # Main dashboard page
│   │   │   ├── Home.tsx            # Home page with TTS interface
│   │   │   ├── NotFound.tsx        # 404 error page
│   │   │   ├── PinLogin.tsx        # PIN authentication page
│   │   │   └── SharedAudio.tsx     # Public audio sharing page
│   │   ├── App.tsx                 # Main app component with routing
│   │   ├── const.ts                # Frontend constants
│   │   ├── index.css               # Global styles and Tailwind config
│   │   └── main.tsx                # Application entry point
│   └── index.html                  # HTML template
│
├── drizzle/                        # Database management
│   ├── meta/                       # Migration metadata
│   │   ├── 0000_snapshot.json      # Initial schema snapshot
│   │   ├── 0001_snapshot.json      # Second schema snapshot
│   │   └── _journal.json           # Migration journal
│   ├── migrations/                 # SQL migration files directory
│   ├── 0000_black_blob.sql         # Initial migration
│   ├── 0001_special_vapor.sql      # Second migration
│   ├── relations.ts                # Database relations
│   └── schema.ts                   # Database schema definition
│
├── patches/                        # Package patches
│   └── wouter@3.7.1.patch          # Wouter router patch
│
├── server/                         # Backend application
│   ├── _core/                      # Core framework utilities
│   │   ├── types/                  # TypeScript type definitions
│   │   │   ├── cookie.d.ts         # Cookie type definitions
│   │   │   └── manusTypes.ts       # Manus platform types
│   │   ├── context.ts              # tRPC context builder
│   │   ├── cookies.ts              # Cookie management utilities
│   │   ├── dataApi.ts              # Data API integration
│   │   ├── env.ts                  # Environment variable validation
│   │   ├── imageGeneration.ts      # Image generation service
│   │   ├── index.ts                # Server entry point
│   │   ├── llm.ts                  # LLM integration for translation
│   │   ├── notification.ts         # Owner notification service
│   │   ├── oauth.ts                # OAuth authentication handler
│   │   ├── sdk.ts                  # Manus SDK integration
│   │   ├── systemRouter.ts         # System-level tRPC routes
│   │   ├── trpc.ts                 # tRPC server configuration
│   │   ├── vite.ts                 # Vite dev server integration
│   │   └── voiceTranscription.ts   # Voice transcription service
│   ├── audioChunker.ts             # Long text audio chunking utility
│   ├── db.ts                       # Database query helpers
│   ├── elevenlabs.ts               # ElevenLabs API integration
│   ├── routers.ts                  # Application tRPC routes
│   └── storage.ts                  # S3 storage helpers
│
├── shared/                         # Shared code between client/server
│   ├── _core/                      # Core shared utilities
│   │   └── errors.ts               # Error definitions
│   ├── const.ts                    # Shared constants
│   └── types.ts                    # Shared TypeScript types
│
├── .gitignore                      # Git ignore rules
├── .prettierignore                 # Prettier ignore rules
├── .prettierrc                     # Prettier configuration
├── README.md                       # Project documentation
├── PROJECT_STRUCTURE.md            # This file
├── components.json                 # shadcn/ui configuration
├── drizzle.config.ts               # Drizzle ORM configuration
├── package.json                    # NPM package configuration
├── pnpm-lock.yaml                  # PNPM lock file
├── todo.md                         # Project task tracking
├── tsconfig.json                   # TypeScript configuration
├── userGuide.md                    # End-user documentation
├── vite.config.ts                  # Vite build configuration
└── vitest.config.ts                # Vitest test configuration
```

## Key Files Explained

### Frontend (Client)

#### Pages (`client/src/pages/`)
- **Home.tsx** - Main application page containing:
  - PIN authentication integration
  - Dashboard navigation
  - Text-to-speech generation interface
  - Voice cloning interface
  - Audio library management
  - Credit balance display
  - Low credit warning banner

- **Dashboard.tsx** - Dashboard page with:
  - Welcome message
  - Statistics cards (audio files, voice clones, account status)
  - Quick links to features
  - Recent activity feed

- **PinLogin.tsx** - Authentication page with:
  - 4-digit PIN input
  - Divalaser branding
  - Default PIN: 1234

- **SharedAudio.tsx** - Public audio sharing page:
  - Accessible via share token
  - Audio playback without authentication

#### Components (`client/src/components/`)
- **ui/** - shadcn/ui component library
- **DashboardLayout.tsx** - Reusable dashboard layout with sidebar
- **AIChatBox.tsx** - AI chat interface component
- **ErrorBoundary.tsx** - Error handling wrapper

#### Core (`client/src/_core/`)
- Framework-level code provided by Manus platform
- Authentication hooks
- Core utilities

### Backend (Server)

#### Application Files (`server/`)
- **routers.ts** - Main tRPC router containing:
  - `auth` - Authentication routes (me, logout)
  - `credits` - Credit management (getBalance, estimateCost)
  - `voices` - Voice management (getAvailable, getMy, clone, delete)
  - `tts` - Text-to-speech (generate, getMyAudios, getSharedAudio, deleteAudio)

- **elevenlabs.ts** - ElevenLabs API integration:
  - `getElevenLabsVoices()` - Fetch available voices
  - `createVoiceClone()` - Clone voice from audio
  - `generateSpeech()` - Generate TTS audio
  - `getUserCredits()` - Get credit balance
  - `estimateCreditCost()` - Estimate cost
  - `deleteVoiceClone()` - Delete cloned voice

- **audioChunker.ts** - Long text processing:
  - `splitTextIntoChunks()` - Split text at sentence boundaries
  - `generateLongSpeech()` - Generate and merge audio chunks

- **db.ts** - Database helpers:
  - User management (upsertUser, getUserByOpenId)
  - Voice clone CRUD operations
  - Audio file CRUD operations

- **storage.ts** - S3 storage integration:
  - `storagePut()` - Upload files to S3
  - `storageGet()` - Get presigned URLs

#### Core Framework (`server/_core/`)
- **index.ts** - Express server setup
- **trpc.ts** - tRPC server configuration
- **oauth.ts** - Manus OAuth integration
- **llm.ts** - Language model for translation
- **notification.ts** - Owner notification system
- **env.ts** - Environment variable validation

### Database (Drizzle)

#### Schema (`drizzle/schema.ts`)
```typescript
// Users table
users {
  id: int (primary key)
  openId: varchar(64) (unique)
  name: text
  email: varchar(320)
  loginMethod: varchar(64)
  role: enum('user', 'admin')
  createdAt: timestamp
  updatedAt: timestamp
  lastSignedIn: timestamp
}

// Voice clones table
voiceClones {
  id: int (primary key)
  userId: int (foreign key → users.id)
  voiceId: varchar(255)
  name: varchar(255)
  createdAt: timestamp
}

// Audio files table
audioFiles {
  id: int (primary key)
  userId: int (foreign key → users.id)
  text: text
  voiceName: varchar(255)
  audioUrl: text
  shareToken: varchar(255) (unique)
  createdAt: timestamp
}
```

### Configuration Files

- **package.json** - Dependencies and scripts
- **tsconfig.json** - TypeScript compiler options
- **vite.config.ts** - Vite bundler configuration
- **drizzle.config.ts** - Database migration configuration
- **components.json** - shadcn/ui component configuration
- **.prettierrc** - Code formatting rules

### Documentation

- **README.md** - Complete project documentation
- **userGuide.md** - End-user guide
- **todo.md** - Development task tracking
- **PROJECT_STRUCTURE.md** - This file

## Technology Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS 4
- tRPC 11
- Wouter (routing)
- shadcn/ui (components)
- Lucide React (icons)

### Backend
- Node.js 22
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL/TiDB

### External Services
- ElevenLabs API (TTS & voice cloning)
- Manus OAuth (authentication)
- S3 (file storage)
- Manus LLM (translation)

## Development Workflow

### Starting Development
```bash
pnpm dev
```
Starts both frontend (Vite) and backend (Express) servers.

### Database Operations
```bash
pnpm db:push        # Push schema changes to database
pnpm db:generate    # Generate migration files
pnpm db:migrate     # Run migrations
```

### Building for Production
```bash
pnpm build          # Build frontend and backend
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `Dashboard.tsx`)
- **Utilities**: camelCase (e.g., `audioChunker.ts`)
- **Constants**: camelCase (e.g., `const.ts`)
- **Types**: camelCase with `.d.ts` extension (e.g., `cookie.d.ts`)
- **Styles**: kebab-case (e.g., `index.css`)

## Import Paths

The project uses path aliases configured in `tsconfig.json`:

- `@/` → `client/src/`
- `@shared/` → `shared/`

Example:
```typescript
import { Button } from "@/components/ui/button";
import { APP_TITLE } from "@/const";
```

## Environment Variables

All environment variables are automatically injected by the Manus platform:

**Required:**
- `DATABASE_URL`
- `ELEVENLABS_API_KEY`
- `JWT_SECRET`
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `VITE_APP_ID`

**Optional:**
- `VITE_APP_TITLE`
- `VITE_APP_LOGO`
- `OWNER_OPEN_ID`
- `OWNER_NAME`

## Port Configuration

- **Development Server**: 3000
- **API Endpoints**: `/api/*`
- **tRPC Endpoints**: `/api/trpc/*`
- **OAuth Callback**: `/api/oauth/callback`

## Build Output

- **Frontend**: `client/dist/`
- **Backend**: Compiled TypeScript in memory (tsx)
- **Static Assets**: Served from `client/public/`

## Version Control

- Git repository with `.gitignore` configured
- Excludes: `node_modules`, `dist`, `.env`, database files
- Includes: Source code, configuration, documentation

## Deployment

The project is designed for deployment on the Manus platform:
1. Save checkpoint in development
2. Click Publish in Management UI
3. Automatic SSL and CDN configuration
4. Custom domain support via DNS configuration
