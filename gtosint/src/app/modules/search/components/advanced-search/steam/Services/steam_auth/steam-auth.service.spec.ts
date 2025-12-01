import { TestBed } from '@angular/core/testing';import { SteamAuthService } from './steam-auth.service';

describe('SteamAuthService', () => {
  let service: SteamAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteamAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});