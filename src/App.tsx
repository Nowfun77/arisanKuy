import React, { useState } from 'react';
import { Monitor, Settings } from 'lucide-react';
import { OperatorView } from './components/OperatorView';
import { AdminView } from './components/AdminView';
import { ScoreNotification } from './components/ScoreNotification';
import { useGameState } from './hooks/useGameState';

function App() {
  const [viewMode, setViewMode] = useState<'operator' | 'admin'>('operator');
  const { 
    gameState, 
    recentScoreUpdate, 
    updateScore, 
    changeMode, 
    resetCurrentGame,
    finalizeCurrentGame,
    addParticipant,
    removeParticipant,
    toggleFullscreen
  } = useGameState();

  return (
    <div className="relative min-h-screen">
      {/* View Mode Toggle */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-2 border border-white/20">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('operator')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                viewMode === 'operator'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Operator View
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                viewMode === 'admin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Settings className="w-4 h-4" />
              Admin Panel
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === 'operator' ? (
        <OperatorView 
          gameState={gameState} 
          onModeChange={changeMode}
          onResetGame={resetCurrentGame}
          onFinalizeGame={finalizeCurrentGame}
          onToggleFullscreen={toggleFullscreen}
        />
      ) : (
        <AdminView 
          gameState={gameState} 
          onUpdateScore={updateScore}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
          onResetGame={resetCurrentGame}
          onFinalizeGame={finalizeCurrentGame}
        />
      )}

      {/* Score Notifications */}
      {recentScoreUpdate && (
        <ScoreNotification
          participantName={
            gameState.participants.find(p => p.id === recentScoreUpdate.participantId)?.name || 'Unknown'
          }
          points={recentScoreUpdate.points}
          reason={recentScoreUpdate.reason}
          gameType={recentScoreUpdate.gameType}
          onComplete={() => {}}
        />
      )}
    </div>
  );
}

export default App;