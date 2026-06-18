import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { playlist as allSongs } from '../data/playlist';

interface MusicPlayerProps {
  isVisible: boolean;
  theme: 'light' | 'dark';
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isVisible, theme }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(() => Math.floor(Math.random() * allSongs.length));
  const playlist = allSongs;
  const [loadingTrack, setLoadingTrack] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(true); // Start hidden by default on mobile

  const audioRef = useRef<HTMLAudioElement>(null);

  // Listen for desktop player state changes to auto-pause
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, pause music
        if (isPlaying && audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      }
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Listen for window focus/blur to handle tab switching
    const handleFocus = () => {
      // Tab is focused, could resume if needed
    };

    const handleBlur = () => {
      // Tab is blurred, pause music
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Listen for custom event when desktop player starts
    const handleDesktopPlayerStart = () => {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('desktopPlayerStart', handleDesktopPlayerStart);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('desktopPlayerStart', handleDesktopPlayerStart);
    };
  }, [isPlaying]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      setLoadingTrack(currentTrack);
    };

    const handleCanPlay = () => {
      setLoadingTrack(null);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setLoadingTrack(null);
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
  }, [currentTrack, playlist.length]);

  // Handle track changes
  useEffect(() => {
    if (audioRef.current && playlist[currentTrack]) {
      const audio = audioRef.current;
      const track = playlist[currentTrack];
      
      setLoadingTrack(currentTrack);
      audio.src = track.url;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
  }, [currentTrack, isPlaying, playlist]);

  // Playback controls
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % playlist.length);
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  if (!isVisible) return null;

  if (playlist.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <motion.div 
          className="rounded-lg shadow-lg p-4 w-80"
          initial={false}
          animate={{
            backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.95)' : 'rgba(38, 38, 38, 1)',
            color: theme === 'light' ? '#92400e' : '#9ca3af'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="text-center py-2">
            No music available
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={playlist[currentTrack]?.url}
        style={{ display: 'none' }}
      />

      {/* Mobile Minimized State - Up arrow elevated from bottom */}
      {isMinimized && (
        <div className="md:hidden fixed left-1/2 transform -translate-x-1/2 z-[99999]" style={{ bottom: '20px' }}>
          <motion.button
            onClick={handleToggle}
            className="p-3 rounded-full shadow-lg border hover:scale-105 transition-transform"
            initial={false}
            animate={{
              backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.95)' : 'rgba(38, 38, 38, 1)',
              borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(82, 82, 82, 1)',
              color: theme === 'light' ? '#92400e' : '#ffffff'
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      )}

      {/* Mobile Music Player - Bottom-attached like Spotify */}
      <div className={`md:hidden fixed left-0 right-0 z-[99999] transition-transform duration-300 ease-in-out ${
        isMinimized ? 'translate-y-full' : 'translate-y-0'
      }`} style={{ bottom: 0 }}>
        <motion.div 
          className="border-t p-4 shadow-xl max-h-[80vh] overflow-y-auto scrollbar-hide"
          style={{ minHeight: '90px' }}
          initial={false}
          animate={{
            backgroundColor: theme === 'light' ? 'rgba(254, 243, 199, 0.95)' : 'rgba(38, 38, 38, 1)',
            borderColor: theme === 'light' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(82, 82, 82, 1)'
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Track Info and Controls in one row */}
          <div className="flex items-center justify-between">
            {/* Track Info */}
            <div className="flex-1 min-w-0 mr-4">
              <div className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                {playlist[currentTrack]?.artist}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {playlist[currentTrack]?.title}
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePrevious}
                className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <SkipBack size={20} />
              </button>
              <button
                onClick={togglePlay}
                disabled={loadingTrack === currentTrack}
                className={`p-3 rounded-full transition-colors shadow-sm ${
                  loadingTrack === currentTrack
                    ? 'bg-gray-500 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200'
                }`}
              >
                {loadingTrack === currentTrack ? (
                  <div className="w-6 h-6 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <Pause size={22} />
                ) : (
                  <Play size={22} />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <SkipForward size={20} />
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={handleToggle}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ml-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MusicPlayer;
