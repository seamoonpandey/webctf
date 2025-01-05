import { GAME_CONFIG } from '../config/constants';

interface GameState {
  isRunning: boolean;
  timeLeft: number;
  onCapture: () => void;
}

let currentGameState: GameState | null = null;

export function formatTime(seconds: number): string {
  return seconds.toFixed(1);
}

export function calculateTimeElapsed(initialTime: number, timeLeft: number): string {
  return (initialTime - timeLeft).toFixed(2);
}

export function createCaptureFunction({
  isRunning,
  timeLeft,
  onCapture,
}: GameState): void {
  currentGameState = { isRunning, timeLeft, onCapture };
  
  // Explicitly attach the function to the window object
  (window as any).captureflag = function captureflag() {
    if (currentGameState?.isRunning && currentGameState.timeLeft > 0) {
      currentGameState.onCapture();
    } else {
      console.log('Challenge not active! Click "Start Challenge" to begin.');
    }
  };
}

export function cleanupCaptureFunction(): void {
  currentGameState = null;
  // Clean up the global function
  delete (window as any).captureflag;
}