import { Redis } from 'ioredis';

export async function fixedWindow(redis: Redis, RATE_LIMIT: number, TIME_WINDOW: number) {
    const currentTime = Math.floor(Date.now() / 1000);
    const window = Math.floor(currentTime / TIME_WINDOW);
    const key = `fixedwindow:${window}`;

    const count = await redis.incr(key);
    await redis.expire(key, TIME_WINDOW);

    const remainingTime = TIME_WINDOW - (currentTime % TIME_WINDOW);

    const isLimited = count > RATE_LIMIT;

    return { limited: isLimited, count, window, limit: RATE_LIMIT, remainingTime };
}