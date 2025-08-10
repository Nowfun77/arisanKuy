import React, { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import { AdminView } from './components/AdminView';
import { OperatorView } from './components/OperatorView';
import { ScoreNotification } from './components/ScoreNotification';


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
    toggleFullscreen,
    selectedMedia,
    updateSelectedMedia,
    clearRecentScoreUpdate, // tambahkan handler ini di useGameState
  } = useGameState();

  // Tampilkan ScoreNotification jika recentScoreUpdate ada
  return (
    <div className="relative min-h-screen">
      {/* Mode Switcher (optional) */}
      <div className="fixed top-2 left-2 z-50">
        <button
          className={`px-3 py-1 rounded-l ${viewMode === 'operator' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => setViewMode('operator')}
        >
          Operator
        </button>
        <button
          className={`px-3 py-1 rounded-r ${viewMode === 'admin' ? 'bg-blue-700 text-white' : 'bg-gray-300 text-black'}`}
          onClick={() => setViewMode('admin')}
        >
          Admin
        </button>
      </div>

      {viewMode === 'operator' ? (
        <OperatorView
          gameState={gameState}
          onModeChange={changeMode}
          onResetGame={resetCurrentGame}
          onFinalizeGame={finalizeCurrentGame}
          onToggleFullscreen={toggleFullscreen}
          selectedMedia={selectedMedia}
        />
      ) : (
        <AdminView
          gameState={gameState}
          onUpdateScore={updateScore}
          onAddParticipant={addParticipant}
          onRemoveParticipant={removeParticipant}
          onResetGame={resetCurrentGame}
          onFinalizeGame={finalizeCurrentGame}
          onToggleFullscreen={toggleFullscreen}
          onModeChange={changeMode}
          onSelectMedia={updateSelectedMedia}
        />
      )}

      {/* Score Notification muncul di semua mode */}
      {recentScoreUpdate && (
  <ScoreNotification
    show={!!recentScoreUpdate}
    participantName={
      gameState.participants.find(p => p.id === recentScoreUpdate.participantId)?.name || 'Unknown'
    }
    points={recentScoreUpdate.points}
    reason={recentScoreUpdate.reason}
    onClose={clearRecentScoreUpdate}
  />
)}
    </div>
  );
}

export default App;