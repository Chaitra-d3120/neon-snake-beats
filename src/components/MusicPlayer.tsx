import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, ListMusic } from 'lucide-react';
import { DUMMY_TRACKS, Track } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showList, setShowList] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setProgress((current / dur) * 100);
      setDuration(dur);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(Number(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-4 font-sans">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="relative group overflow-hidden rounded-2xl aspect-square border border-zinc-800 neon-border-pink">
        <motion.img
          key={currentTrack.id}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          src={currentTrack.cover}
          alt={currentTrack.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <motion.div
            key={currentTrack.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col"
          >
            <h3 className="text-2xl font-black text-white tracking-tight font-display italic uppercase">{currentTrack.title}</h3>
            <p className="text-neon-pink font-bold text-sm tracking-widest uppercase opacity-80">{currentTrack.artist}</p>
          </motion.div>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-md">
        <div className="flex flex-col gap-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-pink hover:accent-neon-blue transition-all"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">
            <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setShowList(!showList)}
            className={`p-2 rounded-lg transition-colors ${showList ? 'text-neon-pink bg-neon-pink/10' : 'text-zinc-500 hover:text-white'}`}
          >
            <ListMusic className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <button
              onClick={prevTrack}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current ml-1" />}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          <button className="p-2 text-zinc-500 hover:text-white transition-colors">
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-zinc-900/80 border border-zinc-800 rounded-2xl backdrop-blur-lg"
          >
            <div className="p-4 flex flex-col gap-2 max-h-48 overflow-y-auto">
              {DUMMY_TRACKS.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => setCurrentTrackIndex(index)}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    currentTrackIndex === index 
                    ? 'bg-neon-pink/20 text-white border border-neon-pink/30' 
                    : 'hover:bg-white/5 text-zinc-400'
                  }`}
                >
                  <img src={track.cover} className="w-10 h-10 rounded object-cover" referrerPolicy="no-referrer" />
                  <div className="flex flex-col items-start translate-y-[-1px]">
                    <span className="text-sm font-bold truncate">{track.title}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-50">{track.artist}</span>
                  </div>
                  {currentTrackIndex === index && isPlaying && (
                    <div className="ml-auto flex gap-[2px]">
                      {[1,2,3].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 12, 4] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1 bg-neon-pink"
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
