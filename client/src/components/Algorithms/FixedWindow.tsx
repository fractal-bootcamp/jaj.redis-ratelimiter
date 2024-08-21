import React, { useState } from 'react';
import { FixedWindowInfo } from '../../types';

interface FixedWindowAlgorithmProps {
    rateLimited: boolean;
    lastUpdated: Date | null;
    makeRequest: (endpoint: string) => Promise<void>;
}

const FixedWindowAlgorithm: React.FC<FixedWindowAlgorithmProps> = ({
    rateLimited,
    lastUpdated,
    makeRequest,
}) => {
    const [info, setInfo] = useState<FixedWindowInfo | null>(null);

    const handleMakeRequest = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/fixed-window`, {
                method: 'POST',
            });
            const data = await response.json();
            setInfo({
                window: data.window,
                count: data.count,
                limit: data.limit,
                remainingTime: data.remainingTime,
            });
            makeRequest('fixed-window');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Fixed Window Algorithm</h2>
            <p className="mb-2">
                Status:
                <span className={rateLimited ? 'text-red-600' : 'text-green-600'}>
                    {rateLimited ? ' Rate Limited' : ' Not Limited'}
                </span>
            </p>
            <p className="mb-4">
                Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}
            </p>
            {info && (
                <div className="mb-4">
                    <p>Current Window: {info.window}</p>
                    <p>Request Count: {info.count}</p>
                    <p>Rate Limit: {info.limit}</p>
                    <p>Time Remaining in Window: {info.remainingTime} seconds</p>
                </div>
            )}
            <button
                onClick={handleMakeRequest}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
                Make Request
            </button>
        </div>
    );
};

export default FixedWindowAlgorithm;
