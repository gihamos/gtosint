import { TestBed } from '@angular/core/testing';import { SteamGetsteamidService } from './steam-getsteamid.service';

describe('SteamGetsteamidService', () => {
  let service: SteamGetsteamidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteamGetsteamidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});