import { FormControl } from '@angular/forms';

export interface RiotForm {
  riotId: FormControl<string>;
  tagLine: FormControl<string>;
}