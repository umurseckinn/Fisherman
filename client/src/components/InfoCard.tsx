import React from 'react';
import { X, Coins, Weight, Zap, Info } from 'lucide-react';
import { FishClass, OBJECT_MATRIX } from '../game/types';

interface InfoCardProps {
    entityKey: FishClass;
    onClose: () => void;
}

const ENTITY_DETAILS: Record<string, { description: string; effect?: string }> = {
    bubble: {
        description: "A very common surface fish. Small and light.",
        effect: "Harmless."
    },
    sakura: {
        description: "Common pink fish found in shallow waters.",
        effect: "Leaves a trail of petals."
    },
    zap: {
        description: "Fast and energetic fish. Hard to catch.",
        effect: "Shocks the boat for 3s, causing 50% chance for other fish to escape."
    },
    candy: {
        description: "Sweet and colorful fish found in middle depths.",
        effect: "Reduces boat weight by 1 (max 3 times)."
    },
    moon: {
        description: "Mystical fish that glows at night.",
        effect: "Slows down all other fish by 40% for 10s."
    },
    lava: {
        description: "Hot fish from the deep. dangerous weight.",
        effect: "Causes 'burning' which adds +1 weight per second for 5s."
    },
    tide: {
        description: "Extremely fast torpedo-like fish.",
        effect: "Shakes the boat, 20% chance to drop a random item."
    },
    leaf: {
        description: "Lightest fish in the ocean. Very rare.",
        effect: "Permanently increases market value of all fish by 10% (max 30%)."
    },
    crystal: {
        description: "Heavy crystal fish with unpredictable value.",
        effect: "Randomly changes value upon catch (+50, 0, or -30 coins)."
    },
    galaxy: {
        description: "Warp-capable fish that teleports briefly.",
        effect: "Grants a random bonus: +100 coins or +10% fuel."
    },
    mushroom: {
        description: "Fungal deep sea fish with magic spores.",
        effect: "Doubles the market value of a random fish in inventory."
    },
    king: {
        description: "The rarest and heaviest legendary fish.",
        effect: "Panics all small fish. Increases market values by 20% if caught."
    },
    coral: {
        description: "Fragile but sharp coral reef.",
        effect: "Breaks one fishing hook attempt! ❌"
    },
    sea_kelp: {
        description: "Sticky sea weeds found on the floor.",
        effect: "Snags the hook for 0.8s but causes no damage."
    },
    sea_rock: {
        description: "Hard obstacle found at various depths.",
        effect: "Causes hook to bounce back instantly."
    },
    gold_doubloon: {
        description: "A shiny sunken coin. Floats randomly.",
        effect: "Adds +10 kg weight but grants high level-scaled gold. Can sink the boat!"
    },
    whirlpool: {
        description: "Dangerous vortex that sucks everything in.",
        effect: "Sinks the boat if hook is caught too long! ❌"
    },
    sunken_boat: {
        description: "Old wreckage blocking the way.",
        effect: "Solid obstacle and very heavy (15 units). Avoid hitting it."
    },
    shark_skeleton: {
        description: "Bony remains of a deep sea predator.",
        effect: "Worthless and adds unwanted weight (4 units). Penalty: -10 coins."
    },
    anchor: {
        description: "Heavy rusty anchor found on the seabed.",
        effect: "High market value (200 coins) but very heavy (10 units)."
    },
    shell: {
        description: "Pretty sea shell with surprises inside.",
        effect: "Gives +20 coins. Size similar to Sakura Fish."
    }
};

export const InfoCard: React.FC<InfoCardProps> = ({ entityKey, onClose }) => {
    const config = OBJECT_MATRIX[entityKey];
    const details = ENTITY_DETAILS[entityKey] || { description: "Unseen deep sea entity.", effect: "Unknown." };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl p-8 border-4 border-white overflow-hidden flex flex-col items-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Image Area */}
                <div className="w-40 h-40 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-slate-100">
                    <img
                        src={`/assets/${entityKey === 'coral' || entityKey === 'sea_kelp' || entityKey === 'sea_rock' || entityKey === 'gold_doubloon' || entityKey === 'whirlpool' || entityKey === 'sunken_boat' || entityKey === 'shark_skeleton' || entityKey === 'anchor' || entityKey === 'shell' ? 'environment' : 'fish'}/${entityKey}${entityKey === 'env_bubbles' ? '.png' : (entityKey === 'coral' || entityKey === 'sea_kelp' || entityKey === 'sea_rock' || entityKey === 'gold_doubloon' || entityKey === 'whirlpool' || entityKey === 'sunken_boat' || entityKey === 'shark_skeleton' || entityKey === 'anchor' || entityKey === 'shell' ? '.png' : '_fish.png')}`}
                        alt={config.names[0]}
                        className="w-32 h-32 object-contain drop-shadow-lg"
                    />
                </div>

                {/* Content */}
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{config.names[0]}</h2>

                <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold text-sm">
                        <Coins size={14} />
                        {config.value} 🪙
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                        <Weight size={14} />
                        {config.weightMultiplier} kg
                    </div>
                </div>

                <div className="w-full space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">
                            <Info size={14} />
                            Description
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            {details.description}
                        </p>
                    </div>

                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                            <Zap size={14} />
                            Ability / Effect
                        </div>
                        <p className="text-slate-700 font-bold leading-relaxed">
                            {details.effect}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
};
