import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, voiceClones, InsertVoiceClone, VoiceClone, audioFiles, InsertAudioFile, AudioFile } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Voice Clone helpers
export async function createVoiceClone(clone: InsertVoiceClone): Promise<VoiceClone> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(voiceClones).values(clone);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(voiceClones).where(eq(voiceClones.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getUserVoiceClones(userId: number): Promise<VoiceClone[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(voiceClones).where(eq(voiceClones.userId, userId)).orderBy(desc(voiceClones.createdAt));
}

export async function deleteVoiceClone(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(voiceClones).where(eq(voiceClones.id, id));
  return result[0].affectedRows > 0;
}

export async function getVoiceCloneById(id: number): Promise<VoiceClone | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(voiceClones).where(eq(voiceClones.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Audio File helpers
export async function createAudioFile(audio: InsertAudioFile): Promise<AudioFile> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(audioFiles).values(audio);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(audioFiles).where(eq(audioFiles.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getUserAudioFiles(userId: number): Promise<AudioFile[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(audioFiles).where(eq(audioFiles.userId, userId)).orderBy(desc(audioFiles.createdAt));
}

export async function getAudioFileByShareToken(shareToken: string): Promise<AudioFile | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(audioFiles).where(eq(audioFiles.shareToken, shareToken)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function deleteAudioFile(id: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db.delete(audioFiles).where(eq(audioFiles.id, id));
  return result[0].affectedRows > 0;
}
