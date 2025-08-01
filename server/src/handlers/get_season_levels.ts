
import { type Level } from '../schema';

export async function getSeasonLevels(seasonId: number): Promise<Level[]> {
  // This is a placeholder declaration! Real code should be implemented here.
  // The goal of this handler is fetching all levels for a specific season,
  // ordered by level number, to display the competition roadmap.
  return [
    {
      id: 1,
      season_id: seasonId,
      level_number: 1,
      name: 'Initial Pitch',
      description: 'Submit your business idea concept',
      submission_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      is_active: true,
      created_at: new Date()
    }
  ];
}
