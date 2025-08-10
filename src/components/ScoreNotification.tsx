import React, { useEffect, useState } from 'react';
import { Star, CheckCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface ScoreNotificationProps {
  show?: boolean;
  points: number;
  participantName: string;
  reason: string;
  onClose: () => void;
}

export const ScoreNotification: React.FC<ScoreNotificationProps> = ({
  show,
  points,
  participantName,
  reason,
  onClose,
}) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
    if (show) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`
          bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500
          text-white px-16 py-10 rounded-3xl shadow-2xl border-4 border-white/80
          flex flex-col items-center gap-4
          animate-score-pop
          pointer-events-auto
        `}
        style={{
          minWidth: 480,
          maxWidth: '95vw',
          fontFamily: 'Comic Sans MS, Comic Sans, cursive, sans-serif',
        }}
      >
        <div className="flex items-center gap-6 text-6xl font-extrabold drop-shadow-lg">
          <Star className="text-yellow-300 animate-spin-slow" size={60} />
          <span
            className={points > 0 ? 'text-green-700' : 'text-red-700'}
            style={{ fontSize: 80, lineHeight: 1 }}
          >
            {points > 0 ? `+${points}` : points}
          </span>
          <Star className="text-yellow-300 animate-spin-slow-rev" size={60} />
        </div>
        <div className="flex items-center gap-2 text-3xl font-bold mt-2">
          {points > 0 ? (
            <ArrowUpCircle className="text-green-700 animate-bounce" size={40} />
          ) : (
            <ArrowDownCircle className="text-red-700 animate-bounce" size={40} />
          )}
          <span>{participantName}</span>
        </div>
        <div className="text-xl italic">{reason}</div>
        <CheckCircle className="mt-2 text-white/80 animate-pulse" size={40} />
      </div>
      {/* Animasi background blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[-1]" />
      <style>
        {`
        @keyframes score-pop {
          0% { transform: scale(0.7) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          80% { transform: scale(0.95) rotate(-2deg);}
          100% { transform: scale(1) rotate(0deg);}
        }
        .animate-score-pop {
          animation: score-pop 0.7s cubic-bezier(.68,-0.55,.27,1.55);
        }
        .animate-spin-slow {
          animation: spin 2.5s linear infinite;
        }
        .animate-spin-slow-rev {
          animation: spin-rev 2.5s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg);}
        }
        @keyframes spin-rev {
          100% { transform: rotate(-360deg);}
        }
        `}
      </style>
    </div>
  );
};