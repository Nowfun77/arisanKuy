import React, { useState } from 'react';
import { Plus, Minus, Users, Trophy, Settings, Trash2, RotateCcw, CheckCircle } from 'lucide-react';
import { GameState } from '../types';

interface AdminViewProps {
  gameState: GameState;
  onUpdateScore: (participantId: string, points: number, reason: string, gameType: 'karaoke' | 'guessLyrics' | 'guessImage') => void;
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (participantId: string) => void;
  onResetGame: () => void;
  onFinalizeGame: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  gameState, 
  onUpdateScore, 
  onAddParticipant,
  onRemoveParticipant,
  onResetGame,
  onFinalizeGame
}) => {
  const [newParticipantName, setNewParticipantName] = useState('');
  const [customPoints, setCustomPoints] = useState<{ [key: string]: number }>({});
  const [customReason, setCustomReason] = useState<{ [key: string]: string }>({});

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipantName.trim()) {
      onAddParticipant(newParticipantName.trim());
      setNewParticipantName('');
    }
  };

  const handleScoreUpdate = (participantId: string, points: number, reason: string) => {
    const gameType = gameState.currentGame || 'karaoke';
    onUpdateScore(participantId, points, reason, gameType);
    setCustomPoints(prev => ({ ...prev, [participantId]: 0 }));
    setCustomReason(prev => ({ ...prev, [participantId]: '' }));
  };

  const getCurrentGameName = () => {
    switch (gameState.currentGame) {
      case 'karaoke': return 'Karaoke';
      case 'guessLyrics': return 'Tebak Lagu';
      case 'guessImage': return 'Tebak Gambar';
      default: return 'Unknown Game';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Settings className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-2xl font-bold">Score Admin Panel</h1>
                <p className="text-gray-400">Control scores from your admin laptop</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Connected</span>
            </div>
          </div>
        </div>

        {/* Current Game Status */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold">Current Mode: </span>
              <span className="px-3 py-1 bg-blue-600 rounded-full text-sm capitalize">
                {gameState.mode}
              </span>
              {gameState.currentGame && (
                <>
                  <span className="text-gray-400">|</span>
                  <span className="px-3 py-1 bg-green-600 rounded-full text-sm">
                    {getCurrentGameName()}
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onResetGame}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Game
              </button>
              <button
                onClick={onFinalizeGame}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Finalize Game
              </button>
            </div>
          </div>
        </div>

        {/* Add New Participant */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Add New Participant
          </h2>
          <form onSubmit={handleAddParticipant} className="flex gap-4">
            <input
              type="text"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              placeholder="Enter participant name..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Add Participant
            </button>
          </form>
        </div>

        {/* Score Management */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Manage Scores - {getCurrentGameName()}
          </h2>
          
          <div className="space-y-6">
            {gameState.participants.map((participant) => (
              <div key={participant.id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{participant.name}</h3>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>Current Game: {participant.currentScore}</p>
                        <p>Total Score: {participant.totalScore}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-400">
                        {participant.currentScore}
                      </div>
                      <div className="text-sm text-gray-400">
                        Total: {participant.totalScore}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveParticipant(participant.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                      title="Remove participant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Game Scores Breakdown */}
                <div className="bg-gray-600 rounded p-3 mb-4">
                  <div className="text-xs text-gray-300 mb-2">Game Scores:</div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">Karaoke</div>
                      <div className="text-blue-400">{participant.gameScores.karaoke}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Tebak Lagu</div>
                      <div className="text-green-400">{participant.gameScores.guessLyrics}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Tebak Gambar</div>
                      <div className="text-purple-400">{participant.gameScores.guessImage}</div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Score Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleScoreUpdate(participant.id, 10, 'Correct Answer')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    +10
                  </button>
                  <button
                    onClick={() => handleScoreUpdate(participant.id, 5, 'Bonus')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    +5
                  </button>
                  <button
                    onClick={() => handleScoreUpdate(participant.id, -5, 'Penalty')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                    -5
                  </button>
                </div>

                {/* Custom Score Input */}
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={customPoints[participant.id] || ''}
                    onChange={(e) => setCustomPoints(prev => ({ 
                      ...prev, 
                      [participant.id]: parseInt(e.target.value) || 0 
                    }))}
                    placeholder="Custom points"
                    className="w-32 px-3 py-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={customReason[participant.id] || ''}
                    onChange={(e) => setCustomReason(prev => ({ 
                      ...prev, 
                      [participant.id]: e.target.value 
                    }))}
                    placeholder="Reason (optional)"
                    className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleScoreUpdate(
                      participant.id, 
                      customPoints[participant.id] || 0,
                      customReason[participant.id] || 'Custom update'
                    )}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};