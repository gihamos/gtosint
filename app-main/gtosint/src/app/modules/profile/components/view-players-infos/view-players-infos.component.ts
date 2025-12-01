import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../shared/services/authService/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProfileService } from '../../services/profile.service';
//import { Player } from '../../../../shared/models/player';
import { User } from '../../../../shared/models/user.model';
import { GameSelectorComponent } from '../selectors/game-selector/game-selector.component';
// import { PseudoSelectorComponent } from '../selectors/pseudo-selector/pseudo-selector.component';
import { CountrySelectorComponent } from '../selectors/country-selector/country-selector.component';
import { PseudoSelectorComponent } from '../selectors/pseudo-selector/pseudo-selector.component';
import { SafePseudosPipe } from '../../pipes/safe-pseudos.pipe';
import { SafeCountryPipe } from '../../pipes/safe-country.pipe';
import { SafeGamesPipe } from '../../pipes/safe-games.pipe';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DeleteUserForm } from '../../models/delete-form';


@Component({
  selector: 'app-view-players-infos',
  imports: [AsyncPipe, GameSelectorComponent, CountrySelectorComponent, PseudoSelectorComponent, SafePseudosPipe, SafeCountryPipe, SafeGamesPipe, ReactiveFormsModule],
  templateUrl: './view-players-infos.component.html',
  styleUrl: './view-players-infos.component.scss'
})
export class ViewPlayersInfosComponent implements OnInit {

  private authService = inject(AuthService);
  private profileService = inject(ProfileService);
  private router = inject(Router);
  private nnfb: NonNullableFormBuilder = inject(NonNullableFormBuilder);
  private http: HttpClient = inject(HttpClient);

  isAuthenticated$ = this.authService.isAuthenticated$;
  user$: Observable<User | null> = this.authService.userSubject$;
  playerProfile$ = this.profileService.playerProfile$;
  userId = '';

  deleteForm: FormGroup<DeleteUserForm> = this.nnfb.group({
    email: this.nnfb.control('', [Validators.required, Validators.email]),
  });

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user && user._id) {
        this.userId = user._id;
        this.profileService.getPlayerInfos(user._id);
      }
    });
    console.log('playerProfile : ', this.playerProfile$);

  }

  get emailControl() {
    return this.deleteForm.get('email');
  }

  deleteUser(): void {
    const email = this.deleteForm.get('email')?.value;

    if (!this.userId) {
      console.error('User ID is missing.');
      return;
    }

    if (!email || this.deleteForm.invalid) {
      console.error('Email is required and must be valid.');
      return;
    }

    this.profileService.deleteUser(this.userId, email);

  }

}