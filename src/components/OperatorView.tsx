import React from 'react';
import { Play, Pause, SkipForward, Users, Trophy, Home, ImageIcon, Music, Maximize, RotateCcw, CheckCircle } from 'lucide-react';
import { GameState } from '../types';

interface OperatorViewProps {
  gameState: GameState;
  onModeChange: (mode: GameState['mode'], game?: GameState['currentGame']) => void;
  onResetGame: () => void;
  onFinalizeGame: () => void;
  onToggleFullscreen: () => void;
}

export const OperatorView: React.FC<OperatorViewProps> = ({ 
  gameState, 
  onModeChange, 
  onResetGame, 
  onFinalizeGame,
  onToggleFullscreen 
}) => {
  const { mode, participants, currentGame } = gameState;

  const getModeDisplay = () => {
    switch (mode) {
      case 'lobby': return { title: 'Welcome to Game Night!', subtitle: 'Ready to start the fun?' };
      case 'karaoke': return { title: '🎤 Karaoke Time!', subtitle: 'Sing your heart out!' };
      case 'guessLyrics': return { title: '🎵 Guess the Lyrics!', subtitle: 'Listen and guess the song!' };
      case 'guessImage': return { title: '🖼️ Guess the Picture!', subtitle: 'What do you see?' };
      case 'scores': return { title: '🏆 Current Game Scores', subtitle: `${currentGame?.toUpperCase()} Results` };
      case 'finalScores': return { title: '🏆 Final Tournament Scores', subtitle: 'Total scores from all games!' };
      case 'ended': return { title: 'Thanks for Playing!', subtitle: 'Hope you had fun!' };
      default: return { title: 'Game Mode', subtitle: 'Current activity' };
    }
  };

  const modeDisplay = getModeDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Operator Controls */}
      <div className="fixed top-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/20 z-50 max-w-sm">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Play className="w-4 h-4" />
          Operator Controls
        </h3>
        
        {/* Game Mode Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => onModeChange('lobby')}
            className={`p-2 rounded text-xs transition-colors ${
              mode === 'lobby' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Home className="w-4 h-4 mx-auto mb-1" />
            Lobby
          </button>
          <button
            onClick={() => onModeChange('karaoke', 'karaoke')}
            className={`p-2 rounded text-xs transition-colors ${
              mode === 'karaoke' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            🎤
            Karaoke
          </button>
          <button
            onClick={() => onModeChange('guessLyrics', 'guessLyrics')}
            className={`p-2 rounded text-xs transition-colors ${
              mode === 'guessLyrics' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Music className="w-4 h-4 mx-auto mb-1" />
            Tebak Lagu
          </button>
          <button
            onClick={() => onModeChange('guessImage', 'guessImage')}
            className={`p-2 rounded text-xs transition-colors ${
              mode === 'guessImage' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <ImageIcon className="w-4 h-4 mx-auto mb-1" />
            Tebak Gambar
          </button>
        </div>

        {/* Score Display Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => onModeChange('scores')}
            className={`p-2 rounded text-xs transition-colors ${
              mode === 'scores' 
                ? 'bg-green-600 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Trophy className="w-4 h-4 mx-auto mb-1" />
            Game Scores
          </button>
          <button
            onClick={() => onModeChange('finalScores')}
            className={`p-2 rounded text-xs transition-colors ${
              mode === 'finalScores' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            🏆
            Final Scores
          </button>
        </div>

        {/* Game Management */}
        <div className="border-t border-white/20 pt-3 space-y-2">
          <button
            onClick={onResetGame}
            className="w-full flex items-center justify-center gap-2 p-2 bg-orange-600 hover:bg-orange-700 rounded text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Game
          </button>
          <button
            onClick={onFinalizeGame}
            className="w-full flex items-center justify-center gap-2 p-2 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Finalize Game
          </button>
          <button
            onClick={onToggleFullscreen}
            className="w-full flex items-center justify-center gap-2 p-2 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors"
          >
            <Maximize className="w-4 h-4" />
            Fullscreen
          </button>
        </div>
      </div>

      {/* Main Display */}
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {mode === 'lobby' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-7xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {modeDisplay.title}
              </h1>
              <p className="text-2xl text-blue-200">{modeDisplay.subtitle}</p>
            </div>
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <Users className="w-16 h-16" />
            </div>
          </div>
        )}

        {mode === 'karaoke' && (
          <div className="text-center space-y-8 animate-slide-in">
            <h1 className="text-6xl font-bold">{modeDisplay.title}</h1>
            <p className="text-xl text-blue-200">{modeDisplay.subtitle}</p>
            <div className="w-96 h-64 bg-black/50 rounded-lg border-2 border-white/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">🎵</div>
                <p className="text-white/70">Video karaoke akan ditampilkan di sini</p>
                <p className="text-sm text-white/50 mt-2">Upload atau link konten video</p>
              </div>
            </div>
          </div>
        )}

        {mode === 'guessLyrics' && (
          <div className="text-center space-y-8 animate-slide-in">
            <h1 className="text-6xl font-bold">{modeDisplay.title}</h1>
            <p className="text-xl text-blue-200">{modeDisplay.subtitle}</p>
            
            {/* Poster Display Area */}
            <div className="w-96 h-64 bg-black/50 rounded-lg border-2 border-white/20 flex items-center justify-center mb-6">
              <div className="text-center">
                <Music className="w-16 h-16 mx-auto mb-4 text-white/50" />
                <p className="text-white/70">Poster lagu akan ditampilkan di sini</p>
                <p className="text-sm text-white/50 mt-2">Upload poster atau gambar lagu</p>
              </div>
            </div>

            {/* Audio Controls (Hidden from participants) */}
            <div className="bg-black/30 p-4 rounded-lg border border-white/20">
              <p className="text-sm text-white/70 mb-2">Audio Control (Operator Only)</p>
              <div className="flex items-center gap-4 justify-center">
                <button className="p-2 bg-green-600 hover:bg-green-700 rounded-full transition-colors">
                  <Play className="w-6 h-6" />
                </button>
                <button className="p-2 bg-red-600 hover:bg-red-700 rounded-full transition-colors">
                  <Pause className="w-6 h-6" />
                </button>
                <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>
              <p className="text-xs text-white/50 mt-2">Audio akan diputar melalui speaker sistem</p>
            </div>
          </div>
        )}

        {mode === 'guessImage' && (
          <div className="text-center space-y-8 animate-slide-in">
            <h1 className="text-6xl font-bold">{modeDisplay.title}</h1>
            <p className="text-xl text-blue-200">{modeDisplay.subtitle}</p>
            <div className="w-96 h-64 bg-black/50 rounded-lg border-2 border-white/20 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 text-white/50" />
                <p className="text-white/70">Gambar tebak-tebakan!</p>
                <p className="text-sm text-white/50 mt-2">Upload gambar untuk permainan tebak gambar</p>
              </div>
            </div>
          </div>
        )}

        {mode === 'scores' && (
          <div className="w-full max-w-4xl animate-slide-in">
            <h1 className="text-6xl font-bold text-center mb-4">{modeDisplay.title}</h1>
            <p className="text-center text-xl text-blue-200 mb-8">{modeDisplay.subtitle}</p>
            <div className="grid gap-6">
              {participants
                .sort((a, b) => b.currentScore - a.currentScore)
                .map((participant, index) => (
                  <div 
                    key={participant.id}
                    className={`flex items-center justify-between p-6 rounded-lg border-2 ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                        : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                        index === 0 ? 'bg-yellow-500 text-black' : 'bg-white/20'
                      }`}>
                        #{index + 1}
                      </div>
                      <span className="text-2xl font-semibold">{participant.name}</span>
                    </div>
                    <div className="text-4xl font-bold">
                      {participant.currentScore}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {mode === 'finalScores' && (
          <div className="w-full max-w-4xl animate-slide-in">
            <h1 className="text-6xl font-bold text-center mb-4">{modeDisplay.title}</h1>
            <p className="text-center text-xl text-blue-200 mb-8">{modeDisplay.subtitle}</p>
            <div className="grid gap-6">
              {participants
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((participant, index) => (
                  <div 
                    key={participant.id}
                    className={`p-6 rounded-lg border-2 ${
                      index === 0 
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                        : 'bg-white/10 border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                          index === 0 ? 'bg-yellow-500 text-black' : 'bg-white/20'
                        }`}>
                          #{index + 1}
                        </div>
                        <span className="text-2xl font-semibold">{participant.name}</span>
                      </div>
                      <div className="text-4xl font-bold">
                        {participant.totalScore}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-white/70">
                      <span>Karaoke: {participant.gameScores.karaoke}</span>
                      <span>Tebak Lagu: {participant.gameScores.guessLyrics}</span>
                      <span>Tebak Gambar: {participant.gameScores.guessImage}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {mode === 'ended' && (
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-6xl font-bold">{modeDisplay.title}</h1>
            <p className="text-2xl text-blue-200">{modeDisplay.subtitle}</p>
            <div className="text-8xl">🎉</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">Tournament Champion:</h2>
              <div className="text-5xl font-bold text-yellow-400">
                {participants.sort((a, b) => b.totalScore - a.totalScore)[0]?.name}
              </div>
              <div className="text-2xl text-white/70">
                Total Score: {participants.sort((a, b) => b.totalScore - a.totalScore)[0]?.totalScore}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};