import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { userPageAuthGuard } from './user-page-auth.guard';

describe('userPageAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => userPageAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});