import { Component } from '@angular/core';
import { SearchDisplayComponent } from '../../../modules/search/pages/search-display/search-display.component';
import { LeagueResultComponent } from '../../../modules/league-result/components/league-result.component';

@Component({
  selector: 'app-home',
  imports: [SearchDisplayComponent,LeagueResultComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  searchChoice!: 'advanced' | 'local';

  searchType() {
    this.searchChoice = 'advanced';
    console.log('searcChoice : ' + this.searchChoice);
  }
}