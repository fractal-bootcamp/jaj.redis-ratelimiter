import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Sidebar from './components/SideBar';
import AlgorithmDisplay from './components/AlgorithmDisplay';
import { Algorithm, RateLimited, LastUpdated } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const socket = io(BACKEND_URL);

function App() {
  const [rateLimited, setRateLimited] = useState<RateLimited>({
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
      setRateLimited(prev => ({ ...prev, [data.algorithm]: data.isLimited }));
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
        <AlgorithmDisplay
          selectedAlgorithm={selectedAlgorithm}
          rateLimited={rateLimited}
          lastUpdated={lastUpdated}
          makeRequest={makeRequest}
        />
      </div>
    </div>
  );
}

export default App;