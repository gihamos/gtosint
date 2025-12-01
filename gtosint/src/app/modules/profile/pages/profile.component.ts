import { Component } from '@angular/core';
import { ViewPlayersInfosComponent } from '../components/view-players-infos/view-players-infos.component';

@Component({
  selector: 'app-profile',
  imports: [ViewPlayersInfosComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {}