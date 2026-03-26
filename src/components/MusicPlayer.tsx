import React, { useState, useEffect, useRef } from 'react';

const TRACKS = [
  {
    id: 1,
    title: "SECTOR_01_SCAN",
    artist: "AI_NODE_ALPHA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "DATA_CORRUPTION",
    artist: "AI_NODE_BETA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "KERNEL_PANIC",
    artist: "AI_NODE_GAMMA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnded = () => {
    handleNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
    }
  };

  return (
    <div className="bg-black border-4 border-magenta p-6 w-full max-w-md flex flex-col gap-4 relative">
      <div className="absolute top-0 right-0 bg-magenta text-black px-2 py-1 font-pixel text-xs -translate-y-full border-t-4 border-l-4 border-r-4 border-magenta">
        AUDIO_STREAM // ACTIVE
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />
      
      <div className="flex items-center gap-4 border-b-2 border-cyan pb-4">
        <div className="w-16 h-16 bg-black border-2 border-cyan flex items-center justify-center shrink-0 relative overflow-hidden">
          {isPlaying && (
            <div className="absolute inset-0 bg-cyan/20 animate-pulse" />
          )}
          <span className="font-pixel text-cyan text-xs">WAV</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-pixel text-sm truncate mb-2">
            {currentTrack.title}
          </h3>
          <p className="text-magenta font-terminal text-lg truncate">SRC: {currentTrack.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div 
        className="h-4 bg-black border-2 border-white cursor-pointer relative"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-cyan transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="px-2 py-1 bg-black border-2 border-magenta text-magenta font-pixel text-xs hover:bg-magenta hover:text-black"
          >
            {isMuted ? 'MUT' : 'VOL'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 accent-magenta cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrev}
            className="px-3 py-2 bg-black border-2 border-cyan text-cyan font-pixel text-xs hover:bg-cyan hover:text-black"
          >
            {'<<'}
          </button>
          <button 
            onClick={togglePlay}
            className="px-4 py-2 bg-cyan text-black font-pixel text-xs hover:bg-white hover:text-black border-b-4 border-r-4 border-magenta active:border-0 active:translate-y-1 active:translate-x-1"
          >
            {isPlaying ? 'HALT' : 'EXEC'}
          </button>
          <button 
            onClick={handleNext}
            className="px-3 py-2 bg-black border-2 border-cyan text-cyan font-pixel text-xs hover:bg-cyan hover:text-black"
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}
