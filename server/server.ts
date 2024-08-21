import express from 'express';
import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import cors from 'cors';
import { fixedWindow } from './algorithms/fixedWindow';
// import { slidingLogs } from './algorithms/slidingLogs';
// import { leakyBucket } from './algorithms/leakyBucket';
// import { slidingWindow } from './algorithms/slidingWindow';
// import { tokenBucket } from './algorithms/tokenBucket';

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

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

app.use(express.static('public'));

const RATE_LIMIT = Number(process.env.RATE_LIMIT) || 10;
const TIME_WINDOW = Number(process.env.TIME_WINDOW) || 10;



// Health check endpoint
app.get('/', (_, res) => {
    res.status(200).json({ status: 'OK' });
});


//1. Fixed Window
app.post('/fixed-window', async (_, res) => {
    // Call the fixedWindow function from the imported module
    // Pass in the Redis client, rate limit, and time window
    const result = await fixedWindow(redis, RATE_LIMIT, TIME_WINDOW);

    // Check if the request is rate limited
    if (result.limited) {
        // If limited, emit a 'rateLimitUpdate' event to all connected clients
        // This event includes the algorithm name and the result details
        io.emit('rateLimitUpdate', { algorithm: 'fixedWindow', ...result });

        // Send a 429 (Too Many Requests) status code with an error message
        return res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // If not limited, emit a 'rateLimitUpdate' event with the updated state
    io.emit('rateLimitUpdate', { algorithm: 'fixedWindow', ...result });

    // Send a success response with the current request count
    res.json({ success: true, count: result.count });
});


// // 2. Sliding Logs 
// app.post('/sliding-logs', async (_, res) => {
//     const result = await slidingLogs(redis, RATE_LIMIT, TIME_WINDOW);
//     if (result.limited) {
//         io.emit('rateLimitUpdate', { algorithm: 'slidingLogs', ...result });
//         return res.status(429).json({ error: 'Rate limit exceeded' });
//     }
//     io.emit('rateLimitUpdate', { algorithm: 'slidingLogs', ...result });
//     res.json({ success: true, count: result.count });
// });

// //3. Leaky Bucket 

// app.post('/leaky-bucket', async (_, res) => {
//     const result = await leakyBucket(redis, RATE_LIMIT, TIME_WINDOW);
//     if (result.limited) {
//         io.emit('rateLimitUpdate', { algorithm: 'leakyBucket', ...result });
//         return res.status(429).json({ error: 'Rate limit exceeded' });
//     }
//     io.emit('rateLimitUpdate', { algorithm: 'leakyBucket', ...result });
//     res.json({ success: true, level: result.level });
// });

// //4. Sliding Window
// app.post('/sliding-window', async (_, res) => {
//     const result = await slidingWindow(redis, RATE_LIMIT, TIME_WINDOW);
//     if (result.limited) {
//         io.emit('rateLimitUpdate', { algorithm: 'slidingWindow', ...result });
//         return res.status(429).json({ error: 'Rate limit exceeded' });
//     }
//     io.emit('rateLimitUpdate', { algorithm: 'slidingWindow', ...result });
//     res.json({ success: true, count: result.count });
// });

// //5. Token Bucket
// app.post('/token-bucket', async (req: express.Request, res: express.Response) => {
//     const result = await tokenBucket(redis, RATE_LIMIT, TIME_WINDOW);
//     if (result.limited) {
//         io.emit('rateLimitUpdate', { algorithm: 'tokenBucket', ...result });
//         return res.status(429).json({ error: 'Rate limit exceeded' });
//     }
//     io.emit('rateLimitUpdate', { algorithm: 'tokenBucket', ...result });
//     res.json({ success: true, tokens: result.tokens });
// })

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
