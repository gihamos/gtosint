import { TestBed } from '@angular/core/testing';
import { ClashService } from './cr.service';

describe('ClashService', () => {
  let service: ClashService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClashService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});