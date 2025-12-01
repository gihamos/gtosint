import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/pages/navbar/navbar.component';
import { FooterComponent } from './shared/pages/footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'gtosint';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const body = document.body;

      // Ajout d'un délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        console.log('Changement de route:', event.urlAfterRedirects);

        if (event.urlAfterRedirects === '/login') {
          body.classList.add('login');
          body.classList.remove('register');
        } else if (event.urlAfterRedirects === '/register') {
          body.classList.add('register');
          body.classList.remove('login');
        } else {
          body.classList.remove('login', 'register');
        }
      }, 0);
    });
  }
}