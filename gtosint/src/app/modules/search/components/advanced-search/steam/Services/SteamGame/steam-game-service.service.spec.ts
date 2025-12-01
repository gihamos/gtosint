import { TestBed } from '@angular/core/testing';import { SteamGameServiceService } from './steam-game-service.service';

describe('SteamGameServiceService', () => {
  let service: SteamGameServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteamGameServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});