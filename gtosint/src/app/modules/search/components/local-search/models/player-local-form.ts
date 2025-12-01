import { FormControl } from '@angular/forms';

export interface PlayerLocalForm {
  pseudo: FormControl<string>;
  mail: FormControl<string>;
}