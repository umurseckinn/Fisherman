import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, DollarSign, Fuel, ShoppingBag, Zap, Anchor, Pause, RotateCcw, Home as HomeIcon, Play, Bomb, X } from "lucide-react";
import { GameEngine, CANVAS_WIDTH, CANVAS_HEIGHT, SEA_LEVEL_Y, LEVEL_CONFIG } from "@/game/GameEngine";
import { type GameState, type Entity, type CurseType, type InventoryItem, type FishClass } from "@/game/types";
import { GameOverModal } from "@/components/GameOverModal";
import { InfoCard } from "@/components/InfoCard";
import { BoosterPurchaseModal, type BoosterType } from "@/components/BoosterPurchaseModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const whirlpoolImgRef = useRef<HTMLImageElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "shop" | "win">("playing");

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [anchorEffectTimer, setAnchorEffectTimer] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [fuelCost, setFuelCost] = useState<number>(50); // Doubled from 25
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [currentStorage, setCurrentStorage] = useState(0);
  const [buoyancyOffset, setBuoyancyOffset] = useState(0);
  const [weightDisplayOffset, setWeightDisplayOffset] = useState(0);
  const [hookAttempts, setHookAttempts] = useState(3);
  const [maxHookAttempts, setMaxHookAttempts] = useState(3);
  const [activeCurse, setActiveCurse] = useState<CurseType>('none');
  const [curseTimerMs, setCurseTimerMs] = useState(0);
  const [caughtFish, setCaughtFish] = useState<Entity | null>(null);
  const [selectedEntityForInfo, setSelectedEntityForInfo] = useState<FishClass | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [purchaseBoosterType, setPurchaseBoosterType] = useState<BoosterType | null>(null);

  const [upgrades, setUpgrades] = useState({
    rodLevel: 1,
    boatLevel: 1,
    hasFuel: false,
    storageCapacity: 60,
  });
  const [activeBoosters, setActiveBoosters] = useState({
    speed: false,
    lucky: false,
    value: false,
    harpoon: 0,
    net: 0,
    tnt: 0,
    anchor: 0,
  });
  const [selectedBooster, setSelectedBooster] = useState<'harpoon' | 'net' | 'tnt' | 'anchor' | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !bgCanvasRef.current || gameState !== "playing") return;

    const ctx = canvasRef.current.getContext("2d");
    const bgCtx = bgCanvasRef.current.getContext("2d");
    if (!ctx || !bgCtx) return;

    const levelConfig = LEVEL_CONFIG[currentLevel as keyof typeof LEVEL_CONFIG];
    const initialState: GameState = {
      score,
      level: currentLevel,
      region: levelConfig?.region ?? 1,
      fuelCost: levelConfig?.fuelCost ?? 50,
      timeRemaining: levelConfig?.duration ?? 60,
      isPlaying: true,
      weather: "sunny",
      hook: {
        angle: Math.PI / 2,
        length: 0,
        state: 'idle',
        direction: 1,
        x: CANVAS_WIDTH / 2,
        y: SEA_LEVEL_Y,
        caughtEntity: null,
      },
      fishes: [],
      inventory,
      upgrades,
      currentStorage,
      hookAttempts: currentLevel === 1 ? 3 : hookAttempts,
      maxHookAttempts: currentLevel === 1 ? 3 : maxHookAttempts,
      hookSpeedBoostMs: 0,
      fishPanicMs: 0,
      buoyancyOffset: 0,
      buoyancyOffsetMs: 0,
      weightDisplayOffset: 0,
      weightDisplayOffsetMs: 0,
      anchorSnagMs: 0,
      hookBrokenMs: 0,
      valueMultiplier: 1,
      leafBonusStacks: 0,
      candyBonusStacks: 0,
      zapShockMs: 0,
      moonSlowMs: 0,
      lavaBurnMs: 0,
      activeCurse: 'none',
      curseTimerMs: 0,
      boosters: activeBoosters,
      activeBooster: selectedBooster,
      anchorEffectTimerMs: 0,
      isPaused: false
    };

    const engine = new GameEngine(ctx, bgCtx, whirlpoolImgRef.current, initialState, {
      onGameOver: (finalScore, finalLevel, reason) => {
        setGameState("gameover");
        setGameOverReason(reason ?? null);
      },
      onScoreUpdate: (newScore) => setScore(newScore),
      onLevelComplete: (level) => {
        const state = engineRef.current?.getState();
        if (state) {
          setTimeLeft(Math.ceil(state.timeRemaining));
          setInventory([...state.inventory]);
          setScore(state.score);
          setCurrentStorage(state.inventory.reduce((sum, item) => sum + item.weight, 0));
          setHookAttempts(state.hookAttempts || 0);
          setMaxHookAttempts(state.maxHookAttempts || 0);
          setFuelCost(state.fuelCost || 50);

          if (state.upgrades) {
            setUpgrades(prev => ({
              ...prev,
              rodLevel: state.upgrades.rodLevel,
              boatLevel: state.upgrades.boatLevel,
              hasFuel: state.upgrades.hasFuel,
              storageCapacity: state.upgrades.storageCapacity
            }));
          }
        }
        setCurrentLevel(level);
        if (state) {
          // Keep the existing boosters instead of resetting them
          setActiveBoosters(prev => ({ ...prev }));
        }
        setSelectedBooster(null);

        if (level >= 100) {
          setGameState("win");
          confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
          return;
        }
        setGameState("shop");
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      },
      onFishCaught: (fish) => {
        setCaughtFish(fish);
        setTimeout(() => setCaughtFish(null), 2000);
      },
      onBoosterUsed: (type: 'harpoon' | 'net' | 'tnt' | 'anchor') => {
        setActiveBoosters(prev => ({ ...prev, [type]: prev[type] - 1 }));
        setSelectedBooster(null);
      }
    });

    engine.start();
    engineRef.current = engine;

    const uiSync = setInterval(() => {
      const state = engineRef.current?.getState();
      if (state) {
        setTimeLeft(Math.ceil(state.timeRemaining));
        setInventory([...state.inventory]);
        setScore(state.score);
        setCurrentStorage(state.inventory.reduce((sum, item) => sum + item.weight, 0));
        setBuoyancyOffset(state.buoyancyOffset || 0);
        setWeightDisplayOffset(state.weightDisplayOffset || 0);
        setAnchorEffectTimer(state.anchorEffectTimerMs || 0);
        setHookAttempts(state.hookAttempts || 0);
        setMaxHookAttempts(state.maxHookAttempts || 0);
        setActiveCurse(state.activeCurse || 'none');
        setCurseTimerMs(state.curseTimerMs || 0);
        setIsPaused(state.isPaused || false);

        if (state.upgrades) {
          setUpgrades(prev => ({
            ...prev,
            rodLevel: state.upgrades.rodLevel,
            boatLevel: state.upgrades.boatLevel,
            hasFuel: state.upgrades.hasFuel,
            storageCapacity: state.upgrades.storageCapacity
          }));
        }
      }
    }, 200);

    return () => {
      engine.stop();
      clearInterval(uiSync);
    };
  }, [gameState, currentLevel]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.getState().activeBooster = selectedBooster;
    }
  }, [selectedBooster]);

  // Check for Fuel Soft-lock (Game Over condition in Shop)
  useEffect(() => {
    if (gameState === 'shop' && !upgrades.hasFuel) {
      const isTersMarket = activeCurse === 'ters_market' || activeCurse === 'final_3';
      const finalCost = isTersMarket ? Math.round(fuelCost * 1.5) : fuelCost;

      if (score < finalCost && inventory.length === 0) {
        // Delay slightly to let the shop render first before jumping to game over
        const timer = setTimeout(() => {
          setGameState("gameover");
          setGameOverReason("Out of fuel and out of money!");
          if (engineRef.current) {
            engineRef.current.stop();
          }
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, upgrades.hasFuel, score, inventory.length, fuelCost, activeCurse]);

  const handlePurchase = (pkg: { type: 'all' | 'single', amount: number }) => {
    if (!purchaseBoosterType) return;

    setActiveBoosters(prev => {
      const next = { ...prev };
      if (pkg.type === 'all') {
        next.harpoon += pkg.amount;
        next.net += pkg.amount;
        next.tnt += pkg.amount;
        next.anchor += pkg.amount;
      } else {
        next[purchaseBoosterType] += pkg.amount;
      }

      if (engineRef.current) {
        engineRef.current.getState().boosters = { ...next };
      }

      return next;
    });
  };

  const handleSellAll = () => {
    const isTersMarket = activeCurse === 'ters_market' || activeCurse === 'final_3';
    const totalValue = inventory.reduce((sum, item) => {
      const value = isTersMarket ? Math.round(item.value * 0.5) : item.value;
      return sum + value;
    }, 0);
    const newScore = score + totalValue;
    setScore(newScore);
    setInventory([]);
    if (engineRef.current) {
      engineRef.current.getState().inventory = [];
      engineRef.current.getState().score = newScore;
      engineRef.current.recalculateStorage();
    }
  };

  const buyFuel = () => {
    const isTersMarket = activeCurse === 'ters_market' || activeCurse === 'final_3';
    const finalCost = isTersMarket ? Math.round(fuelCost * 1.5) : fuelCost;

    if (score >= finalCost && !upgrades.hasFuel) {
      const newScore = score - finalCost;
      setScore(newScore);
      setUpgrades(prev => ({ ...prev, hasFuel: true }));
      if (engineRef.current) {
        engineRef.current.getState().score = newScore;
        engineRef.current.getState().upgrades.hasFuel = true;
      }
    }
  };

  const upgradeRod = () => {
    if (upgrades.rodLevel >= 3) return;
    let baseCost = upgrades.rodLevel === 1 ? 200 : 440; // Doubled (100 -> 200, 220 -> 440)
    const isTersMarket = activeCurse === 'ters_market' || activeCurse === 'final_3';
    const finalCost = isTersMarket ? Math.round(baseCost * 1.5) : baseCost;

    if (score >= finalCost) {
      const newScore = score - finalCost;
      const newRodLevel = upgrades.rodLevel + 1;
      const newMaxAttempts = newRodLevel === 2 ? 4 : 5;
      setScore(newScore);
      setUpgrades(prev => ({ ...prev, rodLevel: newRodLevel }));
      setMaxHookAttempts(newMaxAttempts);
      setHookAttempts(newMaxAttempts);
      if (engineRef.current) {
        engineRef.current.getState().score = newScore;
        engineRef.current.getState().upgrades.rodLevel = newRodLevel;
        engineRef.current.getState().maxHookAttempts = newMaxAttempts;
        engineRef.current.getState().hookAttempts = newMaxAttempts;
      }
    }
  };

  const upgradeBoat = () => {
    if (upgrades.boatLevel >= 3) return;
    let baseCost = upgrades.boatLevel === 1 ? 360 : 760; // Doubled (180 -> 360, 380 -> 760)
    const isTersMarket = activeCurse === 'ters_market' || activeCurse === 'final_3';
    const finalCost = isTersMarket ? Math.round(baseCost * 1.5) : baseCost;

    if (score >= finalCost) {
      const newScore = score - finalCost;
      const newBoatLevel = upgrades.boatLevel + 1;
      const newCapacity = newBoatLevel === 2 ? 90 : 130;

      setScore(newScore);
      setUpgrades(prev => ({
        ...prev,
        boatLevel: newBoatLevel,
        storageCapacity: newCapacity
      }));
      if (engineRef.current) {
        engineRef.current.getState().score = newScore;
        engineRef.current.getState().upgrades.boatLevel = newBoatLevel;
        engineRef.current.getState().upgrades.storageCapacity = newCapacity;
      }
    }
  };

  const repairHook = (amount: number, cost: number) => {
    // cost is passed from UI, but we should double it here or where it's called
    if (hookAttempts >= maxHookAttempts || score < cost) return;
    const newScore = score - cost;
    const newAttempts = Math.min(maxHookAttempts, hookAttempts + amount);
    setScore(newScore);
    setHookAttempts(newAttempts);
    if (engineRef.current) {
      engineRef.current.getState().score = newScore;
      engineRef.current.getState().hookAttempts = newAttempts;
    }
  };

  const handleNextLevel = () => {
    if (!upgrades.hasFuel) return;
    if (currentLevel >= 100) return;
    setCurrentLevel(prev => {
      const nextLevel = prev + 1;
      const config = LEVEL_CONFIG[nextLevel as keyof typeof LEVEL_CONFIG];
      setFuelCost(config?.fuelCost ?? 50);
      return nextLevel;
    });
    setUpgrades(prev => ({ ...prev, hasFuel: false }));
    setGameState("playing");
  };

  const formatTime = (seconds: number) => {
    const s = Math.max(0, seconds);
    const mins = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalWeight = currentStorage || 0;
  const isTersAgirlik = activeCurse === 'ters_agirlik' || activeCurse === 'final_3';

  // 'ters_agirlik' curse: gauge turns reverse (%0=full, %100=empty)
  const rawStorageRatio = (totalWeight / upgrades.storageCapacity) || 0;
  const storageRatio = isTersAgirlik ? (1 - rawStorageRatio) : rawStorageRatio;
  const storagePercent = Math.min(100, storageRatio * 100);

  const storageColor = rawStorageRatio >= 0.96 ? 'bg-red-500' :
    rawStorageRatio >= 0.81 ? 'bg-orange-500' :
      rawStorageRatio >= 0.61 ? 'bg-yellow-400' : 'bg-green-500';

  const groupInventory = (items: InventoryItem[]) => {
    const groups: Record<string, { count: number, totalValue: number }> = {};
    items.forEach(item => {
      if (!groups[item.name]) {
        groups[item.name] = { count: 0, totalValue: 0 };
      }
      groups[item.name].count++;
      groups[item.name].totalValue += item.value;
    });
    return Object.entries(groups).map(([name, data]) => ({
      name,
      count: data.count,
      totalValue: data.totalValue
    }));
  };

  const togglePause = () => {
    if (engineRef.current) {
      if (isPaused) {
        engineRef.current.resume();
      } else {
        engineRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  const handleEntityInfoOpen = (type: FishClass) => {
    if (engineRef.current) {
      engineRef.current.pause();
      setIsPaused(true);
    }
    setSelectedEntityForInfo(type);
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 flex items-center justify-center overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
      <div className="relative w-full h-full max-w-[450px] max-h-[800px] bg-sky-100 shadow-2xl overflow-hidden md:rounded-[32px] md:border-8 md:border-slate-800">

        {/* Playable Area */}
        {gameState === "playing" && (
          <>
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
              <div className="flex gap-2 items-center pointer-events-auto">
                <div className={`border-2 border-white rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2 ${anchorEffectTimer > 0 ? 'bg-green-500 animate-pulse' : 'bg-[#99E5FF]'}`}>
                  <Clock className={`w-5 h-5 text-white ${anchorEffectTimer > 0 ? 'fill-green-700' : 'fill-[#FFB347]'}`} />
                  <span className="text-xl font-display font-bold text-white">
                    {anchorEffectTimer > 0
                      ? formatTime(Math.ceil(anchorEffectTimer / 1000))
                      : formatTime(timeLeft)}
                  </span>
                </div>
                <button
                  onClick={togglePause}
                  className="bg-white/90 backdrop-blur-sm border-2 border-white rounded-xl p-2 shadow-md hover:scale-105 transition-transform active:scale-95"
                >
                  <Pause className="w-5 h-5 text-slate-600 fill-slate-600" />
                </button>
              </div>

              <div className="flex flex-col gap-2 items-end">
                {/* Storage Bar */}
                <div className="bg-white/90 backdrop-blur-sm border-2 border-white rounded-xl p-2 shadow-md w-32 flex flex-col gap-1 transition-all">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1"><Anchor className="w-3 h-3" /> Storage</span>
                    <span className={storageRatio >= 0.96 ? 'text-red-500 animate-pulse' : storageRatio >= 0.81 ? 'text-orange-500' : storageRatio >= 0.61 ? 'text-yellow-600' : 'text-slate-500'}>
                      {totalWeight.toFixed(1)} / {upgrades.storageCapacity} kg
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${storageColor}`}
                      style={{ width: `${storagePercent}%` }}
                    />
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm border-2 border-white rounded-xl p-2 shadow-md w-32 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Hook</span>
                  <span className={hookAttempts === 0 ? 'text-red-500 animate-pulse' : 'text-slate-600'}>
                    {hookAttempts} / {maxHookAttempts}
                  </span>
                </div>
                {activeCurse !== 'none' && (
                  <div className="bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold animate-bounce shadow-lg">
                    CURSE: {activeCurse.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
            <canvas ref={bgCanvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="absolute inset-0 w-full h-full block" style={{ zIndex: 0 }} />
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
                const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
                engineRef.current?.handlePointerDown(x, y);
              }}
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
                const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
                engineRef.current?.handlePointerMove(x, y);
              }}
              onPointerUp={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
                const y = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
                engineRef.current?.handlePointerUp(x, y);
              }}
              className="absolute inset-0 w-full h-full block touch-none"
              style={{ zIndex: 1 }}
            />
            <img
              ref={whirlpoolImgRef}
              src="/assets/environment/whirlpool.png"
              alt=""
              style={{
                position: 'absolute',
                display: 'none',
                width: '110px',
                height: '110px',
                transformOrigin: 'center center',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {caughtFish && (
              <div className="absolute left-4 z-50 pointer-events-auto" style={{ top: SEA_LEVEL_Y - 140 }}>
                <button
                  onClick={() => handleEntityInfoOpen(caughtFish.type as FishClass)}
                  className="bg-white/50 backdrop-blur-md p-2 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.08)] border-2 border-white/50 flex flex-col items-center text-center animate-in zoom-in-50 duration-300 w-[100px] group hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="w-20 h-14 mb-1 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-25 blur-lg scale-110 group-hover:scale-125 transition-transform animate-pulse"></div>
                    <img
                      src={['coral', 'treasure_chest', 'whirlpool', 'sunken_boat', 'shark_skeleton', 'env_bubbles', 'anchor', 'shell', 'sea_kelp', 'sea_rock', 'sea_rock_large', 'sea_kelp_horizontal'].includes(caughtFish.type) ? `/assets/environment/${caughtFish.type === 'env_bubbles' ? 'bubbles' : caughtFish.type}.png` : `/assets/fish/${caughtFish.type}_fish.png`}
                      alt={caughtFish.name}
                      className="w-full h-full object-contain drop-shadow-md relative z-10 scale-125"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <h2 className="text-[11px] font-display font-bold text-slate-800 leading-tight mb-1">{caughtFish.name}</h2>
                  <div className="bg-primary/20 text-primary text-[8px] px-2 py-0.5 rounded-full font-bold">INFO</div>
                </button>
              </div>
            )}

            {/* Booster Selection Buttons */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
              {[
                { id: 'harpoon', icon: Zap, label: 'Harpoon', count: activeBoosters.harpoon },
                { id: 'net', icon: ShoppingBag, label: 'Net', count: activeBoosters.net },
                { id: 'tnt', icon: Bomb, label: 'TNT', count: activeBoosters.tnt },
                { id: 'anchor', icon: Anchor, label: 'Anchor', count: activeBoosters.anchor },
              ].map((booster) => (
                <button
                  key={booster.id}
                  onClick={() => {
                    if (booster.count === 0) {
                      setPurchaseBoosterType(booster.id as BoosterType);
                      setPurchaseModalOpen(true);
                      if (engineRef.current) {
                        engineRef.current.pause();
                        setIsPaused(true);
                      }
                    } else {
                      setSelectedBooster(prev => prev === booster.id ? null : booster.id as any);
                    }
                  }}
                  className={`relative w-12 h-12 flex items-center justify-center rounded-2xl border-2 transition-all shadow-lg ${booster.count === 0
                    ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-50 grayscale'
                    : selectedBooster === booster.id
                      ? 'bg-blue-500 border-white text-white scale-110'
                      : 'bg-white border-blue-100 text-blue-500 hover:border-blue-300'
                    }`}
                >
                  <booster.icon className="w-6 h-6" />
                  <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border border-white">
                    {booster.count}
                  </span>
                  {selectedBooster === booster.id && (
                    <div className="absolute -top-1 -right-1 bg-white text-red-500 rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-in zoom-in-50">
                      <X className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Shop UI */}
        {gameState === "shop" && (
          <div className="absolute inset-0 bg-white/95 z-20 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-blue-600">Level {currentLevel - 1} Complete!</h2>
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <DollarSign className="w-6 h-6" /> {score}
              </div>
              {activeCurse !== 'none' && (
                <div className="mt-2 text-red-600 font-bold text-sm bg-red-50 p-2 rounded-lg border border-red-200">
                  L{currentLevel} CURSE ACTIVE: {activeCurse.toUpperCase()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <Card className="bg-slate-50 border-2">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1"><Anchor className="w-4 h-4" /> Inventory</CardTitle>
                </CardHeader>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1">
                    {inventory.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Empty</span>
                    ) : (
                      groupInventory(inventory).map((item, idx) => (
                        <div key={idx} className="text-xs flex justify-between p-1 bg-white rounded border">
                          <span>{item.name} {item.count > 1 ? `(x${item.count})` : ''}</span>
                          <span className="text-green-600 font-bold">${item.totalValue}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <Button onClick={handleSellAll} disabled={inventory.length === 0} className="w-full h-8 text-xs bg-green-500 hover:bg-green-600">Sell All</Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-50 border-2">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> Market</CardTitle>
                </CardHeader>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Button onClick={buyFuel} disabled={upgrades.hasFuel || score < (activeCurse === 'ters_market' || activeCurse === 'final_3' ? Math.round(fuelCost * 1.5) : fuelCost)} variant={upgrades.hasFuel ? "outline" : "default"} className="flex flex-col h-auto p-2 gap-1 bg-red-500 hover:bg-red-600 text-white">
                      <Fuel className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Buy Fuel (${activeCurse === 'ters_market' || activeCurse === 'final_3' ? Math.round(fuelCost * 1.5) : fuelCost})</span>
                    </Button>
                    <Button onClick={() => repairHook(1, 60)} disabled={hookAttempts >= maxHookAttempts || score < 60} variant="default" className="flex flex-col h-auto p-2 gap-1 bg-amber-500 hover:bg-amber-600 text-white">
                      <Anchor className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Repair +1 (60🪙)</span>
                    </Button>
                    <Button onClick={upgradeRod} disabled={upgrades.rodLevel >= 3 || score < (upgrades.rodLevel === 1 ? 200 : 440)} className="flex flex-col h-auto p-2 gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Rod Lv{upgrades.rodLevel + 1} (${upgrades.rodLevel === 1 ? 200 : 440})</span>
                    </Button>
                    <Button onClick={upgradeBoat} disabled={upgrades.boatLevel >= 3 || score < (upgrades.boatLevel === 1 ? 360 : 760)} className="flex flex-col h-auto p-2 gap-1 bg-purple-500 hover:bg-purple-600 text-white">
                      <Anchor className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Boat Lv{upgrades.boatLevel + 1} (${upgrades.boatLevel === 1 ? 360 : 760})</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleNextLevel}
              disabled={!upgrades.hasFuel}
              className={`mt-auto w-full py-6 text-xl font-display font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 ${upgrades.hasFuel ? 'animate-pulse ring-4 ring-blue-300' : ''}`}
            >
              {upgrades.hasFuel ? `Set Sail for Level ${currentLevel}!` : "Buy Fuel to Continue"}
            </Button>
          </div>
        )}

        {gameState === "gameover" && <GameOverModal score={score} island={currentLevel} reason={gameOverReason ?? undefined} onRetry={() => window.location.reload()} />}
        {gameState === "win" && (
          <div className="absolute inset-0 bg-green-700/90 z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <h2 className="text-5xl font-display font-bold text-white mb-4 uppercase tracking-tighter">You Won</h2>
            <p className="text-white text-lg mb-8 opacity-90 font-medium">You reached all islands. It was a legendary journey!</p>
            <Button onClick={() => window.location.reload()} className="w-full py-8 text-2xl bg-white text-green-700 hover:bg-slate-100 font-display font-bold shadow-xl rounded-2xl">RESTART</Button>
          </div>
        )}

        {/* Pause Menu Overlay */}
        {isPaused && !selectedEntityForInfo && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center animate-in fade-in duration-300 px-8">
            <div className="bg-white rounded-[32px] w-full max-w-xs p-8 shadow-2xl flex flex-col gap-4 border-4 border-white">
              <h2 className="text-3xl font-display font-bold text-slate-800 text-center mb-4">PAUSED</h2>

              <Button
                onClick={togglePause}
                className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 rounded-2xl flex items-center justify-center gap-3"
              >
                <Play className="w-5 h-5 fill-current" />
                Resume
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full py-6 text-lg font-bold border-2 border-slate-100 text-slate-600 hover:bg-slate-50 rounded-2xl flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Restart
              </Button>

              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full py-6 text-lg font-bold text-slate-400 hover:text-slate-600 hover:bg-transparent rounded-2xl flex items-center justify-center gap-3"
                >
                  <HomeIcon className="w-5 h-5" />
                  Main Menu
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Info Card Overlay */}
        {selectedEntityForInfo && (
          <div className="z-[110]">
            <InfoCard
              entityKey={selectedEntityForInfo}
              onClose={() => setSelectedEntityForInfo(null)}
            />
          </div>
        )}

        {purchaseBoosterType && (
          <BoosterPurchaseModal
            isOpen={purchaseModalOpen}
            onClose={() => {
              setPurchaseModalOpen(false);
              if (engineRef.current) {
                engineRef.current.resume();
                setIsPaused(false);
              }
            }}
            boosterType={purchaseBoosterType}
            onPurchase={handlePurchase}
          />
        )}

        {/* Back Link at bottom (only in playing) */}
        {!isPaused && gameState === "playing" && (
          <Link href="/" className="absolute bottom-6 left-6 z-30 p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors">
            <ArrowLeft className="text-white w-6 h-6" />
          </Link>
        )}
      </div>
    </div>
  );
}
