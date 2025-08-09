export interface Participant {
  id: string;
  name: string;
  currentScore: number; // Skor game saat ini
  totalScore: number;   // Akumulasi skor dari semua game
  gameScores: {
    karaoke: number;
    guessLyrics: number;
    guessImage: number;
  };
  avatar?: string;
}

export interface GameState {
  mode: 'lobby' | 'karaoke' | 'guessLyrics' | 'guessImage' | 'scores' | 'finalScores' | 'ended';
  currentGame: 'karaoke' | 'guessLyrics' | 'guessImage' | null;
  currentSong?: string;
  currentImage?: string;
  currentAudio?: string;
  participants: Participant[];
  isActive: boolean;
  isFullscreen: boolean;
}

export interface ScoreUpdate {
  participantId: string;
  points: number;
  reason: string;
  gameType: 'karaoke' | 'guessLyrics' | 'guessImage';
}

export interface GameRound {
  game: 'karaoke' | 'guessLyrics' | 'guessImage';
  completed: boolean;
  scores: { [participantId: string]: number };
}