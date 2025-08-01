
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  registerUserInputSchema, 
  loginInputSchema, 
  createSeasonInputSchema,
  createLevelInputSchema,
  submitPitchInputSchema,
  updateUserProfileInputSchema
} from './schema';

// Import handlers
import { registerUser } from './handlers/register_user';
import { loginUser } from './handlers/login_user';
import { getActiveSeason } from './handlers/get_active_season';
import { createSeason } from './handlers/create_season';
import { getSeasonLevels } from './handlers/get_season_levels';
import { submitPitch } from './handlers/submit_pitch';
import { getUserProgress } from './handlers/get_user_progress';
import { getUserAchievements } from './handlers/get_user_achievements';
import { evaluatePitch } from './handlers/evaluate_pitch';
import { updateUserProfile } from './handlers/update_user_profile';
import { getLeaderboard } from './handlers/get_leaderboard';
import { processEliminations } from './handlers/process_eliminations';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  registerUser: publicProcedure
    .input(registerUserInputSchema)
    .mutation(({ input }) => registerUser(input)),

  loginUser: publicProcedure
    .input(loginInputSchema)
    .mutation(({ input }) => loginUser(input)),

  // Season management
  getActiveSeason: publicProcedure
    .query(() => getActiveSeason()),

  createSeason: publicProcedure
    .input(createSeasonInputSchema)
    .mutation(({ input }) => createSeason(input)),

  getSeasonLevels: publicProcedure
    .input(z.object({ seasonId: z.number() }))
    .query(({ input }) => getSeasonLevels(input.seasonId)),

  // Pitch submission and evaluation
  submitPitch: publicProcedure
    .input(z.object({ userId: z.number() }).merge(submitPitchInputSchema))
    .mutation(({ input }) => submitPitch(input.userId, input)),

  evaluatePitch: publicProcedure
    .input(z.object({ pitchId: z.number() }))
    .mutation(({ input }) => evaluatePitch(input.pitchId)),

  // User progress and achievements
  getUserProgress: publicProcedure
    .input(z.object({ userId: z.number(), seasonId: z.number() }))
    .query(({ input }) => getUserProgress(input.userId, input.seasonId)),

  getUserAchievements: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(({ input }) => getUserAchievements(input.userId)),

  updateUserProfile: publicProcedure
    .input(z.object({ userId: z.number() }).merge(updateUserProfileInputSchema))
    .mutation(({ input }) => updateUserProfile(input.userId, input)),

  // Competition features
  getLeaderboard: publicProcedure
    .input(z.object({ seasonId: z.number(), limit: z.number().optional() }))
    .query(({ input }) => getLeaderboard(input.seasonId, input.limit)),

  processEliminations: publicProcedure
    .input(z.object({ seasonId: z.number(), levelId: z.number() }))
    .mutation(({ input }) => processEliminations(input.seasonId, input.levelId))
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Slickbiz TRPC server listening at port: ${port}`);
}

start();
