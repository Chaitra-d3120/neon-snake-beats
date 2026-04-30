import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Radio, Zap, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center selection:bg-neon-pink/30 selection:text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Header */}
      <header className="w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neon-blue rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
              <Zap className="w-5 h-5 text-zinc-950 fill-current" />
            </div>
            <h1 className="text-xl font-display font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
              Neon <span className="text-neon-pink">Snake</span> Beats
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-zinc-500">
            <a href="#" className="text-neon-blue hover:text-white transition-colors">The Grid</a>
            <a href="#" className="hover:text-white transition-colors">Playlist</a>
            <a href="#" className="hover:text-white transition-colors">Terminal</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#39ff14]" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Live Connect</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
        {/* Game Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-800" />
            <div className="flex items-center gap-2 text-zinc-500">
              <Terminal className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Primary Interface</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-zinc-800 to-zinc-800" />
          </div>
          
          <SnakeGame />

          <div className="mt-8 grid grid-cols-2 gap-8 w-full max-w-[400px] text-zinc-500 border-t border-zinc-900 pt-8">
            <div className="flex flex-col gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Controls</h4>
              <p className="text-xs leading-relaxed opacity-70">
                Use <span className="text-white px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 mx-1">Arrow Keys</span> to navigate the serpentine sequence through the neural grid.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Objective</h4>
              <p className="text-xs leading-relaxed opacity-70">
                Collect <span className="text-neon-green font-bold">Data Blocks</span> to expand memory. Avoid self-intersections to maintain system integrity.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Music Player Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:sticky lg:top-28 flex flex-col items-center lg:items-end w-full"
        >
          <div className="w-full flex items-center gap-4 mb-8">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-800" />
            <div className="flex items-center gap-2 text-zinc-500">
              <Radio className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Audio Stream</span>
            </div>
            <div className="h-px w-8 bg-zinc-800" />
          </div>

          <MusicPlayer />
          
          <div className="mt-12 w-full space-y-4">
            <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 backdrop-blur-sm group hover:border-neon-blue/30 transition-colors">
              <h5 className="text-[10px] font-bold uppercase tracking-widest text-neon-blue mb-2">Neural Engine Status</h5>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['40%', '85%', '60%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="h-full bg-neon-blue shadow-[0_0_8px_rgba(0,243,255,0.5)]" 
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500">OPTIMIZED</span>
              </div>
            </div>
            <p className="text-[10px] text-zinc-600 text-center uppercase tracking-widest px-8 leading-relaxed">
              Designed for high-performance auditory immersion. System latency: 0.04ms. Signal integrity verified.
            </p>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 mt-12 py-8 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-medium">
            © 2026 NEON GRID OPERATIONS // ALL RIGHTS RESERVED
          </p>
          <div className="flex items-center gap-8 text-[10px] text-zinc-600 uppercase tracking-widest">
            <a href="#" className="hover:text-neon-pink transition-colors">Protocols</a>
            <a href="#" className="hover:text-neon-blue transition-colors">Encryption</a>
            <a href="#" className="hover:text-neon-green transition-colors">Infrastructure</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
