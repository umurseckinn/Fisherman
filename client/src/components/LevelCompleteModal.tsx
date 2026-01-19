import { motion } from "framer-motion";
import { Fuel, ArrowRight } from "lucide-react";

interface LevelCompleteModalProps {
  score: number;
  island: number;
  nextFuelCost: number;
  onNextLevel: () => void;
}

export function LevelCompleteModal({ score, island, nextFuelCost, onNextLevel }: LevelCompleteModalProps) {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-secondary/20"
      >
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <span className="text-4xl">🏝️</span>
        </div>
        
        <h2 className="text-3xl font-display font-bold text-foreground mb-2">Island Clear!</h2>
        <p className="text-muted-foreground mb-6">
          Refueling for the next trip...
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
            <span className="text-muted-foreground">Current Cash</span>
            <span className="font-mono font-bold text-xl text-green-600">${score}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <Fuel className="w-5 h-5" /> Fuel Cost
            </div>
            <span className="font-mono font-bold text-xl text-red-600">-${nextFuelCost}</span>
          </div>
          <div className="h-px bg-border my-2" />
          <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-xl border border-secondary/20">
            <span className="font-bold text-secondary-foreground">Remaining</span>
            <span className="font-mono font-bold text-2xl text-secondary-foreground">
              ${score - nextFuelCost}
            </span>
          </div>
        </div>

        <button 
          onClick={onNextLevel}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-yellow-500 text-secondary-foreground py-4 px-6 rounded-xl font-bold shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          Travel to Island {island + 1}
          <ArrowRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
