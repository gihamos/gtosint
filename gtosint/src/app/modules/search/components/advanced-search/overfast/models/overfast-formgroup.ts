import { FormControl } from '@angular/forms';

export interface OverfastForm {
  battleName: FormControl<string>;
  battleTag: FormControl<string>;
}