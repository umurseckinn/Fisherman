import { motion } from "framer-motion";
import { RefreshCcw, Trophy, Home } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { useSubmitScore } from "@/hooks/use-high-scores";

interface GameOverModalProps {
  score: number;
  island: number;
  onRetry: () => void;
}

export function GameOverModal({ score, island, onRetry }: GameOverModalProps) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const submitScore = useSubmitScore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await submitScore.mutateAsync({
      playerName: name,
      score: score,
      maxIslandReached: island
    });
    setSubmitted(true);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-destructive/20"
      >
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">⚓️</span>
        </div>
        
        <h2 className="text-3xl font-display font-bold text-destructive mb-2">Out of Fuel!</h2>
        <p className="text-muted-foreground mb-6">
          You made it to <span className="font-bold text-foreground">Island {island}</span>
        </p>

        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <div className="text-sm text-muted-foreground uppercase tracking-wider font-bold mb-1">Final Score</div>
          <div className="text-4xl font-mono font-bold text-primary">${score}</div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <label className="block text-left text-sm font-bold text-gray-700 mb-2">Save High Score</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter Name"
                className="flex-1 px-4 py-2 rounded-xl border-2 border-border focus:border-primary focus:outline-none"
                maxLength={10}
              />
              <button 
                type="submit"
                disabled={submitScore.isPending || !name}
                className="bg-accent text-white px-4 py-2 rounded-xl font-bold hover:bg-accent/90 disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-6 font-bold flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" /> Score Saved!
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            <RefreshCcw className="w-5 h-5" />
            Retry
          </button>
          
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 bg-muted text-foreground py-3 px-4 rounded-xl font-bold hover:bg-muted/80 transition-colors"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
