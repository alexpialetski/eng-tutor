import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full h-1.5 bg-gray-200 mb-8 rounded-sm overflow-hidden">
      <div
        className="h-full bg-secondary transition-all duration-500 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

