/* eslint-disable eol-last */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverfastFormComponent } from '../overfast/components/overfast-api/overfast-api.component';
import { RiotFormComponent } from '../../advanced-search/riot/components/riot-api/riot-api.component';
import { RiotResponse } from '../riot/models/riot-response.model';
import { OverfastResultComponent } from '../overfast/components/overfast-result/overfast-result.component';
import { RiotResultComponent } from '../../advanced-search/riot/components/riot-result/riot-result.component';
import { OverfastResponse } from '../overfast/models/overfast-response.model';
import { CrResultComponent } from '../clash/components/cr-result/cr-result.component';
import { ClashResponse } from '../clash/models/cr-response.model';
import { ClashRoyaleFormComponent } from '../clash/components/cr-api/cr-api.component';
import { SteamHomeComponent } from '../steam/Components/home/home.component';

@Component({
  selector: 'app-search-advanced',
  standalone: true,
  imports: [
    CommonModule,
    OverfastFormComponent,
    RiotFormComponent,
    ClashRoyaleFormComponent,
    OverfastResultComponent,
    RiotResultComponent,
    CrResultComponent,
    SteamHomeComponent
  ],
  templateUrl: './search-advanced.component.html',
  styleUrl: './search-advanced.component.scss',
})
export class SearchAdvancedComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef; // Référence à l'élément carousel

  public isResultsRiotToPrint = false;
  public isResultsOverToPrint = false;
  public isResultsCrToPrint = false;
  public selectedPlatform: string | null = null;

  riotData: RiotResponse | null = null;
  overData: OverfastResponse | null = null;
  crData: ClashResponse | null = null;

  public platforms = [
    { name: 'Riot', logo: 'riot.png', component: 'riot' },
    { name: 'Overwatch', logo: 'overwatch.png', component: 'overfast' },
    { name: 'Clash Royale', logo: 'clashRoyale.png', component: 'clash' },
    { name: 'Steam', logo: 'steam.png', component: 'steam' }
  ];

  ngOnInit(): void {
    this.isResultsRiotToPrint = false;
    this.isResultsOverToPrint = false;
    this.isResultsCrToPrint = false;
  }

  onOverDataReceived(event: OverfastResponse) {
    this.overData = event as OverfastResponse;
    this.isResultsOverToPrint = true;
  }

  onRiotDataReceived(event: RiotResponse) {
    this.riotData = event as RiotResponse;
    this.isResultsRiotToPrint = true;
  }

  onCrDataReceived(event: ClashResponse) {
    this.crData = event as ClashResponse;
    this.isResultsCrToPrint = true;
  }

  selectPlatform(platform: string) {
    this.selectedPlatform = platform;
  }

  // Fonction pour faire défiler à gauche
  scrollCarousel(direction: number): void {
    const carouselElement = this.carousel.nativeElement;
    const scrollAmount = 150; // Nombre de pixels à faire défiler à chaque clic
    carouselElement.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
}
