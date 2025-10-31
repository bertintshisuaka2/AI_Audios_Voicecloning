import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Voice clones table - stores user-created voice clones
 */
export const voiceClones = mysqlTable("voiceClones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** ElevenLabs voice ID returned from the API */
  voiceId: varchar("voiceId", { length: 128 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  /** S3 URL of the original audio file used for cloning */
  originalAudioUrl: text("originalAudioUrl").notNull(),
  /** S3 key for the audio file */
  originalAudioKey: text("originalAudioKey").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VoiceClone = typeof voiceClones.$inferSelect;
export type InsertVoiceClone = typeof voiceClones.$inferInsert;

/**
 * Generated audio files table - stores TTS outputs
 */
export const audioFiles = mysqlTable("audioFiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  /** Text that was converted to speech */
  text: text("text").notNull(),
  /** Voice ID used (ElevenLabs voice ID or cloned voice ID) */
  voiceId: varchar("voiceId", { length: 128 }).notNull(),
  /** Voice name for display */
  voiceName: varchar("voiceName", { length: 255 }).notNull(),
  /** S3 URL of the generated audio file */
  audioUrl: text("audioUrl").notNull(),
  /** S3 key for the audio file */
  audioKey: text("audioKey").notNull(),
  /** Audio format (mp3, wav, etc.) */
  format: varchar("format", { length: 20 }).notNull().default("mp3"),
  /** Shareable token for public access */
  shareToken: varchar("shareToken", { length: 64 }).unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AudioFile = typeof audioFiles.$inferSelect;
export type InsertAudioFile = typeof audioFiles.$inferInsert;
