import React from 'react';

interface CircularProgressProps {
  progress: number; // 0-100
  total: number;
  completed: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  total,
  completed,
  size = 80,
  strokeWidth = 8,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#c6a664"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <div className="text-2xl font-bold text-gray-800 leading-tight">
          {completed}
        </div>
        <div className="text-xs text-gray-500 leading-none">из {total}</div>
      </div>
    </div>
  );
};

