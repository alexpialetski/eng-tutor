import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // 0-100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-bar">
      <div
        className="progress-fill"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  );
};

