import { useEffect, useRef, useState, useCallback } from 'react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      const newHead = {
        x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [snake, direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#09090b'; // dark bg
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, i) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      
      // Gradient for neon effect
      const gradient = ctx.createRadialGradient(
        x + cellSize / 2, y + cellSize / 2, 0,
        x + cellSize / 2, y + cellSize / 2, cellSize
      );
      
      if (i === 0) {
        gradient.addColorStop(0, '#00f3ff');
        gradient.addColorStop(1, '#0096ff');
      } else {
        gradient.addColorStop(0, '#ff00ff');
        gradient.addColorStop(1, '#9d00ff');
      }

      ctx.fillStyle = gradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = i === 0 ? '#00f3ff' : '#ff00ff';
      ctx.roundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#39ff14';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#39ff14';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Reset shadow for performance
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 font-display">
      <div className="flex items-center justify-between w-full max-w-[400px]">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-sans">Score</span>
          <span className="text-3xl font-black text-neon-blue neon-glow-blue tracking-tighter">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-sans">Best</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-neon-pink" />
            <span className="text-3xl font-black text-neon-pink neon-glow-pink tracking-tighter">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-zinc-800 rounded-xl neon-border-blue bg-zinc-950 transition-all duration-500"
          id="snake-canvas"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl z-10 p-8 text-center"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-4xl font-black text-neon-pink mb-2 neon-glow-pink italic uppercase tracking-tighter">System Error</h2>
                  <p className="text-zinc-400 mb-6 font-sans">Sequence terminated. Your reach exceeded your limit.</p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-neon-pink text-white px-8 py-3 rounded-full font-bold hover:bg-neon-pink/80 transition-all shadow-[0_0_20px_rgba(255,0,255,0.4)] group"
                  >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    REINITIALIZE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-neon-blue mb-2 neon-glow-blue italic uppercase tracking-tighter">System Idle</h2>
                  <p className="text-zinc-400 mb-6 font-sans">Awaiting connection. Press start to enter the grid.</p>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="bg-neon-blue text-zinc-950 px-10 py-4 rounded-full font-black hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,243,255,0.4)] uppercase tracking-widest"
                  >
                    Connect
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-[400px]">
        <div className="flex flex-col items-center p-3 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1 font-sans">Level</span>
          <span className="text-xl font-bold text-zinc-300">01</span>
        </div>
        <div className="flex flex-col items-center p-3 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1 font-sans">Speed</span>
          <span className="text-xl font-bold text-zinc-300">{1000 - GAME_SPEED}ms</span>
        </div>
        <div className="flex flex-col items-center p-3 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1 font-sans">Grid</span>
          <span className="text-xl font-bold text-zinc-300">{GRID_SIZE}x{GRID_SIZE}</span>
        </div>
      </div>
    </div>
  );
}
