import { Play, Trophy, Anchor } from "lucide-react";
import { useState } from "react";
import { InfoCard } from "../components/InfoCard";
import { FishClass } from "../game/types";
import { Link } from "wouter";

export default function Home() {
  const [selectedEntity, setSelectedEntity] = useState<FishClass | null>(null);

  const handleCardClick = (type: FishClass) => {
    setSelectedEntity(type);
  };

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-50" />

      {/* Main Card */}
      <div className="max-w-sm w-full bg-white/80 backdrop-blur-md rounded-[40px] shadow-2xl p-8 border-4 border-white relative z-10 flex flex-col items-center text-center">

        {/* Logo / Icon Area */}
        <div className="w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
          <Anchor className="w-16 h-16 text-white" />
        </div>

        <h1 className="text-5xl font-display font-bold text-foreground mb-2 text-shadow">
          Fisherman's <br /> <span className="text-primary">Journey</span>
        </h1>

        <p className="text-muted-foreground font-medium mb-10 max-w-[240px]">
          Catch fish, earn cash, and fuel your journey across the endless sea!
        </p>

        <div className="mt-4 w-full">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">

            {/* Bubble Fish Card */}
            <div
              onClick={() => handleCardClick('bubble')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#E8F4FD] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/bubble_fish.png"
                  alt="Bubble Fish"
                  className="w-[96px] h-[72px] object-contain hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Bubble Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">15 🪙</span>
            </div>

            {/* Sakura Fish Card */}
            <div
              onClick={() => handleCardClick('sakura')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FDF0F5] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/sakura_fish.png"
                  alt="Sakura Fish"
                  className="w-[104px] h-[80px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Sakura Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">25 🪙</span>
            </div>

            {/* Zap Fish Card */}
            <div
              onClick={() => handleCardClick('zap')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FFF6C7] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/zap_fish.png"
                  alt="Zap Fish"
                  className="w-[96px] h-[72px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Zap Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">40 🪙</span>
            </div>

            {/* Candy Fish Card */}
            <div
              onClick={() => handleCardClick('candy')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FFE5EE] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/candy_fish.png"
                  alt="Candy Fish"
                  className="w-[96px] h-[72px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Candy Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">55 🪙</span>
            </div>

            {/* Moon Fish Card */}
            <div
              onClick={() => handleCardClick('moon')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#EEF2FF] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/moon_fish.png"
                  alt="Moon Fish"
                  className="w-[96px] h-[72px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Moon Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">80 🪙</span>
            </div>

            {/* Lava Fish Card */}
            <div
              onClick={() => handleCardClick('lava')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FFE3D6] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/lava_fish.png"
                  alt="Lava Fish"
                  className="w-[96px] h-[72px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Lava Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">110 🪙</span>
            </div>

            {/* Crystal Fish Card */}
            <div
              onClick={() => handleCardClick('crystal')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#EEE8FF] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/crystal_fish.png"
                  alt="Crystal Fish"
                  className="w-[96px] h-[72px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Crystal Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">300 🪙</span>
            </div>

            {/* Leaf Fish Card */}
            <div
              onClick={() => handleCardClick('leaf')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FFE9D6] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/leaf_fish.png"
                  alt="Leaf Fish"
                  className="w-[96px] h-[72px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Leaf Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">200 🪙</span>
            </div>

            {/* Tide Fish Card */}
            <div
              onClick={() => handleCardClick('tide')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#E6F4FF] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/fish/tide_fish.png"
                  alt="Tide Fish"
                  className="w-[96px] h-[72px] object-contain group-hover:rotate-3 group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Tide Fish</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">150 🪙</span>
            </div>

            {/* Coral Reef Card (Danger) */}
            <div
              onClick={() => handleCardClick('coral')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FFF3E0] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm border border-[#FF5252] snap-center"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/environment/coral.png"
                  alt="Coral Reef"
                  className="w-[128px] h-[92px] object-contain"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Coral Reef</span>
              <span className="text-[10px] font-bold text-[#FF5252] bg-white/50 px-2 py-1 rounded-full mt-1 flex items-center gap-1">
                Snaps hook! ❌
              </span>
            </div>

            {/* Treasure Chest Card */}
            <div
              onClick={() => handleCardClick('treasure_chest')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FFF8E1] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/environment/treasure_chest.png"
                  alt="Treasure Chest"
                  className="w-[96px] h-[72px] object-contain group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Treasure Chest</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">500 🪙</span>
            </div>

            {/* Whirlpool Card */}
            <div
              onClick={() => handleCardClick('whirlpool')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#E1F5FE] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm border border-[#FF5252] snap-center"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/environment/whirlpool.png"
                  alt="Whirlpool"
                  className="w-[96px] h-[72px] object-contain"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Whirlpool</span>
              <span className="text-[10px] font-bold text-[#FF5252] bg-white/50 px-2 py-1 rounded-full mt-1 flex items-center gap-1">
                Danger! ❌
              </span>
            </div>

            {/* Sunken Boat Card */}
            <div
              onClick={() => handleCardClick('sunken_boat')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#EFEBE9] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm border border-[#FF5252] snap-center"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/environment/sunken_boat.png"
                  alt="Sunken Boat"
                  className="w-[96px] h-[72px] object-contain"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Sunken Boat</span>
              <span className="text-[10px] font-bold text-[#FF5252] bg-white/50 px-2 py-1 rounded-full mt-1 flex items-center gap-1">
                Obstacle ❌
              </span>
            </div>

            {/* Shark Skeleton Card */}
            <div
              onClick={() => handleCardClick('shark_skeleton')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FAFAFA] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/environment/shark_skeleton.png"
                  alt="Shark Skeleton"
                  className="w-[96px] h-[72px] object-contain group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Shark Skeleton</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">0 🪙</span>
            </div>

            {/* Anchor Card */}
            <div
              onClick={() => handleCardClick('anchor')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#ECEFF1] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/environment/anchor.png"
                  alt="Anchor"
                  className="w-[96px] h-[72px] object-contain group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Rusty Anchor</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">150 🪙</span>
            </div>

            {/* Shell Card */}
            <div
              onClick={() => handleCardClick('shell')}
              className="cursor-pointer flex-shrink-0 w-[120px] bg-[#FFF3E0] rounded-[16px] p-3 pt-4 flex flex-col items-center shadow-sm hover:scale-105 transition-transform duration-150 snap-center group"
            >
              <div className="w-[80px] h-[80px] flex items-center justify-center mb-2 relative">
                <img
                  src="/assets/environment/shell.png"
                  alt="Shell"
                  className="w-[96px] h-[72px] object-contain group-hover:scale-110 transition-all duration-300"
                />
              </div>
              <span className="text-sm font-bold text-slate-700">Sea Shell</span>
              <span className="text-xs font-bold text-primary bg-white/50 px-2 py-1 rounded-full mt-1">25 🪙</span>
            </div>

          </div>
        </div>

        <div className="w-full space-y-4 mt-8">
          <Link href="/game">
            <button className="w-full group relative overflow-hidden bg-primary text-white p-4 rounded-2xl font-bold text-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center justify-center gap-3">
                <Play className="w-6 h-6 fill-current" />
                START FISHING
              </div>
            </button>
          </Link>

          <Link href="/leaderboard">
            <button className="w-full flex items-center justify-center gap-3 bg-white text-slate-600 border-2 border-slate-100 p-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-200 transition-all">
              <Trophy className="w-5 h-5" />
              Leaderboard
            </button>
          </Link>
        </div>

        <div className="mt-8 text-xs text-slate-400 font-mono">
          v1.0.1 • Made for you
        </div>
      </div>

      {selectedEntity && (
        <InfoCard
          entityKey={selectedEntity}
          onClose={() => setSelectedEntity(null)}
        />
      )}
    </div>
  );
}
