import { SafeCountryPipe } from './safe-country.pipe';

describe('SafeCountryPipe', () => {
  it('create an instance', () => {
    const pipe = new SafeCountryPipe();
    expect(pipe).toBeTruthy();
  });
});