import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value: string = control.value;

  if (!value) {
    return { required: true };
  }

  if (value.length < 8) {
    return { minLength: { requiredLength: 8, actualLength: value.length } };
  }

  if (/\s/.test(value)) {
    return { noSpaces: true };
  }

  if (!/[A-Z]/.test(value)) {
    return { uppercaseRequired: true };
  }

  if (!/[0-9]/.test(value)) {
    return { numberRequired: true };
  }

  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharPattern.test(value)) {
    return { specialCharRequired: true };
  }

  return null;
};