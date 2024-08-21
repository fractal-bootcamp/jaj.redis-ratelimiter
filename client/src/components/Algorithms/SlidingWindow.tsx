import React from 'react';

interface SlidingWindowProps {
    rateLimited: boolean;
    lastUpdated: Date | null;
    makeRequest: (endpoint: string) => Promise<void>;
}

const SlidingWindow: React.FC<SlidingWindowProps> = ({ rateLimited, lastUpdated, makeRequest }) => {
    return (
        <div>
            <h2>Sliding Window</h2>
            <p>Rate Limited: {rateLimited ? 'Yes' : 'No'}</p>
            <p>Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}</p>
            <button onClick={() => makeRequest('sliding-window')}>Make Request</button>
        </div>
    );
};

export default SlidingWindow;