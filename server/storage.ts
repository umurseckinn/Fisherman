
import { db } from "./db";
import { high_scores, type HighScore, type InsertHighScore } from "@shared/schema";

export interface IStorage {
  getHighScores(): Promise<HighScore[]>;
  createHighScore(score: InsertHighScore): Promise<HighScore>;
}

export class DatabaseStorage implements IStorage {
  async getHighScores(): Promise<HighScore[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(high_scores).orderBy(high_scores.score);
  }

  async createHighScore(insertScore: InsertHighScore): Promise<HighScore> {
    if (!db) throw new Error("Database not initialized");
    const [score] = await db.insert(high_scores).values(insertScore).returning();
    return score;
  }
}

export class MemStorage implements IStorage {
  private scores: HighScore[] = [];
  private currentId = 1;

  async getHighScores(): Promise<HighScore[]> {
    return this.scores.sort((a, b) => b.score - a.score);
  }

  async createHighScore(insertScore: InsertHighScore): Promise<HighScore> {
    const id = this.currentId++;
    const score: HighScore = {
      ...insertScore,
      id,
      createdAt: new Date(),
    };
    this.scores.push(score);
    return score;
  }
}

export const storage = db ? new DatabaseStorage() : new MemStorage();
