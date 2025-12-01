import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/authService/auth.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }


  isAuthenticated$ = this.authService.isAuthenticated$;
  userSubjectName$ = this.authService.userSubject$.pipe(
    map(user => user?.name || 'Utilisateur')
  );

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}