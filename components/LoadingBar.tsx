import React, { useEffect, useState } from 'react';

interface LoadingBarProps {
  onComplete: () => void;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 3500; // 3.5 seconds
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          onComplete();
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="w-full bg-gray-700 h-6 rounded overflow-hidden border border-gray-600 relative my-4 shadow-inner">
      <div
        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all ease-linear"
        style={{ width: `${progress}%` }}
      >
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-xs text-white drop-shadow-md font-bold">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default LoadingBar;
