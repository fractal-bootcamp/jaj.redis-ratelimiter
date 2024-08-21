import React, { useState } from 'react';
import { Algorithm } from '../types';
import { algorithmInfo } from '../Data/AlgorithmInfo';

interface AlgorithmInfoProps {
    algorithm: Algorithm;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
    const [isOpen, setIsOpen] = useState(false);
    const info = algorithmInfo[algorithm];

    return (
        <div className="mt-4 border rounded-md">
            <button
                className="w-full text-left p-2 bg-gray-100 hover:bg-gray-200 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold">{info.name}</span>
                <span className="ml-2 text-sm text-gray-600">{info.description}</span>
                <span className="float-right">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="p-4">
                    <div dangerouslySetInnerHTML={{ __html: info.wikiContent }} />
                </div>
            )}
        </div>
    );
};

export default AlgorithmInfo;
