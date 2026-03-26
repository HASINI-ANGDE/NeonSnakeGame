import React, { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const GAME_SPEED = 100;

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const directionRef = useRef(direction);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
    gameAreaRef.current?.focus();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === 'Enter' || e.key === ' ') resetGame();
        return;
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = {
          x: head.x + currentDir.x,
          y: head.y + currentDir.y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 1);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(currentDir);
        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood]);

  useEffect(() => {
    gameAreaRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[500px]">
      <div className="flex items-center justify-between w-full bg-magenta text-black px-4 py-2 border-4 border-magenta">
        <div className="text-sm font-pixel">
          DATA_FRAGMENTS: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-sm font-pixel animate-pulse">
          {gameOver ? 'ERR' : isPaused ? 'HLT' : 'RUN'}
        </div>
      </div>

      <div 
        ref={gameAreaRef}
        tabIndex={0}
        className="relative bg-black border-4 border-cyan p-1 outline-none focus:border-white transition-colors w-full aspect-square"
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--color-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-cyan) 1px, transparent 1px)`,
            backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
          }}
        />

        {/* Game Area */}
        <div className="w-full h-full relative">
          {/* Food */}
          <div
            className="absolute bg-cyan"
            style={{
              left: `${(food.x / GRID_SIZE) * 100}%`,
              top: `${(food.y / GRID_SIZE) * 100}%`,
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
            }}
          />

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div
                key={`${segment.x}-${segment.y}-${index}`}
                className={`absolute ${isHead ? 'bg-white' : 'bg-magenta'} border border-black`}
                style={{
                  left: `${(segment.x / GRID_SIZE) * 100}%`,
                  top: `${(segment.y / GRID_SIZE) * 100}%`,
                  width: `${100 / GRID_SIZE}%`,
                  height: `${100 / GRID_SIZE}%`,
                }}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 border-4 border-magenta m-2">
            <h2 className="text-2xl md:text-3xl font-pixel text-magenta mb-4 text-center glitch" data-text="CRITICAL_ERROR">CRITICAL_ERROR</h2>
            <p className="text-cyan font-terminal text-2xl mb-8">SYSTEM_HALTED</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-cyan text-black font-pixel text-sm hover:bg-white hover:text-black transition-none border-b-4 border-r-4 border-magenta active:border-0 active:translate-y-1 active:translate-x-1"
            >
              INITIALIZE_REBOOT
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 border-4 border-cyan m-2">
            <h2 className="text-2xl font-pixel text-cyan mb-4">EXECUTION_PAUSED</h2>
            <p className="text-white font-terminal text-xl animate-pulse">AWAITING_RESUME_SIGNAL</p>
          </div>
        )}
      </div>
    </div>
  );
}
