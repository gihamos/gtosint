import { CanActivateChildFn } from '@angular/router';

export const userComponentsAuthGuard: CanActivateChildFn = () => {
  return true;
};