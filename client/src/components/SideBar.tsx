import React from 'react';
import { Algorithm } from '../types';

interface SidebarProps {
    algorithms: Algorithm[];
    selectedAlgorithm: Algorithm | null;
    onSelectAlgorithm: (algorithm: Algorithm) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ algorithms, selectedAlgorithm, onSelectAlgorithm }) => {
    return (
        <div className="bg-gray-200 p-4 w-64">
            <h2 className="text-xl font-semibold mb-4">Algorithms</h2>
            <ul>
                {algorithms.map((algorithm) => (
                    <li key={algorithm} className="mb-2">
                        <button
                            onClick={() => onSelectAlgorithm(algorithm)}
                            className={`w-full text-left p-2 rounded ${selectedAlgorithm === algorithm ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'
                                }`}
                        >
                            {algorithm}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;