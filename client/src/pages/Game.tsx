import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Clock, DollarSign, Fuel, ShoppingBag, Zap, Anchor } from "lucide-react";
import { GameEngine, CANVAS_WIDTH, CANVAS_HEIGHT, SEA_LEVEL_Y, LEVEL_CONFIG } from "@/game/GameEngine";
import { GameState, InventoryItem, Entity } from "@/game/types";
import { GameOverModal } from "@/components/GameOverModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [gameState, setGameState] = useState<"playing" | "gameover" | "shop" | "win">("playing");

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(LEVEL_CONFIG[1].duration);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [fuelCost, setFuelCost] = useState<number>(LEVEL_CONFIG[1].fuelCost);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [currentStorage, setCurrentStorage] = useState(0);
  const [buoyancyOffset, setBuoyancyOffset] = useState(0);
  const [weightDisplayOffset, setWeightDisplayOffset] = useState(0);
  const [hookAttempts, setHookAttempts] = useState(3);
  const [maxHookAttempts, setMaxHookAttempts] = useState(3);
  const [caughtFish, setCaughtFish] = useState<Entity | null>(null);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [upgrades, setUpgrades] = useState({
    rodLevel: 1,
    boatLevel: 1,
    hasFuel: false,
    storageCapacity: 60, // game_design Bölüm 7.1: Başlangıç (Lv1) = 60kg
  });
  const [activeBoosters, setActiveBoosters] = useState({
    speed: false,
    lucky: false,
    value: false,
  });

  useEffect(() => {
    if (!canvasRef.current || gameState !== "playing") return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const levelConfig = LEVEL_CONFIG[currentLevel as keyof typeof LEVEL_CONFIG];
    const initialState: GameState = {
      score,
      level: currentLevel,
      region: Math.ceil(currentLevel / 4), // Bölge = her 4 level'de bir (1-5)
      fuelCost: levelConfig?.fuelCost ?? fuelCost,
      timeRemaining: levelConfig?.duration ?? 60,
      isPlaying: true,
      weather: "sunny",
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
      upgrades,
      currentStorage,
      hookAttempts,
      maxHookAttempts,
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
      boosters: activeBoosters,
    };

    const engine = new GameEngine(ctx, initialState, {
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
          setBuoyancyOffset(state.buoyancyOffset || 0);
          setWeightDisplayOffset(state.weightDisplayOffset || 0);
          setHookAttempts(state.hookAttempts || 0);
          setMaxHookAttempts(state.maxHookAttempts || 0);
          setFuelCost(state.fuelCost || fuelCost);

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
        // Doğru çözüm: Yeni levele geçerken engine içerisindeki booster'lar da temizlenmeli.
        const resetBoosters = { speed: false, lucky: false, value: false };
        setActiveBoosters(resetBoosters);
        if (engineRef.current) {
          engineRef.current.getState().boosters = resetBoosters;
        }

        // game_design: Bölge 5 sonunda (Level 20) win ekranı açılır
        if (level >= 20) {
          setGameState("win");
          confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
          return;
        }
        setGameState("shop");
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      },
      onFishCaught: (fish) => {
        setCaughtFish(fish);
        // Auto-hide after 2 seconds
        setTimeout(() => setCaughtFish(null), 2000);
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
        setHookAttempts(state.hookAttempts || 0);
        setMaxHookAttempts(state.maxHookAttempts || 0);
        setFuelCost(state.fuelCost || fuelCost);

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

  const handleSellAll = () => {
    const totalValue = inventory.reduce((sum, item) => sum + item.value, 0);
    const newScore = score + totalValue;
    setScore(newScore);
    setInventory([]);
    if (engineRef.current) {
      // @ts-ignore
      engineRef.current.state.inventory = [];
      // @ts-ignore
      engineRef.current.state.score = newScore;
      // @ts-ignore
      engineRef.current.state.currentStorage = 0;
      // @ts-ignore
      engineRef.current.state.buoyancyOffset = 0;
      // @ts-ignore
      if (engineRef.current.onScoreUpdate) {
        // @ts-ignore
        engineRef.current.onScoreUpdate(newScore);
      }
      // @ts-ignore
      engineRef.current.recalculateStorage();
    }
  };

  const buyFuel = () => {
    if (score >= fuelCost && !upgrades.hasFuel) {
      const newScore = score - fuelCost;
      setScore(newScore);
      setUpgrades(prev => ({ ...prev, hasFuel: true }));
      if (engineRef.current) {
        // @ts-ignore
        engineRef.current.state.score = newScore;
        // @ts-ignore
        engineRef.current.state.upgrades.hasFuel = true;
      }
    }
  };

  const upgradeRod = () => {
    if (upgrades.rodLevel >= 3) return;
    const cost = upgrades.rodLevel === 1 ? 100 : 220;
    if (score >= cost) {
      const newScore = score - cost;
      const newRodLevel = upgrades.rodLevel + 1;
      const newMaxAttempts = newRodLevel === 2 ? 4 : 5;
      setScore(newScore);
      setUpgrades(prev => ({ ...prev, rodLevel: newRodLevel }));
      setMaxHookAttempts(newMaxAttempts);
      setHookAttempts(newMaxAttempts);
      if (engineRef.current) {
        // @ts-ignore
        engineRef.current.state.score = newScore;
        // @ts-ignore
        engineRef.current.state.upgrades.rodLevel = newRodLevel;
        // @ts-ignore
        engineRef.current.state.maxHookAttempts = newMaxAttempts;
        // @ts-ignore
        engineRef.current.state.hookAttempts = newMaxAttempts;
      }
    }
  };

  const upgradeBoat = () => {
    if (upgrades.boatLevel >= 3) return;
    const cost = upgrades.boatLevel === 1 ? 180 : 380;
    if (score >= cost) {
      const newScore = score - cost;
      const newBoatLevel = upgrades.boatLevel + 1;
      const newCapacity = newBoatLevel === 2 ? 90 : 130;

      setScore(newScore);
      setUpgrades(prev => ({
        ...prev,
        boatLevel: newBoatLevel,
        storageCapacity: newCapacity
      }));
      if (engineRef.current) {
        // @ts-ignore
        engineRef.current.state.score = newScore;
        // @ts-ignore
        engineRef.current.state.upgrades.boatLevel = newBoatLevel;
        // @ts-ignore
        engineRef.current.state.upgrades.storageCapacity = newCapacity;
      }
    }
  };

  const repairHook = (amount: number, cost: number) => {
    if (hookAttempts >= maxHookAttempts || score < cost) return;
    const newScore = score - cost;
    const newAttempts = Math.min(maxHookAttempts, hookAttempts + amount);
    setScore(newScore);
    setHookAttempts(newAttempts);
    if (engineRef.current) {
      // @ts-ignore
      engineRef.current.state.score = newScore;
      // @ts-ignore
      engineRef.current.state.hookAttempts = newAttempts;
    }
  };

  const repairHookFull = () => {
    const cost = 80;
    if (hookAttempts >= maxHookAttempts || score < cost) return;
    const newScore = score - cost;
    setScore(newScore);
    setHookAttempts(maxHookAttempts);
    if (engineRef.current) {
      // @ts-ignore
      engineRef.current.state.score = newScore;
      // @ts-ignore
      engineRef.current.state.hookAttempts = maxHookAttempts;
    }
  };

  const buyBooster = (type: keyof typeof activeBoosters, cost: number) => {
    if (activeBoosters[type] || score < cost) return;
    const newScore = score - cost;
    setScore(newScore);
    setActiveBoosters(prev => ({ ...prev, [type]: true }));
    if (engineRef.current) {
      // Doğrudan engine state'ini mutate et, böylece GameEngine anında efekti uygular
      engineRef.current.getState().score = newScore;
      engineRef.current.getState().boosters = {
        ...engineRef.current.getState().boosters,
        [type]: true
      };
    }
  };

  const handleNextLevel = () => {
    if (!upgrades.hasFuel) return;
    if (currentLevel >= 20) return;
    setCurrentLevel(prev => {
      const nextLevel = prev + 1;
      const config = LEVEL_CONFIG[nextLevel as keyof typeof LEVEL_CONFIG];
      setFuelCost(config?.fuelCost ?? fuelCost);
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
  const storageRatio = (totalWeight / upgrades.storageCapacity) || 0;
  const storagePercent = Math.min(100, storageRatio * 100);
  const storageColor = storageRatio >= 1 ? 'bg-red-500' : storageRatio >= 0.96 ? 'bg-red-500' : storageRatio >= 0.81 ? 'bg-orange-500' : storageRatio >= 0.61 ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <div className="relative w-full h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full max-w-[450px] max-h-[800px] bg-sky-100 shadow-2xl overflow-hidden md:rounded-[32px] md:border-8 md:border-slate-800">

        {/* Playable Area */}
        {gameState === "playing" && (
          <>
            <div className="absolute top-0 left-0 right-0 p-4 z-10 flex justify-between items-start pointer-events-none">
              <div className="bg-[#99E5FF] border-2 border-white rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2">
                <Clock className="w-5 h-5 text-white fill-[#FFB347]" />
                <span className="text-xl font-display font-bold text-white">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {/* Storage Bar */}
                <div className="bg-white/90 backdrop-blur-sm border-2 border-white rounded-xl p-2 shadow-md w-32 flex flex-col gap-1 transition-all">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1"><Anchor className="w-3 h-3" /> Depo</span>
                    <span className={`${storageRatio >= 0.96 ? 'text-red-500 animate-pulse' : storageRatio >= 0.81 ? 'text-orange-500' : storageRatio >= 0.61 ? 'text-yellow-600' : 'text-slate-500'}`}>
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
                  <span>Olta</span>
                  <span className={`${hookAttempts === 0 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>{hookAttempts} / {maxHookAttempts}</span>
                </div>
              </div>
            </div>
            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onClick={() => engineRef.current?.handleInput()} className="w-full h-full block touch-none" />

            {caughtFish && (
              <div className="absolute left-4 z-50 pointer-events-none" style={{ top: SEA_LEVEL_Y - 140 }}>
                <div className="bg-white/50 backdrop-blur-md p-3 rounded-2xl shadow-[0_12px_24px_rgba(0,0,0,0.08)] border-2 border-white/50 flex flex-col items-center text-center animate-in zoom-in-50 duration-300 w-36">
                  <div className="w-24 h-16 mb-2 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full opacity-25 blur-lg scale-90 animate-pulse"></div>
                    <img
                      src={['coral', 'treasure_chest', 'whirlpool', 'sunken_boat', 'shark_skeleton', 'env_bubbles', 'anchor', 'shell', 'sea_kelp', 'sea_rock'].includes(caughtFish.type) ? `/assets/environment/${caughtFish.type === 'env_bubbles' ? 'bubbles' : caughtFish.type}.png` : `/assets/fish/${caughtFish.type}_fish.png`}
                      alt={caughtFish.name}
                      className="w-full h-full object-contain drop-shadow-md relative z-10"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <h2 className="text-sm font-display font-bold text-slate-800">{caughtFish.name}</h2>
                </div>
              </div>
            )}
          </>
        )}

        {/* Shop UI */}
        {gameState === "shop" && (
          <div className="absolute inset-0 bg-white/95 z-20 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="text-center">
              <h2 className="text-3xl font-display font-bold text-blue-600">Level {currentLevel} Tamamlandı!</h2>
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                <DollarSign className="w-6 h-6" /> {score}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Inventory */}
              <Card className="bg-slate-50 border-2">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1"><Anchor className="w-4 h-4" /> Envanter</CardTitle>
                </CardHeader>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1">
                    {inventory.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Boş</span>
                    ) : (
                      inventory.map((item, idx) => (
                        <div key={idx} className="text-xs flex justify-between p-1 bg-white rounded border">
                          <span>{item.name}</span>
                          <span className="text-green-600 font-bold">${item.value}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <Button onClick={handleSellAll} disabled={inventory.length === 0} className="w-full h-8 text-xs bg-green-500 hover:bg-green-600">Hepsini Sat</Button>
                </CardContent>
              </Card>

              {/* Shop */}
              <Card className="bg-slate-50 border-2">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> Market</CardTitle>
                </CardHeader>
                <CardContent className="p-3 flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Button onClick={buyFuel} disabled={upgrades.hasFuel || score < fuelCost} variant={upgrades.hasFuel ? "outline" : "default"} className="flex flex-col h-auto p-2 gap-1 bg-red-500 hover:bg-red-600 text-white">
                      <Fuel className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Yakıt Al (${fuelCost})</span>
                      {upgrades.hasFuel && <span className="text-[8px] text-white font-bold">HAZIR</span>}
                    </Button>
                    <Button onClick={() => repairHook(1, 30)} disabled={hookAttempts >= maxHookAttempts || score < 30} variant="default" className="flex flex-col h-auto p-2 gap-1 bg-amber-500 hover:bg-amber-600 text-white">
                      <Anchor className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Olta Tamiri +1 (30🪙)</span>
                      <span className="text-[8px] opacity-70">{hookAttempts}/{maxHookAttempts}</span>
                    </Button>
                    <Button onClick={repairHookFull} disabled={hookAttempts >= maxHookAttempts || score < 80} variant="default" className="flex flex-col h-auto p-2 gap-1 bg-amber-700 hover:bg-amber-800 text-white">
                      <Anchor className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Olta Tamiri Full (80🪙)</span>
                      <span className="text-[8px] opacity-70">{hookAttempts}/{maxHookAttempts}</span>
                    </Button>
                    <Button onClick={upgradeRod} disabled={upgrades.rodLevel >= 3 || score < (upgrades.rodLevel === 1 ? 100 : 220)} className="flex flex-col h-auto p-2 gap-1 bg-blue-500 hover:bg-blue-600 text-white">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Olta Lv{upgrades.rodLevel + 1} ({upgrades.rodLevel === 1 ? 100 : 220}🪙)</span>
                      <span className="text-[8px] opacity-70">Lv.{upgrades.rodLevel}</span>
                    </Button>
                    <Button onClick={upgradeBoat} disabled={upgrades.boatLevel >= 3 || score < (upgrades.boatLevel === 1 ? 180 : 380)} className="flex flex-col h-auto p-2 gap-1 bg-purple-500 hover:bg-purple-600 text-white">
                      <Anchor className="w-4 h-4" />
                      <span className="text-[10px] leading-tight">Tekne Lv{upgrades.boatLevel + 1} ({upgrades.boatLevel === 1 ? 180 : 380}🪙)</span>
                      <span className="text-[8px] opacity-70">Lv.{upgrades.boatLevel}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Booster Shop */}
              <Card className="bg-slate-50 border-2 col-span-2">
                <CardHeader className="p-3">
                  <CardTitle className="text-sm flex items-center gap-1"><Zap className="w-4 h-4 text-amber-500" /> Takviyeler (Booster)</CardTitle>
                </CardHeader>
                <CardContent className="p-3 grid grid-cols-3 gap-3">
                  <Button
                    onClick={() => buyBooster('speed', 40)}
                    disabled={activeBoosters.speed || score < 40}
                    className={`flex flex-col h-auto p-2 gap-1 ${activeBoosters.speed ? 'bg-slate-200 text-slate-500' : 'bg-orange-400 hover:bg-orange-500 text-white'}`}
                  >
                    <Zap className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Hızlı Çekim</span>
                    <span className="text-[9px]">40🪙</span>
                    {activeBoosters.speed && <span className="text-[8px] font-bold">AKTİF</span>}
                  </Button>
                  <Button
                    onClick={() => buyBooster('lucky', 60)}
                    disabled={activeBoosters.lucky || score < 60}
                    className={`flex flex-col h-auto p-2 gap-1 ${activeBoosters.lucky ? 'bg-slate-200 text-slate-500' : 'bg-blue-400 hover:bg-blue-500 text-white'}`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Şanslı Yem</span>
                    <span className="text-[9px]">60🪙</span>
                    {activeBoosters.lucky && <span className="text-[8px] font-bold">AKTİF</span>}
                  </Button>
                  <Button
                    onClick={() => buyBooster('value', 80)}
                    disabled={activeBoosters.value || score < 80}
                    className={`flex flex-col h-auto p-2 gap-1 ${activeBoosters.value ? 'bg-slate-200 text-slate-500' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span className="text-[10px] font-bold">Değerli Av</span>
                    <span className="text-[9px]">80🪙</span>
                    {activeBoosters.value && <span className="text-[8px] font-bold">AKTİF</span>}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleNextLevel}
              disabled={!upgrades.hasFuel}
              className={`mt-auto w-full py-6 text-xl font-display font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 ${upgrades.hasFuel ? 'animate-pulse ring-4 ring-blue-300' : ''}`}
            >
              {upgrades.hasFuel ? `Level ${currentLevel + 1} için Yelken Aç!` : (score < fuelCost ? `Yakıt için ${fuelCost}🪙 Gerekli!` : "Devam Etmek için Yakıt Al")}
            </Button>

            {/* Game Over Overlay inside Shop if out of money */}
            {score < fuelCost && !upgrades.hasFuel && inventory.length === 0 && (
              <div className="absolute inset-0 bg-red-600/95 z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-[3000ms] delay-[2500ms] fill-mode-both">
                <h2 className="text-5xl font-display font-bold text-white mb-4 uppercase tracking-tighter">Oyun Bitti</h2>
                <p className="text-white text-lg mb-8 opacity-90 font-medium">
                  Yakıt için para yetmedi! Bir sonraki adaya geçilemez.
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full py-8 text-2xl bg-white text-red-600 hover:bg-slate-100 font-display font-bold shadow-xl rounded-2xl transition-transform active:scale-95"
                >
                  TEKRAR DENE
                </Button>
              </div>
            )}
          </div>
        )}

        {gameState === "gameover" && <GameOverModal score={score} island={currentLevel} reason={gameOverReason ?? undefined} onRetry={() => window.location.reload()} />}
        {gameState === "win" && (
          <div className="absolute inset-0 bg-green-700/90 z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
            <h2 className="text-5xl font-display font-bold text-white mb-4 uppercase tracking-tighter">Kazandın</h2>
            <p className="text-white text-lg mb-8 opacity-90 font-medium">
              Tüm adalara ulaştın. Efsane bir yolculuktu!
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full py-8 text-2xl bg-white text-green-700 hover:bg-slate-100 font-display font-bold shadow-xl rounded-2xl transition-transform active:scale-95"
            >
              YENİDEN BAŞLA
            </Button>
          </div>
        )}

        <Link href="/" className="absolute bottom-6 left-6 z-30 p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors">
          <ArrowLeft className="text-white w-6 h-6" />
        </Link>
      </div>
    </div>
  );
}
