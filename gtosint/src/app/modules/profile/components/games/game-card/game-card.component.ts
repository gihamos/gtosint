import { Component, Input } from '@angular/core';
import { GameFull } from '../../../../../shared/models/global-models';

@Component({
  selector: 'app-game-card',
  imports: [],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent {
  @Input({required : true}) game ?:GameFull;

}