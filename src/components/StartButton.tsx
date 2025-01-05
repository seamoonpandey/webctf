import React from 'react';
import { RefreshCw } from 'lucide-react';

interface StartButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function StartButton({ onClick, disabled }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled}
    >
      <RefreshCw className="w-5 h-5" />
      Start Challenge
    </button>
  );
}