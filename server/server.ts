import express from 'express';
import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import http from 'http';
import cors from 'cors';


const app = express();
const server = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(REDIS_URL);
const subscriber = new Redis(REDIS_URL);

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 10;
const TIME_WINDOW = Number(process.env.TIME_WINDOW) || 10;

//Add clerk authentication 

//function to publish rate limit events to each channel 
async function publishRateLimitEvent(channel: string, isLimited: boolean) {
    const message = JSON.stringify({ isLimited, timestamp: Date.now() })
    await redis.publish(channel, message)
}


// Health check endpoint
app.get('/', (_, res) => {
    res.status(200).json({ status: 'OK' });
});


//1. Fixed Window
app.post('/fixed-window', async (_, res) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const window = Math.floor(currentTime / TIME_WINDOW);
    const key = `fixedwindow:${window}`;

    const count = await redis.incr(key);
    await redis.expire(key, TIME_WINDOW);

    if (count > RATE_LIMIT) {
        await publishRateLimitEvent('fixedWindow', true);
        return res.status(429).json({ error: 'Rate kimit exceeded' });
    }

    res.json({ sucess: true, count });
});

// 2. Sliding Logs 
app.post('/sliding-logs', async (_, res) => {
    const now = Date.now();
    const key = 'slidingLogs';

    await redis.zremrangebyscore(key, 0, now - (TIME_WINDOW * 1000));
    const count = await redis.zcard(key);

    if (count >= RATE_LIMIT) {
        await publishRateLimitEvent('slidingLogs', true);
        return res.status(429).json({ error: 'Rate limit exceeeded' });
    }

    await redis.zadd(key, now, now);
    await redis.expire(key, TIME_WINDOW);

    if (count === 0) {
        await publishRateLimitEvent('slidingLogs', false);
    }

    res.json({ success: true, count: count + 1 });
})

//3. Leaky Bucket 

app.post('/leaky-bucket', async (_, res) => {
    const now = Date.now();
    const key = 'leakyBucket';
    const capacity = RATE_LIMIT;
    const leakRatePerMs = capacity / (TIME_WINDOW * 1000);

    const bucketData = await redis.hgetall(key);
    let level = parseFloat(bucketData.level) || 0
    let lastLeakTime = parseInt(bucketData.lastLeakTime) || now

    //Calculating leaks

    const elapsedTime = now - lastLeakTime;
    level = Math.max(0, level - elapsedTime * leakRatePerMs);

    if (level + 1 > capacity) {
        await publishRateLimitEvent('leakyBucket', true);
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    level += 1;

    await redis.hmset(key, 'level', level, 'lastLeakTime', now);
    await redis.expire(key, TIME_WINDOW);

    if (level === 1) {
        await publishRateLimitEvent('leakyBucket', false);
    }

    res.json({ success: true, level });
});

//4. Sliding Window
app.post('/sliding-window', async (_, res) => {
    const now = Date.now();
    const windowStart = now - (TIME_WINDOW * 1000);
    const key = 'slidingWindow';

    await redis.zremrangebyscore(key, 0, windowStart);
    const count = await redis.zcard(key);

    if (count >= RATE_LIMIT) {
        await publishRateLimitEvent('slidingWindow', true);
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    if (count === 0) {
        await publishRateLimitEvent('slidingWindow', false);
    }

    res.json({ success: true, count: count + 1 });
});

//5. Token Bucket
app.post('/token-bucket', async (req: express.Request, res: express.Response) => {
    const now = Date.now();
    const key = 'tokenBucket';
    const refillRate = RATE_LIMIT / TIME_WINDOW;

    const bucketData = await redis.hgetall(key);
    let tokens = parseFloat(bucketData.tokens) || RATE_LIMIT;
    let LastRefillTime = parseInt(bucketData.LastRefillTime) || now;

    //refil tokens 
    const elapsedTime = (now - LastRefillTime) / 1000;
    tokens = Math.min(RATE_LIMIT, tokens + elapsedTime * refillRate);

    if (tokens < 1) {
        await publishRateLimitEvent('tokenBucket', true);
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    tokens -= 1;
    await redis.hmset(key, 'tokens', tokens, 'lastRefillTime, now');
    await redis.expire(key, TIME_WINDOW);

    if (tokens === RATE_LIMIT - 1) {
        await publishRateLimitEvent('tokenBucket', false);
    }

    res.json({ success: true, tokens });
})

// Set up subscribers 
const algorithms = ['fixedWindow', 'slidingLogs', 'leakyBucket', 'slidingWindow', 'tokenBucket'];
algorithms.forEach(algorithm => {
    subscriber.subscribe(algorithm).then((count: unknown) => {
        console.log(`Subscribed to ${algorithm}. Total subscriptions: ${count}`);
    }).catch((err: Error) => {
        console.error(`Error subscribing to ${algorithm}:`, err);
    });
});

subscriber.on('message', (channel: string, message: string) => {
    const { isLimited, timestamp } = JSON.parse(message);
    console.log(`${channel} is ${isLimited ? 'rate limited' : 'no longer rate limited'} at ${new Date(timestamp)}`);
    io.emit('rateLimitEvent', { algorithm: channel, isLimited, timestamp });
});

io.on('connection', (socket: Socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});