import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, DollarSign, Fuel, ShoppingBag, Zap, Anchor } from "lucide-react";
import { GameEngine, CANVAS_WIDTH, CANVAS_HEIGHT } from "@/game/GameEngine";
import { GameState, InventoryItem } from "@/game/types";
import { GameOverModal } from "@/components/GameOverModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "shop">("playing");
  
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentIsland, setCurrentIsland] = useState(1);
  const [fuelCost, setFuelCost] = useState(100);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [upgrades, setUpgrades] = useState({
    rodLevel: 1,
    boatLevel: 1,
    hasFuel: false,
  });

  useEffect(() => {
    if (!canvasRef.current || gameState !== "playing") return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const initialState: GameState = {
      score,
      island: currentIsland,
      fuelCost,
      timeRemaining: 60,
      isPlaying: true,
      hook: {
        angle: Math.PI / 2,
        length: 0,
        state: 'idle',
        direction: 1,
        x: CANVAS_WIDTH / 2,
        y: 200,
        caughtEntity: null,
      },
      fishes: [],
      inventory,
      upgrades
    };

    const engine = new GameEngine(ctx, initialState, {
      onGameOver: () => setGameState("gameover"),
      onScoreUpdate: (newScore) => setScore(newScore),
      onIslandComplete: () => {
        setGameState("shop");
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    });

    engine.start();
    engineRef.current = engine;

    const uiSync = setInterval(() => {
      // @ts-ignore
      const state = engineRef.current?.state;
      if (state) {
        setTimeLeft(Math.ceil(state.timeRemaining));
        setInventory([...state.inventory]);
      }
    }, 200);

    return () => {
      engine.stop();
      clearInterval(uiSync);
    };
  }, [gameState === "playing"]);

  const handleSellAll = () => {
    const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
    setScore(score + totalValue);
    setInventory([]);
    if (engineRef.current) {
      // @ts-ignore
      engineRef.current.state.inventory = [];
      // @ts-ignore
      engineRef.current.state.score += totalValue;
    }
  };

  const buyFuel = () => {
    if (score >= fuelCost && !upgrades.hasFuel) {
      setScore(score - fuelCost);
      setUpgrades(prev => ({ ...prev, hasFuel: true }));
      if (engineRef.current) {
        // @ts-ignore
        engineRef.current.state.score -= fuelCost;
        // @ts-ignore
        engineRef.current.state.upgrades.hasFuel = true;
      }
    }
  };

  const upgradeRod = () => {
    const cost = upgrades.rodLevel * 50;
    if (score >= cost) {
      setScore(score - cost);
      setUpgrades(prev => ({ ...prev, rodLevel: prev.rodLevel + 1 }));
    }
  };

  const upgradeBoat = () => {
    const cost = upgrades.boatLevel * 100;
    if (score >= cost) {
      setScore(score - cost);
      setUpgrades(prev => ({ ...prev, boatLevel: prev.boatLevel + 1 }));
    }
  };

  const handleNextLevel = () => {
    if (!upgrades.hasFuel) return;
    
    setCurrentIsland(prev => prev + 1);
    setFuelCost(Math.floor(fuelCost * 1.5));
    setUpgrades(prev => ({ ...prev, hasFuel: false }));
    setGameState("playing");
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-[450px] max-h-[800px] bg-sky-100 shadow-2xl overflow-hidden md:rounded-[32px] md:border-8 md:border-slate-800">
        
        {/* Playable Area */}
        {gameState === "playing" && (
          <>
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
              <div className="bg-[#99E5FF] border-2 border-white rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2">
                <Clock className="w-5 h-5 text-white fill-[#FFB347]" />
                <span className="text-xl font-display font-bold text-white">00:{timeLeft.toString().padStart(2, '0')}</span>
              </div>
              <div className="bg-[#99E5FF] border-2 border-white rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-white fill-[#FFD700]" />
                <span className="text-xl font-display font-bold text-white">{score}</span>
              </div>
            </div>
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={() => engineRef.current?.handleInput()} className="w-full h-full block touch-none" />
          </>
        )}

        {/* Shop UI */}
        {gameState === "shop" && (
          <div className="absolute inset-0 bg-white/95 z-20 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-blue-600">Island {currentIsland} Reached!</h2>
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <DollarSign className="w-6 h-6" /> {score}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Inventory */}
              <Card className="bg-slate-50 border-2">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1"><Anchor className="w-4 h-4" /> Inventory</CardTitle>
                </CardHeader>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1">
                    {inventory.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Empty</span>
                    ) : (
                      inventory.map((item, idx) => (
                        <div key={idx} className="text-xs flex justify-between p-1 bg-white rounded border">
                          <span>{item.name}</span>
                          <span className="text-green-600 font-bold">${item.value}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <Button onClick={handleSellAll} disabled={inventory.length === 0} className="w-full h-8 text-xs bg-green-500 hover:bg-green-600">Sell All</Button>
                </CardContent>
              </Card>

              {/* Shop */}
              <Card className="bg-slate-50 border-2">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> Market</CardTitle>
                </CardHeader>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Button onClick={buyFuel} disabled={upgrades.hasFuel || score < fuelCost} variant={upgrades.hasFuel ? "outline" : "default"} className="flex flex-col h-auto p-2 gap-1 bg-red-500 hover:bg-red-600">
                      <Fuel className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Buy Fuel (${fuelCost})</span>
                      {upgrades.hasFuel && <span className="text-[8px] text-green-600 font-bold">READY</span>}
                    </Button>
                    <Button onClick={upgradeRod} disabled={score < (upgrades.rodLevel * 50)} className="flex flex-col h-auto p-2 gap-1 bg-blue-500 hover:bg-blue-600">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Better Rod (${upgrades.rodLevel * 50})</span>
                      <span className="text-[8px] opacity-70">Lv.{upgrades.rodLevel}</span>
                    </Button>
                    <Button onClick={upgradeBoat} disabled={score < (upgrades.boatLevel * 100)} className="flex flex-col h-auto p-2 gap-1 bg-purple-500 hover:bg-purple-600">
                      <Anchor className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Big Boat (${upgrades.boatLevel * 100})</span>
                      <span className="text-[8px] opacity-70">Lv.{upgrades.boatLevel}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button onClick={handleNextLevel} disabled={!upgrades.hasFuel} className="mt-auto w-full py-6 text-xl font-display font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300">
              Set Sail to Next Island!
            </Button>
          </div>
        )}

        {gameState === "gameover" && <GameOverModal score={score} island={currentIsland} onRetry={() => window.location.reload()} />}
        
        <Link href="/" className="absolute bottom-6 left-6 z-30 p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors">
          <ArrowLeft className="text-white w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
