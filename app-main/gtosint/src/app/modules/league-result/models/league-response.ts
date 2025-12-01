export interface LeagueResponse {
    id: string;
    name: string;
    slug: string;
    region: string;
    image: string;
    priority: number;
    displayPriority: {
      position: number;
      status: 'force_selected' | 'selected';
    };
  }