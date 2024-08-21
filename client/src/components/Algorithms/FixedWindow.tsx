import React, { useState, useEffect } from 'react';
import { FixedWindowInfo } from '../../types';
import io from 'socket.io-client';
import AlgorithmInfo from '../AlgorithmInfo';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const socket = io(BACKEND_URL);

const FixedWindow: React.FC = () => {
    const [info, setInfo] = useState<FixedWindowInfo | null>(null);
    const [rateLimited, setRateLimited] = useState<boolean>(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        // Listen for 'rateLimitUpdate' events instead of 'rateLimitEvent'
        socket.on('rateLimitUpdate', (data) => {
            if (data.algorithm === 'fixedWindow') {
                setRateLimited(data.limited);
                setLastUpdated(new Date());
                setInfo({
                    window: data.window,
                    count: data.count,
                    limit: data.limit,
                    remainingTime: data.remainingTime,
                });
            }
        });

        return () => {
            socket.off('rateLimitUpdate');
        };
    }, []);

    const handleMakeRequest = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/fixed-window`, {
                method: 'POST',
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error:', errorData.error);
                // Optionally update UI to show error message
            }
            // The state will be updated by the socket event, so we don't need to set it here
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 pr-4 mb-4 md:mb-0">
                <AlgorithmInfo algorithm="fixedWindow" />
            </div>
            <div className="md:w-2/3">
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
        </div>
    );
};

export default FixedWindow;