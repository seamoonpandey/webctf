import React from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
}

export function TimerDisplay({ timeLeft }: TimerDisplayProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <TimerIcon className="w-6 h-6 text-blue-400" />
      <span className="text-2xl font-mono">
        {timeLeft.toFixed(1)}s
      </span>
    </div>
  );
}