import { TestBed } from '@angular/core/testing';import { SteamGetProfileInfoService } from './steam-get-profile-info.service';
import { beforeEach, describe, it } from 'node:test';

describe('SteamGetProfileInfoService', () => {
  let service: SteamGetProfileInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SteamGetProfileInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

function expect(service: SteamGetProfileInfoService) {
  return {
    toBeTruthy: () => {
      if (!service) {
        throw new Error('Expected service to be truthy, but it was falsy');
      }
    }
  };
}