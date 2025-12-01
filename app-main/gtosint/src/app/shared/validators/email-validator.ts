import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) {
    return { required: true };
  }

  if (value.length < 6) {
    return { minLength: { requiredLength: 6, actualLength: value.length } };
  }

  if (value.length > 35) {
    return { maxLength: { requiredLength: 35, actualLength: value.length } };
  }

  if (/\s/.test(value)) {
    return { noSpaces: true };
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(value)) {
    return { invalidEmail: true };
  }

  return null;
};