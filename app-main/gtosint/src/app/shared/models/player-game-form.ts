import { FormControl } from '@angular/forms';

export interface PlayerGameForm {
  gameId: FormControl<number | null>;
  hoursPlayed: FormControl<number>;
}