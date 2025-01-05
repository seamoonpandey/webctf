import React from 'react';

interface GameStatusProps {
  successMessage: string;
  hasTimedOut: boolean;
  hasFlag: boolean;
  attempts: number;
}

export function GameStatus({ successMessage, hasTimedOut, hasFlag, attempts }: GameStatusProps) {
  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-center">
          {successMessage}
        </div>
      )}

      {hasTimedOut && !hasFlag && (
        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-center">
          Time's up! Try again!
        </div>
      )}

      <div className="text-center text-gray-400">
        Attempts: {attempts}
      </div>

      <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
        <p className="text-trysm text-gray-300">
          💡 Tip: Try running IT
        </p>
      </div>
    </div>
  );
}