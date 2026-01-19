
import { pgTable, text, serial, integer, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const high_scores = pgTable("high_scores", {
  id: serial("id").primaryKey(),
  playerName: text("player_name").notNull(),
  score: integer("score").notNull(),
  maxIslandReached: integer("max_island_reached").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHighScoreSchema = createInsertSchema(high_scores).omit({ 
  id: true, 
  createdAt: true 
});

export type HighScore = typeof high_scores.$inferSelect;
export type InsertHighScore = z.infer<typeof insertHighScoreSchema>;
