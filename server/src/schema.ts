
import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  username: z.string(),
  password_hash: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  profile_image_url: z.string().nullable(),
  is_admin: z.boolean(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Season schema
export const seasonSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  is_active: z.boolean(),
  max_participants: z.number().int(),
  elimination_percentage: z.number(),
  created_at: z.coerce.date()
});

export type Season = z.infer<typeof seasonSchema>;

// Level schema
export const levelSchema = z.object({
  id: z.number(),
  season_id: z.number(),
  level_number: z.number().int(),
  name: z.string(),
  description: z.string(),
  submission_deadline: z.coerce.date(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Level = z.infer<typeof levelSchema>;

// Pitch schema
export const pitchSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  level_id: z.number(),
  title: z.string(),
  description: z.string(),
  image_url: z.string(),
  profit_projection: z.number(),
  submitted_at: z.coerce.date(),
  created_at: z.coerce.date()
});

export type Pitch = z.infer<typeof pitchSchema>;

// AI Evaluation schema
export const aiEvaluationSchema = z.object({
  id: z.number(),
  pitch_id: z.number(),
  agent_name: z.string(),
  score: z.number(),
  feedback: z.string(),
  criteria_scores: z.string(), // JSON string containing detailed scores
  evaluated_at: z.coerce.date()
});

export type AIEvaluation = z.infer<typeof aiEvaluationSchema>;

// User Progress schema
export const userProgressSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  season_id: z.number(),
  current_level: z.number().int(),
  total_points: z.number(),
  is_eliminated: z.boolean(),
  elimination_date: z.coerce.date().nullable(),
  final_rank: z.number().int().nullable(),
  badge_earned: z.enum(['GOLD', 'SILVER', 'BRONZE']).nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type UserProgress = z.infer<typeof userProgressSchema>;

// Achievement schema
export const achievementSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  season_id: z.number(),
  achievement_type: z.enum(['LEVEL_COMPLETE', 'TOP_SCORE', 'FINAL_BADGE']),
  title: z.string(),
  description: z.string(),
  icon_url: z.string().nullable(),
  earned_at: z.coerce.date()
});

export type Achievement = z.infer<typeof achievementSchema>;

// Input schemas for creating entities
export const registerUserInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1)
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const createSeasonInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  max_participants: z.number().int().positive(),
  elimination_percentage: z.number().min(0).max(1)
});

export type CreateSeasonInput = z.infer<typeof createSeasonInputSchema>;

export const createLevelInputSchema = z.object({
  season_id: z.number(),
  level_number: z.number().int().positive(),
  name: z.string(),
  description: z.string(),
  submission_deadline: z.coerce.date()
});

export type CreateLevelInput = z.infer<typeof createLevelInputSchema>;

export const submitPitchInputSchema = z.object({
  level_id: z.number(),
  title: z.string().min(1).max(200),
  description: z.string().min(50),
  image_url: z.string().url(),
  profit_projection: z.number().positive()
});

export type SubmitPitchInput = z.infer<typeof submitPitchInputSchema>;

export const updateUserProfileInputSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  profile_image_url: z.string().url().nullable().optional()
});

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileInputSchema>;

// Auth response schema
export const authResponseSchema = z.object({
  user: userSchema.omit({ password_hash: true }),
  token: z.string()
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
