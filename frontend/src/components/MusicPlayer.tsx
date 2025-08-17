import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Plus, Minus } from 'lucide-react';

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
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTrack, setLoadingTrack] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  
  const audioRef = useRef<HTMLAudioElement>(null);

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
          
          // 5 more songs for you to add URLs
          { title: "Only", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419102/gasvwb1s6rzwkvg2xljy.mp3", filename: "Only.mp3" },
          { title: "Dolce Nonna", artist: "Classical", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419127/zscxnqkfiqzg0nv7gxkq.mp3", filename: "Dolce_Nonna.mp3" },
          { title: "Little Waltz", artist: "Classical", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419146/plqh2il8lgjkgyca6myo.mp3", filename: "Little_Waltz.mp3" },
          { title: "Nocturnal", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419169/rwlmkynathwsmgpgpiqg.mp3", filename: "Nocturnal.mp3" },
          { title: "Unshaken", artist: "Lofi Artist", url: "https://res.cloudinary.com/dw9dmadvb/video/upload/v1755419192/wlkmuwkzzjyamdfbpbnj.mp3", filename: "Unshaken.mp3" }
        ];
        
        // Filter out songs without URLs (only keep the ones you've uploaded)
        const availableSongs = allSongs.filter(song => song.url !== "");
        
        if (availableSongs.length > 0) {
          setPlaylist(availableSongs);
          
          // Start with a random song
          const randomIndex = Math.floor(Math.random() * availableSongs.length);
          setCurrentTrack(randomIndex);
          
          console.log(`Loaded ${availableSongs.length} tracks from Cloudinary`);
          
          // Audio is ready but won't autoplay due to browser restrictions
          // User needs to click the start button to begin music
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
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        handleNext();
      }
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

    // Add event listeners
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [isRepeating, volume, currentTrack]);

  // Handle track changes with lazy loading
  useEffect(() => {
    if (audioRef.current && playlist[currentTrack]) {
      const audio = audioRef.current;
      const track = playlist[currentTrack];
      
      // Set loading state
      setLoadingTrack(currentTrack);
      
      // Set the audio source
      audio.src = track.url;
      audio.load();
      
      if (isPlaying) {
        audio.play().catch(console.error);
      }
    }
  }, [currentTrack, isPlaying, playlist]);

  // Preload next track for better UX
  useEffect(() => {
    if (playlist.length > 0) {
      const nextTrackIndex = (currentTrack + 1) % playlist.length;
      const nextTrack = playlist[nextTrackIndex];
      
      // Create a hidden audio element to preload
      const preloadAudio = new Audio();
      preloadAudio.src = nextTrack.url;
      preloadAudio.preload = 'metadata';
    }
  }, [currentTrack, playlist]);

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
    if (isShuffled) {
      let nextTrack;
      do {
        nextTrack = Math.floor(Math.random() * playlist.length);
      } while (nextTrack === currentTrack && playlist.length > 1);
      setCurrentTrack(nextTrack);
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length);
    }
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Volume controls
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const increaseVolume = () => {
    const newVolume = Math.min(1, volume + 0.1);
    handleVolumeChange(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(0, volume - 0.1);
    handleVolumeChange(newVolume);
  };

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };



  if (!isVisible) return null;

  // Debug logging for mobile
  console.log('MusicPlayer render:', { isVisible, isLoading, playlistLength: playlist.length, isMinimized });

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
      {/* Minimized state - show different arrows for mobile and desktop */}
      {isMinimized && (
        <>
          {/* Desktop: Right arrow button */}
          <div className="hidden md:block fixed bottom-4 right-4 z-50">
            <button
              onClick={handleToggle}
              className="bg-white/80 dark:bg-neutral-800 p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <svg className="w-6 h-6 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
          
          {/* Mobile: Up arrow button at bottom center */}
          <div className="md:hidden fixed left-1/2 transform -translate-x-1/2 z-[99999] bottom-4">
            <button
              onClick={handleToggle}
              className="bg-white dark:bg-neutral-800 p-2 rounded-full shadow-lg border border-gray-300 dark:border-gray-600"
            >
              <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </>
      )}
      
      {/* Full player - responsive design with different heights and positioning */}
      <div className={`transition-transform duration-300 ease-in-out ${
        isMinimized 
          ? 'md:translate-x-80' // Desktop: slide right only
          : 'translate-x-0'
      }`}>
        {/* Desktop: Floating player with smaller height */}
        <div className="hidden md:block fixed bottom-4 right-4 z-50">
          <div className="bg-white/80 dark:bg-neutral-800 rounded-lg shadow-lg p-3 w-72">
            {/* Close button only */}
            <div className="flex justify-end mb-3">
              <button
                onClick={handleToggle}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Audio Element */}
            <audio 
              ref={audioRef}
              src={playlist[currentTrack]?.url}
              onEnded={handleNext}

              onCanPlay={() => setLoadingTrack(null)}
              onError={() => setLoadingTrack(null)}
              style={{ display: 'none' }}
            />

            {/* Track Info - Centered */}
            <div className="mb-3 text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {playlist[currentTrack]?.artist}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {playlist[currentTrack]?.title}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-3 mb-3">
              <button
                onClick={() => {
                  if (!isShuffled) {
                    const shuffled = [...playlist].sort(() => Math.random() - 0.5);
                    setPlaylist(shuffled);
                    setCurrentTrack(0);
                  } else {
                    window.location.reload();
                  }
                  setIsShuffled(!isShuffled);
                }}
                className={`p-1 rounded-lg transition-colors ${
                  isShuffled 
                    ? 'bg-gray-700/20 text-gray-700 dark:bg-gray-400/20 dark:text-gray-400' 
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <Shuffle size={14} />
              </button>
              <button
                onClick={handlePrevious}
                className="p-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <SkipBack size={16} />
              </button>
              <button
                onClick={togglePlay}
                disabled={loadingTrack === currentTrack}
                className={`p-2 rounded-full transition-colors shadow-sm ${
                  loadingTrack === currentTrack
                    ? 'bg-gray-500 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200'
                }`}
              >
                {loadingTrack === currentTrack ? (
                  <div className="w-4 h-4 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                ) : isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <SkipForward size={16} />
              </button>
              <button
                onClick={() => setIsRepeating(!isRepeating)}
                className={`p-1 rounded-lg transition-colors ${
                  isRepeating 
                    ? 'bg-gray-700/20 text-gray-700 dark:bg-gray-400/20 dark:text-gray-400' 
                    : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                }`}
              >
                <Repeat size={14} />
              </button>
            </div>

            {/* Volume Controls */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={decreaseVolume}
                className="p-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Minus size={12} />
              </button>
              <button
                onClick={toggleMute}
                className="p-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <button
                onClick={increaseVolume}
                className="p-1 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
              >
                <Plus size={12} />
              </button>
              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2 min-w-[2rem] text-right">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Mobile: Bottom-attached player like Spotify - Always visible like navbar */}
        <div className={`md:hidden fixed left-0 right-0 z-[99999] transition-transform duration-300 ease-in-out ${
          isMinimized ? 'translate-y-full' : 'translate-y-0'
        } bottom-0`}>
          <div className="bg-white dark:bg-neutral-800 border-t border-gray-300 dark:border-gray-600 p-3 shadow-xl">
            {/* Audio Element */}
            <audio 
              ref={audioRef}
              src={playlist[currentTrack]?.url}
              onEnded={handleNext}

              onCanPlay={() => setLoadingTrack(null)}
              onError={() => setLoadingTrack(null)}
              style={{ display: 'none' }}
            />

            {/* Track Info and Controls in one row */}
            <div className="flex items-center justify-between">
              {/* Track Info */}
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {playlist[currentTrack]?.artist}
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {playlist[currentTrack]?.title}
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <SkipBack size={18} />
                </button>
                <button
                  onClick={togglePlay}
                  disabled={loadingTrack === currentTrack}
                  className={`p-2 rounded-full transition-colors shadow-sm ${
                    loadingTrack === currentTrack
                      ? 'bg-gray-500 dark:bg-gray-700 cursor-not-allowed'
                      : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-200'
                  }`}
                >
                  {loadingTrack === currentTrack ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-gray-800 border-t-transparent rounded-full animate-spin"></div>
                  ) : isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} />
                  )}
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Close button */}
              <button
                onClick={handleToggle}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors ml-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicPlayer;
