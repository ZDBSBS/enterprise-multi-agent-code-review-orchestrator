import { describe, expect, it } from 'vitest';
import {
  ErrorCodes,
  RateLimiter,
  ReviewError,
  withRetry,
  withTimeout
} from '../src/utils/index.js';

describe('Error handler utilities', () => {
  it('withRetry returns after a successful retry', async () => {
    let attempts = 0;

    const result = await withRetry(
      async () => {
        attempts += 1;

        if (attempts < 2) {
          throw new Error('Temporary failure');
        }

        return 'success';
      },
      2,
      0
    );

    expect(result).toBe('success');
    expect(attempts).toBe(2);
  });

  it('withRetry throws RETRY_EXHAUSTED after all attempts fail', async () => {
    try {
      await withRetry(
        async () => {
          throw new Error('Failure');
        },
        2,
        0
      );

      throw new Error('Expected withRetry to fail');
    } catch (error) {
      expect(error).toBeInstanceOf(ReviewError);

      if (error instanceof ReviewError) {
        expect(error.code).toBe(ErrorCodes.RETRY_EXHAUSTED);
      }
    }
  });

  it('withTimeout returns a result before the timeout', async () => {
    const result = await withTimeout(
      async () => 'success',
      100
    );

    expect(result).toBe('success');
  });

  it('withTimeout throws AGENT_TIMEOUT when time expires', async () => {
    await expect(
      withTimeout(
        () =>
          new Promise((resolve) => {
            setTimeout(resolve, 50);
          }),
        5
      )
    ).rejects.toMatchObject({
      code: ErrorCodes.AGENT_TIMEOUT
    });
  });
});

describe('RateLimiter', () => {
  it('allows and records a request within configured limits', async () => {
    const limiter = new RateLimiter({
      maxRequestsPerMinute: 2,
      maxTokensPerMinute: 2000,
      maxConcurrent: 1
    });

    expect(limiter.canProceed(500)).toBe(true);

    await limiter.acquire(500);

    const status = limiter.getStatus();

    expect(status.activeRequests).toBe(1);
    expect(status.requestsInWindow).toBe(1);
    expect(status.tokensInWindow).toBe(500);
    expect(limiter.canProceed(500)).toBe(false);

    limiter.release();

    expect(limiter.getStatus().activeRequests).toBe(0);
  });

  it('blocks a request that would exceed the token limit', () => {
    const limiter = new RateLimiter({
      maxRequestsPerMinute: 2,
      maxTokensPerMinute: 100,
      maxConcurrent: 1
    });

    expect(limiter.canProceed(101)).toBe(false);
  });
});