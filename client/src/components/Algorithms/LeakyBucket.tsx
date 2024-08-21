import React from 'react';

interface LeakyBucketProps {
    rateLimited: boolean;
    lastUpdated: Date | null;
    makeRequest: (endpoint: string) => Promise<void>;
}

const LeakyBucket: React.FC<LeakyBucketProps> = ({ rateLimited, lastUpdated, makeRequest }) => {
    return (
        <div>
            <h2>Leaky Bucket</h2>
            <p>Rate Limited: {rateLimited ? 'Yes' : 'No'}</p>
            <p>Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}</p>
            <button onClick={() => makeRequest('leaky-bucket')}>Make Request</button>
        </div>
    );
};

export default LeakyBucket;