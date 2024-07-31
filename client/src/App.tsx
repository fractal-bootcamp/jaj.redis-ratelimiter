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
    <div className="App">
      <h1>Rate Limiting Algorithms</h1>
      {Object.entries(rateLimits).map(([algorithm, isLimited]) => (
        <div key={algorithm}>
          <h2>{algorithm}</h2>
          <p>Status: {isLimited ? 'Rate Limited' : 'Not Limited'}</p>
          <p>Last Updated: {lastUpdated[algorithm as Algorithm] ? lastUpdated[algorithm as Algorithm]?.toLocaleString() : 'N/A'}</p>
          <button onClick={() => makeRequest(algorithm.replace(/([A-Z])/g, '-$1').toLowerCase())}>
            Make Request
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;