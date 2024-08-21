export interface AlgorithmInfoType {
    name: string;
    description: string;
    wikiContent: string;
}

export const algorithmInfo: Record<string, AlgorithmInfoType> = {
    fixedWindow: {
        name: "Fixed Window",
        description: "Tracks requests in fixed time windows.",
        wikiContent: `
            <p>The Fixed Window algorithm divides time into fixed windows and counts requests in each window.</p>
            <p>Key characteristics:</p>
            <ul>
                <li>Simple to implement</li>
                <li>Can lead to burst of traffic at window boundaries</li>
                <li>Learn more on <a href="https://en.wikipedia.org/wiki/Fixed_window_algorithm" target="_blank">Wikipedia</a></li>
            </ul>
        `
    },
    slidingLogs: {
        name: "Sliding Logs",
        description: "Tracks timestamp of each request.",
        wikiContent: `
            <p>The Sliding Logs algorithm keeps a log of request timestamps and checks against a sliding window.</p>
            <p>Key characteristics:</p>
            <ul>
                <li>Accurate</li>
                <li>Can be memory-intensive</li>
                <li>Learn more about sliding window algorithms on <a href="https://en.wikipedia.org/wiki/Sliding_window_protocol" target="_blank">Wikipedia</a></li>
            </ul>
        `
    },
    leakyBucket: {
        name: "Leaky Bucket",
        description: "Tracks the number of requests in a bucket.",
        wikiContent: `
            <p>The Leaky Bucket algorithm uses a bucket with a fixed capacity and a leak rate.</p>
            <p>Key characteristics:</p>
            <ul>
                <li>Smooths out bursty traffic</li>
                <li>Can be used for both rate limiting and traffic shaping</li>
                <li>Learn more on <a href="https://en.wikipedia.org/wiki/Leaky_bucket" target="_blank">Wikipedia</a></li>
            </ul>
        `
    },
    slidingWindow: {
        name: "Sliding Window",
        description: "Tracks requests in a sliding window.",
        wikiContent: `
            <p>The Sliding Window algorithm divides time into fixed windows and counts requests in each window.</p>
            <p>Key characteristics:</p>
            <ul>
                <li>Accurate</li>
                <li>Can be memory-intensive</li>
                <li>Learn more about sliding window algorithms on <a href="https://en.wikipedia.org/wiki/Sliding_window_protocol" target="_blank">Wikipedia</a></li>
            </ul>
        `
    },
    tokenBucket: {
        name: "Token Bucket",
        description: "Tracks tokens in a bucket.",
        wikiContent: `
            <p>The Token Bucket algorithm uses a bucket with a fixed capacity and a refill rate.</p>
            <p>Key characteristics:</p>
            <ul>
                <li>Smooths out bursty traffic</li>
                <li>Can be used for both rate limiting and traffic shaping</li>
                <li>Learn more on <a href="https://en.wikipedia.org/wiki/Token_bucket" target="_blank">Wikipedia</a></li>
            </ul>
        `
    }
};
