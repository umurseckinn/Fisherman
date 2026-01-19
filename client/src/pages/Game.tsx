import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, DollarSign, MapPin } from "lucide-react";
import { GameEngine, CANVAS_WIDTH, CANVAS_HEIGHT } from "@/game/GameEngine";
import { GameState } from "@/game/types";
import { GameOverModal } from "@/components/GameOverModal";
import { LevelCompleteModal } from "@/components/LevelCompleteModal";
import confetti from "canvas-confetti";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "level_complete">("playing");
  
  // React State for UI Overlay (synced with game state)
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIsland, setCurrentIsland] = useState(1);
  const [fuelCost, setFuelCost] = useState(100);

  // Initialize Game
  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Initial game state
    const initialState: GameState = {
      score: 0,
      island: 1,
      fuelCost: 100,
      timeRemaining: 60,
      isPlaying: true,
      hook: {
        angle: Math.PI / 2, // Center down
        length: 0,
        state: 'idle',
        direction: 1,
        x: CANVAS_WIDTH / 2,
        y: 200,
        caughtEntity: null,
      },
      fishes: []
    };

    const engine = new GameEngine(ctx, initialState, {
      onGameOver: (finalScore, island) => {
        setGameState("gameover");
      },
      onScoreUpdate: (newScore) => {
        setScore(newScore);
      },
      onIslandComplete: (island) => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setGameState("level_complete");
      }
    });

    engine.start();
    engineRef.current = engine;

    // Timer sync for UI
    const timerInterval = setInterval(() => {
      // Accessing internal state directly for UI sync is hacky but fast
      // Better to have engine emit events, but this works for simple game
      if (engineRef.current) {
        // We actually want the Engine to control time, but we need to read it
        // Let's rely on the engine callback pattern more, or just let the engine run
        // For simple UI display:
        // (In a real robust app, use a subscriber pattern)
      }
    }, 1000);

    // Using a separate loop to sync React UI with Engine state roughly
    const uiSync = setInterval(() => {
      // @ts-ignore - Accessing private state for read-only UI sync
      const internalState = engineRef.current?.state;
      if (internalState) {
        setTimeLeft(Math.ceil(internalState.timeRemaining));
      }
    }, 200);

    return () => {
      engine.stop();
      clearInterval(timerInterval);
      clearInterval(uiSync);
    };
  }, []);

  const handleTap = () => {
    if (gameState === "playing" && engineRef.current) {
      engineRef.current.handleInput();
    }
  };

  const handleNextLevel = () => {
    const newIsland = currentIsland + 1;
    const newFuelCost = Math.floor(fuelCost * 1.5);
    const costPaid = fuelCost; // The cost of current level
    const remainingCash = score - costPaid;

    setCurrentIsland(newIsland);
    setFuelCost(newFuelCost);
    setScore(remainingCash);
    setGameState("playing");
    setTimeLeft(Math.max(30, 60 - newIsland * 2)); // Time gets shorter

    // Reset Engine State
    if (engineRef.current) {
      // @ts-ignore
      const state = engineRef.current.state;
      state.island = newIsland;
      state.fuelCost = newFuelCost;
      state.score = remainingCash;
      state.timeRemaining = Math.max(30, 60 - newIsland * 2);
      state.fishes = [];
      state.hook.state = 'idle';
      state.hook.length = 0;
      state.hook.caughtEntity = null;
      state.isPlaying = true;
      
      // Restart loop
      engineRef.current.start();
    }
  };

  const handleRetry = () => {
    window.location.reload(); // Simple reload for full reset
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      {/* Game Container - Mobile Aspect Ratio */}
      <div 
        className="relative w-full h-full max-w-[450px] max-h-[800px] bg-sky-100 shadow-2xl overflow-hidden md:rounded-[32px] md:border-8 md:border-slate-800"
        onClick={handleTap}
      >
        {/* Top UI Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
          {/* Time Bubble */}
          <div className="bg-[#99E5FF] border-2 border-white rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2">
            <Clock className="w-5 h-5 text-white fill-[#FFB347]" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-white uppercase">Time:</span>
              <span className="text-xl font-display font-bold text-white">
                00:{timeLeft.toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Coins Bubble */}
          <div className="bg-[#99E5FF] border-2 border-white rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-white fill-[#FFD700]" />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-white uppercase">Coins:</span>
              <span className="text-xl font-display font-bold text-white">{score}</span>
            </div>
          </div>

          {/* Fuel Target Bubble */}
          <div className="bg-[#99E5FF] border-2 border-white rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2">
            <div className="w-5 h-5 bg-[#FF6B6B] rounded-sm flex items-center justify-center">
              <div className="w-2 h-3 bg-white rounded-full opacity-50" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] font-bold text-white uppercase">Fuel Target:</span>
              <span className="text-xl font-display font-bold text-white">{fuelCost}</span>
            </div>
          </div>
        </div>

        {/* Back Button (Absolute) */}
        <Link href="/" className="absolute bottom-6 left-6 z-10 p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors pointer-events-auto">
          <ArrowLeft className="text-white w-6 h-6" />
        </Link>

        {/* Canvas */}
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full block touch-none cursor-pointer"
        />

        {/* Modals */}
        {gameState === "gameover" && (
          <GameOverModal score={score} island={currentIsland} onRetry={handleRetry} />
        )}

        {gameState === "level_complete" && (
          <LevelCompleteModal 
            score={score} 
            island={currentIsland} 
            nextFuelCost={Math.floor(fuelCost * 1.5)} 
            onNextLevel={handleNextLevel}
          />
        )}
      </div>
    </div>
  );
}
