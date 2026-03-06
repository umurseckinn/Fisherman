import React from 'react';
import { X, Zap, ShoppingBag, Bomb, Anchor, Star, Shield, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type BoosterType = 'harpoon' | 'net' | 'tnt' | 'anchor';

export interface PurchasePackage {
    type: 'all' | 'single';
    amount: number;
    cost: number; // in USD
}

interface BoosterPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    boosterType: BoosterType;
    onPurchase: (pkg: PurchasePackage) => void;
}

const BOOSTER_CONFIG = {
    harpoon: { icon: Zap, label: 'Harpoon', color: 'text-yellow-500', bg: 'bg-yellow-100', glow: 'shadow-yellow-500/50' },
    net: { icon: ShoppingBag, label: 'Net', color: 'text-blue-500', bg: 'bg-blue-100', glow: 'shadow-blue-500/50' },
    tnt: { icon: Bomb, label: 'TNT', color: 'text-red-500', bg: 'bg-red-100', glow: 'shadow-red-500/50' },
    anchor: { icon: Anchor, label: 'Anchor', color: 'text-slate-600', bg: 'bg-slate-200', glow: 'shadow-slate-500/50' }
};

export function BoosterPurchaseModal({
    isOpen,
    onClose,
    boosterType,
    onPurchase
}: BoosterPurchaseModalProps) {
    if (!isOpen) return null;

    const activeConfig = BOOSTER_CONFIG[boosterType];
    const ActiveIcon = activeConfig.icon;

    const handleBuy = (pkg: PurchasePackage) => {
        // Fake processing delay for visual feedback if desired, or just instant:
        onPurchase(pkg);
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md z-[120] flex items-center justify-center animate-in fade-in duration-300 p-4">
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-[32px] w-full max-w-sm p-6 shadow-2xl flex flex-col gap-6 border border-white/20 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center mt-2 relative z-10">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${activeConfig.bg} shadow-lg ${activeConfig.glow} mb-4 relative`}>
                        {/* Sparkles */}
                        <Star className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                        <ActiveIcon className={`w-10 h-10 ${activeConfig.color} filter drop-shadow-md`} />
                    </div>
                    <h2 className="text-3xl font-display font-extrabold text-slate-800 tracking-tight">Out of {activeConfig.label}s!</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Stock up now to keep catching rare fish!</p>
                </div>

                {/* Purchase Options */}
                <div className="flex flex-col gap-3 relative z-10">
                    {/* Mega Pack */}
                    <button
                        onClick={() => handleBuy({ type: 'all', amount: 5, cost: 60 })}
                        className="group relative flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-indigo-500/40 border border-indigo-400/30 overflow-hidden"
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Gift className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left flex flex-col">
                                <span className="font-bold text-white text-lg leading-tight">Mega Pack</span>
                                <span className="text-indigo-100 text-xs font-medium">5x ALL Boosters</span>
                            </div>
                        </div>
                        <div className="bg-white text-indigo-700 font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                            $60.00
                        </div>
                    </button>

                    {/* Epic Pack */}
                    <button
                        onClick={() => handleBuy({ type: 'all', amount: 3, cost: 20 })}
                        className="group relative flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg border border-orange-400/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left flex flex-col">
                                <span className="font-bold text-white text-lg leading-tight">Epic Pack</span>
                                <span className="text-orange-100 text-xs font-medium">3x ALL Boosters</span>
                            </div>
                        </div>
                        <div className="bg-white text-orange-600 font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                            $20.00
                        </div>
                    </button>

                    {/* Booster Specific Packs */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <button
                            onClick={() => handleBuy({ type: 'single', amount: 3, cost: 15 })}
                            className="flex flex-col items-center justify-center bg-white border-2 border-slate-100 p-3 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                        >
                            <div className="flex -space-x-2 mb-2">
                                <ActiveIcon className={`w-5 h-5 ${activeConfig.color}`} />
                                <ActiveIcon className={`w-5 h-5 ${activeConfig.color} opacity-80`} />
                                <ActiveIcon className={`w-5 h-5 ${activeConfig.color} opacity-60`} />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">3x {activeConfig.label}</span>
                            <span className="text-blue-600 font-black mt-1">$15.00</span>
                        </button>

                        <button
                            onClick={() => handleBuy({ type: 'single', amount: 1, cost: 10 })}
                            className="flex flex-col items-center justify-center bg-white border-2 border-slate-100 p-3 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                        >
                            <div className="mb-2">
                                <ActiveIcon className={`w-6 h-6 ${activeConfig.color}`} />
                            </div>
                            <span className="font-bold text-slate-700 text-sm">1x {activeConfig.label}</span>
                            <span className="text-blue-600 font-black mt-1">$10.00</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
