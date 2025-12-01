import { Routes } from '@angular/router';
import { HomeComponent } from './shared/pages/home/home.component';
import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
import { AboutComponent } from './shared/pages/about/about.component';
import { LoginComponent } from './modules/users/login/login.component';
import { RegisterComponent } from './modules/users/register/register.component';
import { ProfileComponent } from './modules/profile/pages/profile.component';
import { userPageAuthGuard } from './shared/guards/user-page-auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, runGuardsAndResolvers: 'always' },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [userPageAuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: '**', component: NotFoundComponent }
];