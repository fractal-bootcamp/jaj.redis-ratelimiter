import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import AlgorithmInfo from '../AlgorithmInfo';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const socket = io(BACKEND_URL);

const SlidingLogs: React.FC = () => {
    const [rateLimited, setRateLimited] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        socket.on('rateLimitEvent', (data) => {
            if (data.algorithm === 'slidingLogs') {
                setRateLimited(data.isLimited);
                setLastUpdated(new Date(data.timestamp));
            }
        });

        return () => {
            socket.off('rateLimitEvent');
        };
    }, []);

    const handleMakeRequest = async () => {
        try {
            await fetch(`${BACKEND_URL}/sliding-logs`, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 pr-4 mb-4 md:mb-0">
                <AlgorithmInfo algorithm="slidingLogs" />
            </div>
            <div className="md:w-2/3">
                <h2 className="text-2xl font-semibold mb-4">Sliding Logs Algorithm</h2>
                <p className="mb-2">
                    Status:
                    <span className={rateLimited ? 'text-red-600' : 'text-green-600'}>
                        {rateLimited ? ' Rate Limited' : ' Not Limited'}
                    </span>
                </p>
                <p className="mb-4">
                    Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'N/A'}
                </p>
                <button
                    onClick={handleMakeRequest}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Make Request
                </button>
            </div>
        </div>
    );
};

export default SlidingLogs;