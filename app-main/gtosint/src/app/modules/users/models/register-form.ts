import { FormControl } from '@angular/forms';

export interface RegisterForm {
    name: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string>;
  }