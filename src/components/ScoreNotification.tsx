import React, { useEffect, useState } from 'react';
import { Trophy, Star, Zap, Music, ImageIcon } from 'lucide-react';

interface ScoreNotificationProps {
  participantName: string;
  points: number;
  reason: string;
  gameType: string;
  onComplete: () => void;
}

export const ScoreNotification: React.FC<ScoreNotificationProps> = ({
  participantName,
  points,
  reason,
  gameType,
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getIcon = () => {
    if (points >= 10) return <Trophy className="w-8 h-8" />;
    if (points >= 5) return <Star className="w-8 h-8" />;
    return <Zap className="w-8 h-8" />;
  };

  const getGameIcon = () => {
    switch (gameType) {
      case 'karaoke': return '🎤';
      case 'guessLyrics': return <Music className="w-6 h-6" />;
      case 'guessImage': return <ImageIcon className="w-6 h-6" />;
      default: return '🎮';
    }
  };

  const getColor = () => {
    if (points > 0) {
      switch (gameType) {
        case 'karaoke': return 'from-pink-500 to-rose-600';
        case 'guessLyrics': return 'from-green-500 to-emerald-600';
        case 'guessImage': return 'from-purple-500 to-violet-600';
        default: return 'from-blue-500 to-cyan-600';
      }
    }
    return 'from-red-500 to-rose-600';
  };

  const getGameName = () => {
    switch (gameType) {
      case 'karaoke': return 'Karaoke';
      case 'guessLyrics': return 'Tebak Lagu';
      case 'guessImage': return 'Tebak Gambar';
      default: return 'Game';
    }
  };

  return (
    <div className={`fixed top-8 right-8 z-50 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className={`bg-gradient-to-r ${getColor()} p-6 rounded-lg shadow-2xl border-2 border-white/20 min-w-80`}>
        <div className="flex items-center gap-4">
          <div className="text-white">
            {getIcon()}
          </div>
          <div className="flex-1 text-white">
            <div className="font-bold text-lg">{participantName}</div>
            <div className="text-sm opacity-90">{reason}</div>
            <div className="flex items-center gap-2 text-xs opacity-75 mt-1">
              {getGameIcon()}
              <span>{getGameName()}</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">
            {points > 0 ? '+' : ''}{points}
          </div>
        </div>
      </div>
    </div>
  );
};