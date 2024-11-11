export interface League {
    id: number;
    name: string;
    country_id: number;
  }
  
  export interface Team {
    id: number;
    team_api_id: number;
    team_long_name: string;
    team_short_name: string;
  }
  
  export interface Match {
    id: number;
    date: string;
    season: string;
    stage: number;
    home_team_goal: number;
    away_team_goal: number;
    home_team_api_id: number;
    away_team_api_id: number;
    homeTeam: {
      team_long_name: string;
    };
    awayTeam: {
      team_long_name: string;
    };
    league: {
      name: string;
    };
  }
  
  // API 응답 타입도 정의하면 좋습니다
  export interface ApiResponse<T> {
    data: T;
    error?: string;
  }