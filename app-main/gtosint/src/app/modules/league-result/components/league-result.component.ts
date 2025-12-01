import { Component, OnInit, inject } from '@angular/core';
import { LeagueResponse } from '../models/league-response';
import { LeagueService } from '../services/league-service';

@Component({
  selector: 'app-league-result',
  templateUrl: './league-result.component.html',
  styleUrls: ['./league-result.component.scss']
})
export class LeagueResultComponent implements OnInit {
  leagueData: LeagueResponse[] = [];
  loading = true;
  error = '';

  private leagueService = inject(LeagueService);

  ngOnInit(): void {
    console.log('loading data...');
    this.leagueService.getLeagueData().subscribe({
      next: (data: LeagueResponse[]) => {
        this.leagueData = data;
        this.loading = false;
        console.log('Data league:', this.leagueData);

        if (this.leagueData.length === 0) {
          console.warn('no league received');
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'loading error data.';
        console.error('Error league not received:', err);
      }
    });
  }

  trackById(index: number, league: LeagueResponse): string {
    return league.id;
  }
}