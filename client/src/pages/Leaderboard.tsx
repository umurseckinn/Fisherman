import { useHighScores } from "@/hooks/use-high-scores";
import { Link } from "wouter";
import { ArrowLeft, Trophy, Crown, Medal } from "lucide-react";

export default function Leaderboard() {
  const { data: scores, isLoading } = useHighScores();

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[32px] shadow-2xl overflow-hidden border-4 border-white">
        
        {/* Header */}
        <div className="bg-primary p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Trophy className="w-48 h-48" />
          </div>
          
          <div className="relative z-10">
            <Link href="/">
              <button className="mb-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
            </Link>
            <h1 className="text-4xl font-display mb-2">Hall of Fame</h1>
            <p className="text-primary-foreground/80 font-medium">Top legendary fishermen</p>
          </div>
        </div>

        {/* List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading scores...</p>
            </div>
          ) : scores?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No scores yet. Be the first!
            </div>
          ) : (
            <div className="space-y-3">
              {scores?.map((score, index) => (
                <div 
                  key={score.id}
                  className={`
                    flex items-center gap-4 p-4 rounded-2xl transition-all hover:scale-[1.02]
                    ${index === 0 ? 'bg-yellow-50 border-2 border-yellow-200 shadow-yellow-100' : 
                      index === 1 ? 'bg-gray-50 border-2 border-gray-200' :
                      index === 2 ? 'bg-orange-50 border-2 border-orange-200' : 'bg-white border border-gray-100'}
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                      index === 1 ? 'bg-gray-300 text-gray-800' :
                      index === 2 ? 'bg-orange-300 text-orange-900' : 'bg-gray-100 text-gray-500'}
                  `}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-foreground truncate">{score.playerName}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3" /> Island {score.maxIslandReached}
                    </div>
                  </div>

                  <div className="font-mono font-bold text-xl text-primary">
                    ${score.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
