import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Sidebar from './components/SideBar';
import AlgorithmDisplay from './components/AlgorithmDisplay';
import { Algorithm, RateLimited, LastUpdated } from './types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
const socket = io(BACKEND_URL);

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

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
        <AlgorithmDisplay selectedAlgorithm={selectedAlgorithm} />
      </div>
    </div>
  );
}

export default App;