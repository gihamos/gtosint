import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule],
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  private nnfb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.nnfb.group({
    email: this.nnfb.control('', [Validators.required, Validators.email]),
    password: this.nnfb.control('', [
      Validators.required,
      Validators.minLength(6),
      this.containsUppercase,
      this.containsNumber,
      this.containsSpecialChar
    ])
  });

  ngOnInit(): void {
    console.log('LoginComponent loaded');
  }

  loginErrorMessage: string | null = null;

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginErrorMessage = null; // Réinitialise les erreurs avant chaque tentative

      const formValue = this.loginForm.getRawValue();
      this.authService.userLogin(formValue).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.authService.userIsAuthenticated().subscribe();
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Login failed:', err);

          if (err.status === 404) {
            this.loginErrorMessage = 'User not found. Please check your email.';
          } else if (err.status === 401) {
            this.loginErrorMessage = 'Incorrect password. Please try again.';
          } else if (err.status === 500) {
            this.loginErrorMessage = 'Server error. Please try again later.';
          } else {
            this.loginErrorMessage = 'Login failed. Please check your credentials.';
          }
        }
      });
    }
  }


  // Fonctions de validation pour le mot de passe
  containsUppercase(control: any) {
    return /[A-Z]/.test(control.value) ? null : { uppercaseRequired: true };
  }

  containsNumber(control: any) {
    return /[0-9]/.test(control.value) ? null : { numberRequired: true };
  }

  containsSpecialChar(control: any) {
    return /[\W_]/.test(control.value) ? null : { specialCharRequired: true };
  }
}