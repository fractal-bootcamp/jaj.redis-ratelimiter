import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const socket = io(BACKEND_URL);

type Algorithm = 'fixedWindow' | 'slidingLogs' | 'leakyBucket' | 'slidingWindow' | 'tokenBucket';

function App() {
  const [rateLimits, setRateLimits] = useState({
    fixedWindow: false,
    slidingLogs: false,
    leakyBucket: false,
    slidingWindow: false,
    tokenBucket: false,
  });

  const [lastUpdated, setLastUpdated] = useState<Record<Algorithm, Date | null>>({
    fixedWindow: null,
    slidingLogs: null,
    leakyBucket: null,
    slidingWindow: null,
    tokenBucket: null,
  })

  useEffect(() => {
    socket.on('rateLimitEvent', (data) => {
      setRateLimits(prev => ({ ...prev, [data.algorithm]: data.isLimited }));
      setLastUpdated(prev => ({ ...prev, [data.algorithm]: new Date(data.timestamp) }))
    });

    return () => {
      socket.off('rateLimitEvent');
    };
  }, []);

  const makeRequest = async (endpoint: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Rate Limiting Algorithms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(rateLimits).map(([algorithm, isLimited]) => (
          <div key={algorithm} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{algorithm}</h2>
            <p className="mb-2">Status:
              <span className={isLimited ? 'text-red-600' : 'text-green-600'}>
                {isLimited ? ' Rate Limited' : ' Not Limited'}
              </span>
            </p>
            <p className="mb-4">Last Updated: {lastUpdated[algorithm as Algorithm] ? lastUpdated[algorithm as Algorithm]?.toLocaleString() : 'N/A'}</p>
            <button
              onClick={() => makeRequest(algorithm.replace(/([A-Z])/g, '-$1').toLowerCase())}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Make Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;