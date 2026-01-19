
import { db } from "./db";
import { high_scores, type HighScore, type InsertHighScore } from "@shared/schema";

export interface IStorage {
  getHighScores(): Promise<HighScore[]>;
  createHighScore(score: InsertHighScore): Promise<HighScore>;
}

export class DatabaseStorage implements IStorage {
  async getHighScores(): Promise<HighScore[]> {
    return await db.select().from(high_scores).orderBy(high_scores.score);
  }

  async createHighScore(insertScore: InsertHighScore): Promise<HighScore> {
    const [score] = await db.insert(high_scores).values(insertScore).returning();
    return score;
  }
}

export const storage = new DatabaseStorage();
