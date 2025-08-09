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
  
  emit(event: string, data: any) {
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
    gameType: string;
  } | null>(null);

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
      
      setRecentScoreUpdate({ ...update, gameType: update.gameType });
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

    socket.on('scoreUpdate', handleScoreUpdate);
    socket.on('modeChange', handleModeChange);
    socket.on('resetGame', handleResetGame);
    socket.on('finalizeGame', handleFinalizeGame);

    return () => {
      socket.off('scoreUpdate', handleScoreUpdate);
      socket.off('modeChange', handleModeChange);
      socket.off('resetGame', handleResetGame);
      socket.off('finalizeGame', handleFinalizeGame);
    };
  }, []);

  const updateScore = (participantId: string, points: number, reason: string, gameType: 'karaoke' | 'guessLyrics' | 'guessImage') => {
    const update = { participantId, points, reason, gameType };
    socket.emit('scoreUpdate', update);
  };

  const changeMode = (mode: GameState['mode'], game?: GameState['currentGame']) => {
    socket.emit('modeChange', { mode, game });
  };

  const resetCurrentGame = () => {
    socket.emit('resetGame');
  };

  const finalizeCurrentGame = () => {
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

  return {
    gameState,
    recentScoreUpdate,
    updateScore,
    changeMode,
    resetCurrentGame,
    finalizeCurrentGame,
    addParticipant,
    removeParticipant,
    toggleFullscreen,
  };
};