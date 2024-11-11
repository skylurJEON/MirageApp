import { API_URL } from '../config';
import { MatchResponse } from '../types/match';

export const fetchMatches = async (
  leagueId?: number,
  page: number = 1,
  limit: number = 20
): Promise<MatchResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(leagueId && { league_id: leagueId.toString() }),
  });

  const response = await fetch(`${API_URL}/matches?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch matches');
  }
  return response.json();
};