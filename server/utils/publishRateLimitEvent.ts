import { Redis } from 'ioredis';

export async function publishRateLimitEvent(redis: Redis, channel: string, isLimited: boolean) {
    const message = JSON.stringify({ isLimited, timestamp: Date.now() });
    await redis.publish(channel, message);
}
