import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const steamIdentifierValidatorFn: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  let value: string = control.value;
  if (!value) {
    return null;
  }
  value = value.trim();

  // Vérifier si la valeur correspond à une URL Steam
  const regex = /steamcommunity\.com\/(?:id|profiles)\/([^/]+)/i;
  const match = value.match(regex);
  // Si on trouve une URL, on extrait l'identifiant, sinon on considère la valeur directement
  const identifier = match ? match[1] : value;

  // Vérifier si l'identifiant est uniquement composé de chiffres
  const isNumeric = /^\d+$/.test(identifier);

  const validPattern = /^[A-Za-z0-9_]+$/;
  if (!validPattern.test(identifier)) {
    return { invalidSteamIdentifier: 'The nickname contains unauthorized characters.' };
  }

  if (isNumeric) {
    // Un SteamID64 numérique doit contenir exactement 17 chiffres
    if (identifier.length !== 17) {
      return { invalidSteamIdentifier: 'The digital steamid64 identifier must contain exactly 17 digits.' };
    }
  } else {
    // Un custom pseudo doit contenir au moins 4 caractères
    if (identifier.length < 4) {
      return { invalidSteamIdentifier: 'A Pseudo Steam custom must contain at least 4 characters.' };
    }


  }

  return null;
};