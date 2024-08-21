import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Sidebar from './components/SideBar';
import { Algorithm, RateLimits, LastUpdated } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const socket = io(BACKEND_URL);

function App() {
  const [rateLimits, setRateLimits] = useState<RateLimits>({
    fixedWindow: false,
    slidingLogs: false,
    leakyBucket: false,
    slidingWindow: false,
    tokenBucket: false,
  });

  const [lastUpdated, setLastUpdated] = useState<LastUpdated>({
    fixedWindow: null,
    slidingLogs: null,
    leakyBucket: null,
    slidingWindow: null,
    tokenBucket: null,
  });

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  useEffect(() => {
    socket.on('rateLimitEvent', (data) => {
      setRateLimits(prev => ({ ...prev, [data.algorithm]: data.isLimited }));
      setLastUpdated(prev => ({ ...prev, [data.algorithm]: new Date(data.timestamp) }));
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

  const algorithms: Algorithm[] = ['fixedWindow', 'slidingLogs', 'leakyBucket', 'slidingWindow', 'tokenBucket'];

  return (
    <div className="App bg-gray-100 min-h-screen flex">
      <Sidebar
        algorithms={algorithms}
        selectedAlgorithm={selectedAlgorithm}
        onSelectAlgorithm={setSelectedAlgorithm}
      />
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-8">Rate Limiting Algorithms</h1>
        {selectedAlgorithm && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">{selectedAlgorithm}</h2>
            <p className="mb-2">
              Status:
              <span className={rateLimits[selectedAlgorithm] ? 'text-red-600' : 'text-green-600'}>
                {rateLimits[selectedAlgorithm] ? ' Rate Limited' : ' Not Limited'}
              </span>
            </p>
            <p className="mb-4">
              Last Updated: {lastUpdated[selectedAlgorithm] ? lastUpdated[selectedAlgorithm]?.toLocaleString() : 'N/A'}
            </p>
            <button
              onClick={() => makeRequest(selectedAlgorithm.replace(/([A-Z])/g, '-$1').toLowerCase())}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Make Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;