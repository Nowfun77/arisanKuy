import React, { useState, useEffect } from 'react';
import { Play, Home, Music, ImageIcon, Trophy, RotateCcw, CheckCircle, Maximize, Plus, Trash2, UploadCloud, Video } from 'lucide-react';
import { GameState } from '../types';

interface AdminViewProps {
  gameState: GameState;
  onUpdateScore: (id: string, points: number, reason: string, gameType: 'karaoke' | 'guessLyrics' | 'guessImage') => void;
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (id: string) => void;
  onResetGame: () => void;
  onFinalizeGame: () => void;
  onToggleFullscreen?: () => void;
  onModeChange: (mode: GameState['mode'], game?: GameState['currentGame']) => void;
  onSelectMedia: (media: { type: 'music' | 'video' | 'image'; url: string }) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  gameState,
  onUpdateScore,
  onAddParticipant,
  onRemoveParticipant,
  onResetGame,
  onFinalizeGame,
  onToggleFullscreen,
  onModeChange,
  onSelectMedia,
}) => {
  // State
  const [newParticipant, setNewParticipant] = useState('');
  const [scoreInputs, setScoreInputs] = useState<{ [id: string]: number }>({});
  const [scoreReasons, setScoreReasons] = useState<{ [id: string]: string }>({});
  const [musicFiles, setMusicFiles] = useState<{ name: string; url: string }[]>([]);
  const [videoFiles, setVideoFiles] = useState<{ name: string; url: string }[]>([]);
  const [imageFiles, setImageFiles] = useState<{ name: string; url: string }[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<number | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Fetch file list dari backend
  const fetchFiles = async (type: 'music' | 'video' | 'image') => {
    const res = await fetch(`http://localhost:4000/files/${type}`);
    return res.json();
  };
  const refreshFiles = async () => {
    setMusicFiles(await fetchFiles('music'));
    setVideoFiles(await fetchFiles('video'));
    setImageFiles(await fetchFiles('image'));
  };
  useEffect(() => {
    refreshFiles();
  }, []);

  // Upload handler
  const uploadFile = async (file: File, type: 'music' | 'video' | 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    await fetch('http://localhost:4000/upload', { method: 'POST', body: formData });
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (const file of Array.from(e.target.files)) {
        await uploadFile(file, 'music');
      }
      setMusicFiles(await fetchFiles('music'));
    }
  };
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (const file of Array.from(e.target.files)) {
        await uploadFile(file, 'video');
      }
      setVideoFiles(await fetchFiles('video'));
    }
  };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (const file of Array.from(e.target.files)) {
        await uploadFile(file, 'image');
      }
      setImageFiles(await fetchFiles('image'));
    }
  };

  const handleResetGame = () => {
  onResetGame();
  };
  // Pilih file dan sinkronkan ke peserta/operatorview
  const selectMusic = (idx: number) => {
    setSelectedMusic(idx);
    setSelectedVideo(null);
    setSelectedImage(null);
    onSelectMedia({ type: 'music', url: musicFiles[idx].url });
  };
  const selectVideo = (idx: number) => {
    setSelectedVideo(idx);
    setSelectedMusic(null);
    setSelectedImage(null);
    onSelectMedia({ type: 'video', url: videoFiles[idx].url });
  };
  const selectImage = (idx: number) => {
    setSelectedImage(idx);
    setSelectedMusic(null);
    setSelectedVideo(null);
    onSelectMedia({ type: 'image', url: imageFiles[idx].url });
  };

  // Participant & Score handlers
  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newParticipant.trim()) {
      onAddParticipant(newParticipant.trim());
      setNewParticipant('');
    }
  };
  const handleScoreUpdate = (id: string) => {
    const points = scoreInputs[id] || 0;
    const reason = scoreReasons[id] || 'Manual update';
    if (points !== 0) {
      onUpdateScore(id, points, reason, gameState.currentGame || 'karaoke');
      setScoreInputs(prev => ({ ...prev, [id]: 0 }));
      setScoreReasons(prev => ({ ...prev, [id]: '' }));
    }
  };

  // Leaderboard
  const leaderboard = [...gameState.participants].sort((a, b) => b.totalScore - a.totalScore);

  const mode = gameState.mode;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Operator Control Panel (di atas, scrollable) */}
      <div className="mb-8">
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Play className="w-4 h-4" />
              Operator Controls
            </h3>
          </div>
          <button
            className="px-2 py-1 bg-blue-700 rounded text-xs mb-2"
            onClick={refreshFiles}
          >
            Refresh File List
          </button>
          {/* Scrollable area */}
          <div className="max-h-80 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => onModeChange('lobby')} className={`p-2 rounded text-xs transition-colors ${mode === 'lobby' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                <Home className="w-4 h-4 mx-auto mb-1" /> Lobby
              </button>
              <button onClick={() => onModeChange('karaoke', 'karaoke')} className={`p-2 rounded text-xs transition-colors ${mode === 'karaoke' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                🎤 Karaoke
              </button>
              <button onClick={() => onModeChange('guessLyrics', 'guessLyrics')} className={`p-2 rounded text-xs transition-colors ${mode === 'guessLyrics' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                <Music className="w-4 h-4 mx-auto mb-1" /> Tebak Lagu
              </button>
              <button onClick={() => onModeChange('guessImage', 'guessImage')} className={`p-2 rounded text-xs transition-colors ${mode === 'guessImage' ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                <ImageIcon className="w-4 h-4 mx-auto mb-1" /> Tebak Gambar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => onModeChange('scores')} className={`p-2 rounded text-xs transition-colors ${mode === 'scores' ? 'bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                <Trophy className="w-4 h-4 mx-auto mb-1" /> Game Scores
              </button>
              <button onClick={() => onModeChange('finalScores')} className={`p-2 rounded text-xs transition-colors ${mode === 'finalScores' ? 'bg-yellow-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>
                🏆 Final Scores
              </button>
            </div>
            <div className="border-t border-white/20 pt-3 space-y-2">
              <button onClick={onResetGame} className="w-full flex items-center justify-center gap-2 p-2 bg-orange-600 hover:bg-orange-700 rounded text-xs transition-colors">
                <RotateCcw className="w-4 h-4" /> Reset Game
              </button>
              <button onClick={onFinalizeGame} className="w-full flex items-center justify-center gap-2 p-2 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors">
                <CheckCircle className="w-4 h-4" /> Finalize Game
              </button>
              {onToggleFullscreen && (
                <button onClick={onToggleFullscreen} className="w-full flex items-center justify-center gap-2 p-2 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors">
                  <Maximize className="w-4 h-4" /> Fullscreen
                </button>
              )}
            </div>
            {/* Upload Controls */}
            <div className="border-t border-white/20 pt-3 mt-3 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <UploadCloud className="w-4 h-4" /> Upload Musik
                <input type="file" accept="audio/*" multiple hidden onChange={handleMusicUpload} />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Video className="w-4 h-4" /> Upload Video
                <input type="file" accept="video/*" multiple hidden onChange={handleVideoUpload} />
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <ImageIcon className="w-4 h-4" /> Upload Gambar
                <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
              </label>
            </div>
            {/* List & Select Uploaded Files */}
            <div className="pt-2">
              {musicFiles.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs mb-1">Musik:</div>
                  {musicFiles.map((file, idx) => (
                    <button key={idx} className={`block w-full text-left px-2 py-1 rounded ${selectedMusic === idx ? 'bg-blue-700' : 'bg-gray-700'} mb-1`} onClick={() => selectMusic(idx)}>
                      {file.name}
                    </button>
                  ))}
                </div>
              )}
              {videoFiles.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs mb-1">Video:</div>
                  {videoFiles.map((file, idx) => (
                    <button key={idx} className={`block w-full text-left px-2 py-1 rounded ${selectedVideo === idx ? 'bg-blue-700' : 'bg-gray-700'} mb-1`} onClick={() => selectVideo(idx)}>
                      {file.name}
                    </button>
                  ))}
                </div>
              )}
              {imageFiles.length > 0 && (
                <div>
                  <div className="text-xs mb-1">Gambar:</div>
                  {imageFiles.map((file, idx) => (
                    <button key={idx} className={`block w-full text-left px-2 py-1 rounded ${selectedImage === idx ? 'bg-blue-700' : 'bg-gray-700'} mb-1`} onClick={() => selectImage(idx)}>
                      {file.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daftar peserta, skor, leaderboard, dst di bawahnya */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Leaderboard for Scores & Final Scores */}
        {(mode === 'scores' || mode === 'finalScores') && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Leaderboard
            </h3>
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

        {/* Participant Management */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Peserta
          </h3>
          <form onSubmit={handleAddParticipant} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newParticipant}
              onChange={e => setNewParticipant(e.target.value)}
              placeholder="Nama peserta baru"
              className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
              Tambah
            </button>
          </form>
          <ul className="space-y-2">
            {gameState.participants.map(p => (
              <li key={p.id} className="flex items-center justify-between bg-gray-700 rounded p-2">
                <span>{p.name}</span>
                <button onClick={() => onRemoveParticipant(p.id)} className="p-1 bg-red-600 rounded hover:bg-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Score Management */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Skor Peserta
          </h3>
          <ul className="space-y-4">
            {gameState.participants.map(p => (
              <li key={p.id} className="bg-gray-700 rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-sm text-gray-300">Skor: {p.currentScore} | Total: {p.totalScore}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={scoreInputs[p.id] || ''}
                    onChange={e => setScoreInputs(prev => ({ ...prev, [p.id]: parseInt(e.target.value) || 0 }))}
                    placeholder="Poin"
                    className="w-20 px-2 py-1 rounded bg-gray-600 border border-gray-500"
                  />
                  <input
                    type="text"
                    value={scoreReasons[p.id] || ''}
                    onChange={e => setScoreReasons(prev => ({ ...prev, [p.id]: e.target.value }))}
                    placeholder="Alasan"
                    className="w-32 px-2 py-1 rounded bg-gray-600 border border-gray-500"
                  />
                  <button
                    onClick={() => handleScoreUpdate(p.id)}
                    className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                  >
                    Update
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
