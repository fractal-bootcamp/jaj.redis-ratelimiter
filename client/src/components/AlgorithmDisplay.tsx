import React from 'react';
import { Algorithm } from '../types';
import FixedWindow from './Algorithms/FixedWindow';
import SlidingLogs from './Algorithms/SlidingLogs';
import LeakyBucket from './Algorithms/LeakyBucket';
import SlidingWindow from './Algorithms/SlidingWindow';
import TokenBucket from './Algorithms/TokenBucket';

interface AlgorithmDisplayProps {
    selectedAlgorithm: Algorithm | null;
}

const AlgorithmDisplay: React.FC<AlgorithmDisplayProps> = ({
    selectedAlgorithm,
}) => {
    if (!selectedAlgorithm) {
        return <div className="text-xl">Select an algorithm to view details</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            {selectedAlgorithm === 'fixedWindow' && <FixedWindow />}
            {selectedAlgorithm === 'slidingLogs' && <SlidingLogs />}
            {selectedAlgorithm === 'leakyBucket' && <LeakyBucket />}
            {selectedAlgorithm === 'slidingWindow' && <SlidingWindow />}
            {selectedAlgorithm === 'tokenBucket' && <TokenBucket />}
        </div>
    );
};

export default AlgorithmDisplay;