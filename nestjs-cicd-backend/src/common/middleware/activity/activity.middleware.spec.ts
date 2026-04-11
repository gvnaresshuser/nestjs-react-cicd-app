import { ActivityMiddleware } from './activity.middleware';

describe('ActivityMiddleware', () => {
  it('should be defined', () => {
    expect(new ActivityMiddleware()).toBeDefined();
  });
});
