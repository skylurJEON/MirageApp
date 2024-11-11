export interface Team {
    team_api_id: number;
    team_long_name: string;
    team_short_name: string;
  }
  
  export interface League {
    id: number;
    name: string;
    country_id: number;
  }
  
  export interface Match {
    id: number;
    date: string;
    season: string;
    home_team_goal: number;
    away_team_goal: number;
    homeTeam?: {
      team_long_name: string;
    };
    awayTeam?: {
      team_long_name: string;
    };
    league?: {
      name: string;
    };
  }
  
  export interface MatchResponse {
    data: Match[];
    meta: {
      total: number;
      page: number;
      limit: number;
      last_page: number;
    };
  }