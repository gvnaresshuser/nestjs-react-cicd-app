import { IdleTimeoutGuard } from './idle-timeout.guard';

describe('IdleTimeoutGuard', () => {
  it('should be defined', () => {
    expect(new IdleTimeoutGuard()).toBeDefined();
  });
});
