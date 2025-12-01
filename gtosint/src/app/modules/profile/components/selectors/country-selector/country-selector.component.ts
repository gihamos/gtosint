import { Component, inject, Input, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { CountryFull } from '../../../../../shared/models/global-models';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-country-selector',
  imports: [FormsModule],
  templateUrl: './country-selector.component.html',
  styleUrl: './country-selector.component.scss',
})
export class CountrySelectorComponent implements OnInit {
  @Input() countryId = '';
  @Input() userId = '';

  newCountry = '';
  countryInfo: CountryFull | null = null;
  isModifyMode = false;
  searchResults: CountryFull[] = [];
  private searchTerms = new Subject<string>();
  private profileService = inject(ProfileService);

  ngOnInit(): void {
    console.log(`in country selector component with c : ${this.countryId} and user ${this.userId}`);
    this.loadCountryInfo();

    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query: string) => this.profileService.searchCountries(query))
      )
      .subscribe({
        next: (countries) => {
          this.searchResults = countries;
          console.log('Search results in next:', countries);
        },
        error: (err) => {
          console.error('Failed to search countries:', err);
        },
      });

    this.profileService.playerProfile$
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
      )
      .subscribe((player) => {
        if (player && player.countries && player.countries.length > 0) {
          const countryId = player.countries;

          this.profileService.getCountryById(countryId).subscribe({
            next: (country) => {
              console.log('Country loaded:', country);
              this.countryInfo = country;
            },
            error: (err) => {
              console.error('Failed to load country info:', err);
              this.countryInfo = null;
            },
          });
        } else {
          this.countryInfo = null;
          console.log('No country associated with the player.');
        }
      });
  }

  toggleModifyMode(): void {
    this.isModifyMode = !this.isModifyMode;
    this.searchResults = [];
    this.newCountry = '';
  }

  search(query: string): void {
    if (query.length > 0) {
      this.searchTerms.next(query);
    } else {
      this.searchResults = [];
    }
  }

  selectCountry(country: CountryFull): void {
    console.log('country to add', country);
    if (this.countryId) {
      this.profileService.addCountry(this.userId, country.id);
    } else {
      this.profileService.addCountry(this.userId, country.id);
    }
    this.isModifyMode = false;
  }

  loadCountryInfo(): void {
    if (this.countryId) {
      console.log('country id ', this.countryId);
      this.profileService.getCountryById(this.countryId).subscribe({
        next: (country) => {
          this.countryInfo = country;
        },
        error: (err) => {
          console.error('Failed to load country info:', err);
        },
      });
    } else {
      this.countryInfo = null;
    }
  }
}