import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordValidator } from '../../../shared/validators/password-validator';
import { AuthService } from '../../../shared/services/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  @Output() registerSuccess = new EventEmitter<any>();

  private nnfb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.nnfb.group({
    name: this.nnfb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(35)]),
    email: this.nnfb.control('', [Validators.required, Validators.email]),
    password: this.nnfb.control('', [Validators.required, passwordValidator])
  });

  ngOnInit(): void {
    console.log('RegisterComponent loaded');
  }

  registerErrorMessage: string | null = null;

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.getRawValue();
      this.authService.userRegister(formValue).subscribe({
        next: (response) => {
          if (response.status === 201) {
            console.log('Register successful:', response);
            this.router.navigate(['/login']);
            this.registerSuccess.emit(response);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);

          if (err.status === 409) {
            this.registerErrorMessage = 'This email is already in use. Please try another one.';
          } else if (err.status === 400) {
            this.registerErrorMessage = 'Bad request. Please check your input.';
          } else if (err.status === 500) {
            this.registerErrorMessage = 'Server error. Please try again later.';
          } else {
            this.registerErrorMessage = 'Registration failed. Please try again.';
          }
        }
      });
    } else {
      alert('Please fill in all fields correctly.');
    }
  }

}