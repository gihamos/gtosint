import { SafePseudosPipe } from './safe-pseudos.pipe';

describe('SafePseudosPipe', () => {
  it('create an instance', () => {
    const pipe = new SafePseudosPipe();
    expect(pipe).toBeTruthy();
  });
});