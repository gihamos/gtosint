import { TestBed } from '@angular/core/testing';
import { OverfastService } from './overfast.service';

describe('OverfastService', () => {
  let service: OverfastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverfastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});