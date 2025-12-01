import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';
import { userComponentsAuthGuard } from './user-components-auth.guard';

describe('userComponentsAuthGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => userComponentsAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});