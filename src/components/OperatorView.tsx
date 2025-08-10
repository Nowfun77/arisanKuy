import React from 'react';
import { Users, Trophy } from 'lucide-react';
import { GameState } from '../types';


interface OperatorViewProps {
  gameState: GameState;
  onModeChange: (mode: GameState['mode'], game?: GameState['currentGame']) => void;
  onResetGame: () => void;
  onFinalizeGame: () => void;
  onToggleFullscreen: () => void;
  selectedMedia?: { type: string, url: string } | null;
}

export const OperatorView: React.FC<OperatorViewProps> = ({
  gameState,
  onModeChange,
  onResetGame,
  onFinalizeGame,
  onToggleFullscreen,
  selectedMedia,
}) => {
  const { mode, participants, currentGame } = gameState;

  // Leaderboard
  const leaderboard = [...participants].sort((a, b) =>
    (mode === 'scores' ? b.currentScore - a.currentScore : b.totalScore - a.totalScore)
  );

  const getModeDisplay = () => {
    switch (mode) {
      case 'lobby': return { title: 'Welcome to ArisanKuy!', subtitle: 'Sudah siapkah anda untuk bersenang-senang ?' };
      case 'karaoke': return { title: '🎤 Karaoke Time!', subtitle: 'Ekspresikan Suara Anda!' };
      case 'guessLyrics': return { title: '🎵 Tebak Lirik!', subtitle: 'Dengarkan dan Tebak lirik berikutnya!' };
      case 'guessImage': return { title: '🖼️ Tebak Gambar!', subtitle: 'Coba Tebak Hewan apakah ini?' };
      case 'scores': return { title: '🏆 Current Game Scores', subtitle: `${currentGame?.toUpperCase()} Results` };
      case 'finalScores': return { title: '🏆 Final Games Scores', subtitle: 'Total skor dari seluruh permainan!' };
      case 'ended': return { title: 'Thanks for Playing!', subtitle: 'Hope you had fun!' };
      default: return { title: 'Game Mode', subtitle: 'Current activity' };
    }
  };

  const modeDisplay = getModeDisplay();

  // Media Preview Area (centered, responsive)
  const renderMedia = () => {
    if (!selectedMedia) return null;
    if (
      (selectedMedia.type === 'music' && ( mode === 'guessLyrics')) ||
      (selectedMedia.type === 'video' && mode === 'karaoke') ||
      (selectedMedia.type === 'image' && mode === 'guessImage')
    ) {
      if (selectedMedia.type === 'music') {
        return (
          <div className="w-full max-w-md bg-black/60 rounded-lg p-4 shadow-lg flex flex-col items-center my-8">
            <span className="mb-2 font-semibold text-lg">Now Playing</span>
            <audio controls src={`http://localhost:4000${selectedMedia.url}`} autoPlay className="w-full" />
          </div>
        );
      }
      if (selectedMedia.type === 'video') {
        return (
          <div className="w-full max-w-2xl bg-black/60 rounded-lg p-4 shadow-lg flex flex-col items-center my-8">
            <span className="mb-2 font-semibold text-lg">Now Playing</span>
            <video controls src={`http://localhost:4000${selectedMedia.url}`} width={500} autoPlay className="rounded" />
          </div>
        );
      }
      if (selectedMedia.type === 'image') {
        return (
          <div className="w-full max-w-lg bg-black/60 rounded-lg p-4 shadow-lg flex flex-col items-center my-8">
            <span className="mb-2 font-semibold text-lg">Image</span>
            <img src={`http://localhost:4000${selectedMedia.url}`} alt="Gambar" className="rounded shadow-lg max-h-96" />
          </div>
        );
      }
    }
    // Jika tidak sesuai mode, jangan tampilkan apa-apa
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-5xl font-bold">{modeDisplay.title}</h1>
          <p className="text-xl text-blue-200">{modeDisplay.subtitle}</p>
        </div>

        {/* Media Preview */}
        {renderMedia()}

        {mode === 'lobby' && (
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse mt-8">
            <Users className="w-16 h-16" />
          </div>
        )}

        {(mode === 'scores' || mode === 'finalScores') && (
          <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              {mode === 'scores' ? 'Game Scores' : 'Final Scores'}
            </h2>
            <ol className="space-y-2">
              {leaderboard.map((p, idx) => (
                <li key={p.id} className={`flex items-center gap-4 p-2 rounded ${idx === 0 ? 'bg-yellow-700' : 'bg-gray-700'}`}>
                  <span className="font-bold text-lg w-8 text-center">{idx + 1}</span>
                  <span className="flex-1">{p.name}</span>
                  <span className="font-bold">
                    {mode === 'scores' ? p.currentScore : p.totalScore}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {mode === 'ended' && (
          <div className="text-center space-y-8 animate-fade-in mt-8">
            {/* Ended content here */}
          </div>
        )}
      </div>
    </div>
  );
};