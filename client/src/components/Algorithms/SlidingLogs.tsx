import React from 'react';

interface SlidingLogsProps {
    rateLimited: boolean;
    lastUpdated: Date | null;
    makeRequest: (endpoint: string) => Promise<void>;
}

const SlidingLogs: React.FC<SlidingLogsProps> = ({ rateLimited, lastUpdated, makeRequest }) => {
    return (
        <div>
            <h2>Sliding Logs</h2>
            <p>Rate Limited: {rateLimited ? 'Yes' : 'No'}</p>
            <p>Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}</p>
            <button onClick={() => makeRequest('sliding-logs')}>Make Request</button>
        </div>
    );
};

export default SlidingLogs;