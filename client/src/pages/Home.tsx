import { Link } from "wouter";
import { Play, Trophy, Anchor } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4 relative overflow-hidden">
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
          Island <br/> <span className="text-primary">Hopper</span>
        </h1>
        
        <p className="text-muted-foreground font-medium mb-10 max-w-[240px]">
          Catch fish, earn cash, and fuel your journey across the endless sea!
        </p>

        {/* Buttons */}
        <div className="w-full space-y-4">
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
          v1.0.0 • Made with ❤️
        </div>
      </div>
    </div>
  );
}
