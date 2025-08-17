import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface MusicPlayerProps {
  isVisible: boolean;
}

interface Track {
  title: string;
  artist: string;
  url: string;
  filename: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isVisible }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTrack, setLoadingTrack] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

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

  // Load all songs from Cloudinary
  useEffect(() => {
    const loadMusicFromCloudinary = async () => {
      try {
        setIsLoading(true);
        
        // Your uploaded songs with Cloudinary URLs
        const allSongs: Track[] = [
          { title: "New Home (Slowed)", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418684/x7uiq0a0ztuqxnzkp6yl.mp3", filename: "New_Home_Slowed.mp3" },
          { title: "City Of Stars", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418705/pcxirwogzl1mhjwqmvec.mp3", filename: "City_Of_Stars.mp3" },
          { title: "Wind Song", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418732/tgsyhwm230uje0mv6hb0.mp3", filename: "Wind_Song.mp3" },
          { title: "Amore mio aiutami", artist: "Italian", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418751/hrqvt1a9esa6dszgzb1x.mp3", filename: "Amore_mio_aiutami.mp3" },
          { title: "Shingeki", artist: "Anime", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418772/v4dbyere7wzefpfh91ti.mp3", filename: "Shingeki.mp3" },
          { title: "Armstrong Cabin", artist: "Gaming", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418786/qbg3rahkx81ducrhpvmj.mp3", filename: "Armstrong_Cabin.mp3" },
          { title: "The Last of Us (Astray)", artist: "Gaming", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418847/g5wczzpslsd8phclmkr1.mp3", filename: "The_Last_of_Us_Astray.mp3" },
          { title: "Engagement Party", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755418865/iuxpolgwhg2dcsi5b4b3.mp3", filename: "Engagement_Party.mp3" },
          { title: "Only", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419102/gasvwb1s6rzwkvg2xljy.mp3", filename: "Only.mp3" },
          { title: "Dolce Nonna", artist: "Classical", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419127/zscxnqkfiqzg0nv7gxkq.mp3", filename: "Dolce_Nonna.mp3" },
          { title: "Little Waltz", artist: "Classical", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419146/plqh2il8lgjkgyca6myo.mp3", filename: "Little_Waltz.mp3" },
          { title: "Nocturnal", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419169/rwlmkynathwsmgpgpiqg.mp3", filename: "Nocturnal.mp3" },
          { title: "Unshaken", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419192/wlkmuwkzzjyamdfbpbnj.mp3", filename: "Unshaken.mp3" }
        ];
        
        const availableSongs = allSongs.filter(song => song.url !== "");
        
        if (availableSongs.length > 0) {
          setPlaylist(availableSongs);
          const randomIndex = Math.floor(Math.random() * availableSongs.length);
          setCurrentTrack(randomIndex);
          console.log(`Loaded ${availableSongs.length} tracks from Cloudinary`);
        } else {
          console.log('No music files found');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in loadMusicFromCloudinary:', error);
        setIsLoading(false);
      }
    };

    loadMusicFromCloudinary();
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      handleNext();
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
  }, [currentTrack]);

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

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white/95 dark:bg-neutral-800 rounded-lg shadow-lg p-4 w-80">
          <div className="text-center text-gray-600 dark:text-gray-400 py-2">
            Loading music from Cloudinary...
          </div>
        </div>
      </div>
    );
  }

  if (playlist.length === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white/95 dark:bg-neutral-800 rounded-lg shadow-lg p-4 w-80">
          <div className="text-center text-gray-600 dark:text-gray-400 py-2">
            No music available
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Audio Element */}
      <audio 
        ref={audioRef}
        src={playlist[currentTrack]?.url}
        onEnded={handleNext}
        onCanPlay={() => setLoadingTrack(null)}
        onError={() => setLoadingTrack(null)}
        style={{ display: 'none' }}
      />

      {/* Mobile Minimized State - Up arrow elevated from bottom */}
      {isMinimized && (
        <div className="md:hidden fixed left-1/2 transform -translate-x-1/2 z-[99999]" style={{ bottom: '20px' }}>
          <button
            onClick={handleToggle}
            className="bg-white dark:bg-neutral-800 p-3 rounded-full shadow-lg border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform"
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Music Player - Bottom-attached like Spotify */}
      <div className={`md:hidden fixed left-0 right-0 z-[99999] transition-transform duration-300 ease-in-out ${
        isMinimized ? 'translate-y-full' : 'translate-y-0'
      }`} style={{ bottom: 0 }}>
        <div className="bg-white dark:bg-neutral-800 border-t border-gray-300 dark:border-gray-600 p-4 shadow-xl" style={{ minHeight: '90px' }}>
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
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
