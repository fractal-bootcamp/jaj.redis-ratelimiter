export type Algorithm = 'fixedWindow' | 'slidingLogs' | 'leakyBucket' | 'slidingWindow' | 'tokenBucket';

export interface RateLimited {
    fixedWindow: boolean;
    slidingLogs: boolean;
    leakyBucket: boolean;
    slidingWindow: boolean;
    tokenBucket: boolean;
}

export interface FixedWindowInfo {
    window: number;
    count: number;
    limit: number;
    remainingTime: number;
}

export type LastUpdated = Record<Algorithm, Date | null>;
