export interface Player {
  id: number | null;
  name: string | null;
  email: string | null;
  pseudos: string[] | string | null;
  games: string[] | null;
  countries: string | null;
}