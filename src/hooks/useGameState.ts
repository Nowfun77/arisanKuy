import { useState, useEffect } from 'react';
import { GameState, Participant, ScoreUpdate } from '../types';

// Simulasi WebSocket connection
class EventSocket {
  private listeners: { [event: string]: Function[] } = {};
  
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event: string, data?: any) { // <-- ubah di sini
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
  
  off(event: string, callback: Function) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

// Singleton socket instance untuk simulasi
const socket = new EventSocket();

export const useGameState = (isOperator: boolean = true) => {
  const [gameState, setGameState] = useState<GameState>({
    mode: 'lobby',
    currentGame: null,
    participants: [
      { 
        id: '1', 
        name: 'Team Alpha', 
        currentScore: 0, 
        totalScore: 0,
        gameScores: { karaoke: 0, guessLyrics: 0, guessImage: 0 }
      },
      { 
        id: '2', 
        name: 'Team Beta', 
        currentScore: 0, 
        totalScore: 0,
        gameScores: { karaoke: 0, guessLyrics: 0, guessImage: 0 }
      },
      { 
        id: '3', 
        name: 'Team Gamma', 
        currentScore: 0, 
        totalScore: 0,
        gameScores: { karaoke: 0, guessLyrics: 0, guessImage: 0 }
      },
      { 
        id: '4', 
        name: 'Team Delta', 
        currentScore: 0, 
        totalScore: 0,
        gameScores: { karaoke: 0, guessLyrics: 0, guessImage: 0 }
      },
    ],
    isActive: false,
    isFullscreen: false,
  });

  const [recentScoreUpdate, setRecentScoreUpdate] = useState<{
    participantId: string;
    points: number;
    reason: string;
  } | null>(null);

  const [selectedMedia, setSelectedMedia] = useState<{type: string, url: string} | null>(null);

  useEffect(() => {
    const handleScoreUpdate = (update: ScoreUpdate) => {
      setGameState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === update.participantId
            ? {
                ...p,
                currentScore: p.currentScore + update.points,
                gameScores: {
                  ...p.gameScores,
                  [update.gameType]: p.gameScores[update.gameType] + update.points
                }
              }
            : p
        )
      }));

      setRecentScoreUpdate({
        participantId: update.participantId,
        points: update.points,
        reason: update.reason,
      });

      setTimeout(() => setRecentScoreUpdate(null), 3000);
    };

    const handleModeChange = (data: { mode: GameState['mode'], game?: GameState['currentGame'] }) => {
      setGameState(prev => ({
        ...prev,
        mode: data.mode,
        currentGame: data.game || prev.currentGame
      }));
    };

    const handleResetGame = () => {
      setGameState(prev => ({
        ...prev,
        participants: prev.participants.map(p => ({
          ...p,
          currentScore: 0
        }))
      }));
    };

    const handleFinalizeGame = () => {
      setGameState(prev => ({
        ...prev,
        participants: prev.participants.map(p => ({
          ...p,
          totalScore: p.totalScore + p.currentScore,
          currentScore: 0
        }))
      }));
    };

    const handleMediaChange = (media: {type: string, url: string}) => {
      setSelectedMedia(media);
    };

    // DAFTARKAN LISTENER DI SINI, BUKAN DI DALAM HANDLER!
    socket.on('scoreUpdate', handleScoreUpdate);
    socket.on('modeChange', handleModeChange);
    socket.on('resetGame', handleResetGame);
    socket.on('finalizeGame', handleFinalizeGame);
    socket.on('mediaChange', handleMediaChange);

    return () => {
      socket.off('scoreUpdate', handleScoreUpdate);
      socket.off('modeChange', handleModeChange);
      socket.off('resetGame', handleResetGame);
      socket.off('finalizeGame', handleFinalizeGame);
      socket.off('mediaChange', handleMediaChange);
    };
  }, []);

  const updateScore = (participantId: string, points: number, reason: string, gameType: 'karaoke' | 'guessLyrics' | 'guessImage') => {
    const update = { participantId, points, reason, gameType };
    socket.emit('scoreUpdate', update);
  };

  // Handler untuk ganti mode/game
  const changeMode = (mode: GameState['mode'], game?: GameState['currentGame']) => {
    setGameState(prev => {
      // Jika pindah ke game baru, reset currentScore
      if (
        (mode === 'karaoke' || mode === 'guessLyrics' || mode === 'guessImage') &&
        (prev.mode !== mode || prev.currentGame !== game)
      ) {
        return {
          ...prev,
          mode,
          currentGame: game,
          participants: prev.participants.map(p => ({
            ...p,
            currentScore: 0, // reset currentScore
          })),
        };
      }
      // Mode lain, tidak reset
      return {
        ...prev,
        mode,
        currentGame: game || prev.currentGame,
      };
    });
    socket.emit('modeChange', { mode, game });
  };

  const resetCurrentGame = () => {
    setGameState(prev => ({
      ...prev,
      mode: 'lobby',
      currentGame: null,
      participants: prev.participants.map(p => ({ ...p, currentScore: 0, totalScore: 0}))
    }));
    socket.emit('resetGame');
  };

  // Handler finalize game
  const finalizeCurrentGame = () => {
    setGameState(prev => ({
      ...prev,
      participants: prev.participants.map(p => ({
        ...p,
        totalScore: p.totalScore + p.currentScore,
        currentScore: 0, // reset setelah finalize
      })),
    }));
    socket.emit('finalizeGame');
  };

  const addParticipant = (name: string) => {
    setGameState(prev => ({
      ...prev,
      participants: [
        ...prev.participants,
        { 
          id: Date.now().toString(), 
          name, 
          currentScore: 0, 
          totalScore: 0,
          gameScores: { karaoke: 0, guessLyrics: 0, guessImage: 0 }
        }
      ]
    }));
  };

  const removeParticipant = (participantId: string) => {
    setGameState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== participantId)
    }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setGameState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const updateSelectedMedia = (media: {type: string, url: string}) => {
    setSelectedMedia(media);
    socket.emit('mediaChange', media); // broadcast ke semua client
  };

  const clearRecentScoreUpdate = () => setRecentScoreUpdate(null);

  return {
    gameState,
    recentScoreUpdate,
    selectedMedia,
    updateScore,
    changeMode,
    resetCurrentGame,
    finalizeCurrentGame,
    addParticipant,
    removeParticipant,
    toggleFullscreen,
    updateSelectedMedia,
    clearRecentScoreUpdate,
  };
};