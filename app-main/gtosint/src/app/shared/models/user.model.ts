export interface User {
  _id: string | null;
  email: string | null;
  password: string | null;
  name: string | null;
  pseudos: string[];
  countries: string | null;
  games: string[];
}