import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Track {
  title: string;
  artist: string;
  url: string;
  filename: string;
}

interface DesktopMusicPlayerProps {
  isVisible: boolean;
  isMinimized: boolean;
  isPlaying: boolean;
  currentTrack: number;
  playlist: Track[];
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  isRepeating: boolean;
  loadingTrack: number | null;
  theme: 'light' | 'dark';
  onToggle: () => void;
  onClose: () => void;
  onPlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onMute: () => void;
  onIncreaseVolume: () => void;
  onDecreaseVolume: () => void;
}

const DesktopMusicPlayer: React.FC<DesktopMusicPlayerProps> = ({
  isVisible,
  isMinimized,
  isPlaying,
  currentTrack,
  playlist,
  volume,
  isMuted,
  isShuffled,
  isRepeating,
  loadingTrack,
  theme,
  onToggle,
  onClose,
  onPlay,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  onMute,
  onIncreaseVolume,
  onDecreaseVolume,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isRepeating) {
        // If repeat is enabled, restart the same song
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        // If repeat is disabled, go to next song
        onNext();
      }
    };

    const handlePlay = () => {
      // This will be handled by the parent component
    };

    const handlePause = () => {
      // This will be handled by the parent component
    };

    const handleLoadStart = () => {
      // Loading state is managed by parent
    };

    const handleCanPlay = () => {
      // Loading state is managed by parent
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [onNext, isRepeating]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && playlist[currentTrack]) {
      const audio = audioRef.current;
      const track = playlist[currentTrack];
      
      audio.src = track.url;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
  }, [currentTrack, isPlaying, playlist]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  if (!isVisible) return null;

  const currentTrackData = playlist[currentTrack];

  return (
    <>
      {/* Audio Element */}
      <audio 
        ref={audioRef}
        src={currentTrackData?.url}
        style={{ display: 'none' }}
      />

      {/* Minimized state - Left arrow button (when player is closed/minimized) */}
      {isMinimized && (
        <div className="hidden md:block fixed bottom-4 right-4 z-[99999]">
          <motion.button
            onClick={onToggle}
            className="p-3 rounded-full shadow-lg hover:scale-105 transition-all duration-200 border"
            initial={false}
            animate={{
              backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(38, 38, 38, 0.9)',
              borderColor: theme === 'light' ? 'rgba(209, 213, 219, 1)' : 'rgba(82, 82, 82, 1)',
              color: theme === 'light' ? '#1f2937' : '#ffffff'
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        </div>
      )}
      
      {/* Full desktop player - Slides in from right, slides out to right when closed */}
      <div className={`hidden md:block fixed bottom-4 right-4 z-[99999] transition-transform duration-300 ease-in-out ${
        isMinimized ? 'translate-x-[120%]' : 'translate-x-0'
      }`}>
        <motion.div 
          className="backdrop-blur-sm rounded-xl shadow-2xl border w-72 p-2"
          initial={false}
          animate={{
            backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(38, 38, 38, 0.95)',
            borderColor: theme === 'light' ? 'rgba(209, 213, 219, 1)' : 'rgba(82, 82, 82, 1)'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Header with close button only */}
          <div className="flex justify-end mb-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Track Info */}
          <div className="mb-3 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
              {currentTrackData ? 'Lofi' : 'No Track'}
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
              {currentTrackData?.title || 'No Track Selected'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {currentTrackData?.artist || 'Unknown Artist'}
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center space-x-3 mb-3">
            <button
              onClick={onShuffle}
              className={`p-2 rounded-lg transition-colors ${
                isShuffled 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Shuffle size={16} />
            </button>
            <button
              onClick={onPrevious}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={onPlay}
              disabled={loadingTrack === currentTrack}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg ${
                loadingTrack === currentTrack
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200'
              }`}
            >
              {loadingTrack === currentTrack ? (
                <div className="w-5 h-5 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause size={18} />
              ) : (
                <Play size={18} />
              )}
            </button>
            <button
              onClick={onNext}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <SkipForward size={18} />
            </button>
            <button
              onClick={onRepeat}
              className={`p-2 rounded-lg transition-colors ${
                isRepeating 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
                  : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Volume Controls - -, Volume Icon, + */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={onDecreaseVolume}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={onMute}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={onIncreaseVolume}
              className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Plus size={16} />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono ml-2">
              {Math.round((isMuted ? 0 : volume) * 100)}%
            </span>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default DesktopMusicPlayer;

