# Voice TTS & Clone - Project TODO

## Core Features

- [x] Database schema for voice clones and audio files
- [x] ElevenLabs API integration for TTS
- [x] ElevenLabs API integration for voice cloning
- [x] Upload audio file for voice cloning
- [x] Text-to-speech with masculine voice options
- [x] Text-to-speech with custom cloned voices
- [x] Download generated audio (MP3 format)
- [x] Share audio via public link
- [x] User authentication and voice management
- [x] Frontend UI for text input and voice selection
- [x] Frontend UI for audio upload
- [x] Frontend UI for audio playback
- [x] Frontend UI for download and share functionality
- [x] Mobile-responsive design
- [x] Error handling and loading states

## Updated Requirements

- [x] Support for feminine voice options (in addition to masculine)
- [x] Voice selection UI showing both masculine and feminine pre-built voices


## Bugs to Fix

- [x] Fix ElevenLabs API "Unauthorized" error when fetching voices

## New Features

- [x] Add language translation switch for generated speech
- [x] Translate text to English before generating speech with cloned voice

- [x] Add support for translating to multiple languages (not just English)
- [x] Add language selector dropdown for translation target

- [x] Add automatic input language detection
- [x] Display detected language to user (via console logs)

- [x] Add source language dropdown for manual selection
- [x] Allow users to override automatic language detection

## Bugs

- [x] Fix ElevenLabs 10,000 character limit error
- [x] Add text length validation before generation
- [x] Add character counter to show remaining characters

- [ ] Add custom user photo as app logo

## New Features

- [x] Implement smart sentence-based text splitting for long texts
- [x] Generate multiple audio chunks for texts over 10,000 characters
- [x] Merge audio chunks into single continuous file
- [x] Update UI to show chunking progress

- [x] Change color scheme to yellow and black theme

- [x] Add "Divalaser Software Solutions" branding at the top
- [x] Add user photo to branding
- [x] Create 4-digit PIN login page

- [x] Create main dashboard after PIN login
- [x] Add Recent Activity section to dashboard
- [x] Add Quick Links section to dashboard

- [x] Change yellow color scheme to white

- [x] Add ElevenLabs credit balance checker
- [x] Add credit usage estimator before generation
- [x] Prevent generation attempts that exceed available balance
- [x] Display warning when credits are low
