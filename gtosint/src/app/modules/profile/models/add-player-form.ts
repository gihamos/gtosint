import { FormControl } from '@angular/forms';
import { PlayerGame } from '../../../shared/models/player-game';

export interface AddPlayerForm {
  pseudo: FormControl<string>;
  mail: FormControl<string>;
  phone: FormControl<string>;
  games: FormControl<PlayerGame[]>;
}