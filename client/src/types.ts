export type Algorithm = 'fixedWindow' | 'slidingLogs' | 'leakyBucket' | 'slidingWindow' | 'tokenBucket';

export interface RateLimits {
    fixedWindow: boolean;
    slidingLogs: boolean;
    leakyBucket: boolean;
    slidingWindow: boolean;
    tokenBucket: boolean;
}

export type LastUpdated = Record<Algorithm, Date | null>;
