import React from 'react';

interface TokenBucketProps {
    rateLimited: boolean;
    lastUpdated: Date | null;
    makeRequest: (endpoint: string) => Promise<void>;
}

const TokenBucket: React.FC<TokenBucketProps> = ({ rateLimited, lastUpdated, makeRequest }) => {
    return (
        <div>
            <h2>Token Bucket</h2>
            <p>Rate Limited: {rateLimited ? 'Yes' : 'No'}</p>
            <p>Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}</p>
            <button onClick={() => makeRequest('token-bucket')}>Make Request</button>
        </div>
    );
};

export default TokenBucket;