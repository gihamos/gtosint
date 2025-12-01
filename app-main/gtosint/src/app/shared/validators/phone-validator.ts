import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) {
    return { required: true };
  }

  if (value.length < 10) {
    return { minLength: { requiredLength: 10, actualLength: value.length } };
  }

  if (value.length > 15) {
    return { maxLength: { requiredLength: 15, actualLength: value.length } };
  }

  if (/\s/.test(value)) {
    return { noSpaces: true };
  }

  const phonePattern = /^\+?[0-9]{10,15}$/;
  if (!phonePattern.test(value)) {
    return { invalidPhone: true };
  }

  return null;
};