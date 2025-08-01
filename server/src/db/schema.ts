
import { serial, text, pgTable, timestamp, numeric, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const badgeTypeEnum = pgEnum('badge_type', ['GOLD', 'SILVER', 'BRONZE']);
export const achievementTypeEnum = pgEnum('achievement_type', ['LEVEL_COMPLETE', 'TOP_SCORE', 'FINAL_BADGE']);

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  first_name: text('first_name').notNull(),
  last_name: text('last_name').notNull(),
  profile_image_url: text('profile_image_url'),
  is_admin: boolean('is_admin').default(false).notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Seasons table
export const seasonsTable = pgTable('seasons', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date').notNull(),
  is_active: boolean('is_active').default(false).notNull(),
  max_participants: integer('max_participants').notNull(),
  elimination_percentage: numeric('elimination_percentage', { precision: 3, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Levels table
export const levelsTable = pgTable('levels', {
  id: serial('id').primaryKey(),
  season_id: integer('season_id').notNull(),
  level_number: integer('level_number').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  submission_deadline: timestamp('submission_deadline').notNull(),
  is_active: boolean('is_active').default(true).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Pitches table
export const pitchesTable = pgTable('pitches', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  level_id: integer('level_id').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  image_url: text('image_url').notNull(),
  profit_projection: numeric('profit_projection', { precision: 15, scale: 2 }).notNull(),
  submitted_at: timestamp('submitted_at').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// AI Evaluations table
export const aiEvaluationsTable = pgTable('ai_evaluations', {
  id: serial('id').primaryKey(),
  pitch_id: integer('pitch_id').notNull(),
  agent_name: text('agent_name').notNull(),
  score: numeric('score', { precision: 5, scale: 2 }).notNull(),
  feedback: text('feedback').notNull(),
  criteria_scores: text('criteria_scores').notNull(), // JSON string
  evaluated_at: timestamp('evaluated_at').defaultNow().notNull()
});

// User Progress table
export const userProgressTable = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  season_id: integer('season_id').notNull(),
  current_level: integer('current_level').default(1).notNull(),
  total_points: numeric('total_points', { precision: 10, scale: 2 }).default('0').notNull(),
  is_eliminated: boolean('is_eliminated').default(false).notNull(),
  elimination_date: timestamp('elimination_date'),
  final_rank: integer('final_rank'),
  badge_earned: badgeTypeEnum('badge_earned'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Achievements table
export const achievementsTable = pgTable('achievements', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  season_id: integer('season_id').notNull(),
  achievement_type: achievementTypeEnum('achievement_type').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  icon_url: text('icon_url'),
  earned_at: timestamp('earned_at').defaultNow().notNull()
});

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  pitches: many(pitchesTable),
  progress: many(userProgressTable),
  achievements: many(achievementsTable)
}));

export const seasonsRelations = relations(seasonsTable, ({ many }) => ({
  levels: many(levelsTable),
  userProgress: many(userProgressTable),
  achievements: many(achievementsTable)
}));

export const levelsRelations = relations(levelsTable, ({ one, many }) => ({
  season: one(seasonsTable, {
    fields: [levelsTable.season_id],
    references: [seasonsTable.id]
  }),
  pitches: many(pitchesTable)
}));

export const pitchesRelations = relations(pitchesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [pitchesTable.user_id],
    references: [usersTable.id]
  }),
  level: one(levelsTable, {
    fields: [pitchesTable.level_id],
    references: [levelsTable.id]
  }),
  evaluations: many(aiEvaluationsTable)
}));

export const aiEvaluationsRelations = relations(aiEvaluationsTable, ({ one }) => ({
  pitch: one(pitchesTable, {
    fields: [aiEvaluationsTable.pitch_id],
    references: [pitchesTable.id]
  })
}));

export const userProgressRelations = relations(userProgressTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userProgressTable.user_id],
    references: [usersTable.id]
  }),
  season: one(seasonsTable, {
    fields: [userProgressTable.season_id],
    references: [seasonsTable.id]
  })
}));

export const achievementsRelations = relations(achievementsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [achievementsTable.user_id],
    references: [usersTable.id]
  }),
  season: one(seasonsTable, {
    fields: [achievementsTable.season_id],
    references: [seasonsTable.id]
  })
}));

// Export all tables
export const tables = {
  users: usersTable,
  seasons: seasonsTable,
  levels: levelsTable,
  pitches: pitchesTable,
  aiEvaluations: aiEvaluationsTable,
  userProgress: userProgressTable,
  achievements: achievementsTable
};
