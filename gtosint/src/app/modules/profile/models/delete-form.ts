import { FormControl } from '@angular/forms';

// Interface du formulaire de suppression de l'utilisateur
export interface DeleteUserForm {
  email: FormControl<string>;  // Contrôle pour l'email
}