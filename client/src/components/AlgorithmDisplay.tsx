import React from 'react';
import { Algorithm, RateLimited, LastUpdated } from '../types';
import FixedWindow from './Algorithms/FixedWindow';
import SlidingLogs from './Algorithms/SlidingLogs';
import LeakyBucket from './Algorithms/LeakyBucket';
import SlidingWindow from './Algorithms/SlidingWindow';
import TokenBucket from './Algorithms/TokenBucket';

interface AlgorithmDisplayProps {
    selectedAlgorithm: Algorithm | null;
    rateLimited: RateLimited;
    lastUpdated: LastUpdated;
    makeRequest: (endpoint: string) => Promise<void>;
}

const AlgorithmDisplay: React.FC<AlgorithmDisplayProps> = ({
    selectedAlgorithm,
    rateLimited,
    lastUpdated,
    makeRequest,
}) => {
    if (!selectedAlgorithm) {
        return <div className="text-xl">Select an algorithm to view details</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {selectedAlgorithm === 'fixedWindow' && (
                <FixedWindow
                    rateLimited={rateLimited.fixedWindow}
                    lastUpdated={lastUpdated.fixedWindow}
                    makeRequest={makeRequest}
                />
            )}
            {selectedAlgorithm === 'slidingLogs' && (
                <SlidingLogs
                    rateLimited={rateLimited.slidingLogs}
                    lastUpdated={lastUpdated.slidingLogs}
                    makeRequest={makeRequest}
                />
            )}
            {selectedAlgorithm === 'leakyBucket' && (
                <LeakyBucket
                    rateLimited={rateLimited.leakyBucket}
                    lastUpdated={lastUpdated.leakyBucket}
                    makeRequest={makeRequest}
                />
            )}
            {selectedAlgorithm === 'slidingWindow' && (
                <SlidingWindow
                    rateLimited={rateLimited.slidingWindow}
                    lastUpdated={lastUpdated.slidingWindow}
                    makeRequest={makeRequest}
                />
            )}
            {selectedAlgorithm === 'tokenBucket' && (
                <TokenBucket
                    rateLimited={rateLimited.tokenBucket}
                    lastUpdated={lastUpdated.tokenBucket}
                    makeRequest={makeRequest}
                />
            )}
        </div>
    );
};

export default AlgorithmDisplay;