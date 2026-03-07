import React from 'react';
import { X, Star, Shield, Gift } from 'lucide-react';
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
    harpoon: { imageSrc: '/assets/boosters/harpoon.png', label: 'Harpoon', phrase: 'Spear those stubborn catches effortlessly!', glow: 'shadow-yellow-500/50' },
    net: { imageSrc: '/assets/boosters/net.png', label: 'Net', phrase: 'Scoop up everything in your path!', glow: 'shadow-blue-500/50' },
    tnt: { imageSrc: '/assets/boosters/tnt.png', label: 'TNT', phrase: 'Clear the seabed with an explosive blast!', glow: 'shadow-red-500/50' },
    anchor: { imageSrc: '/assets/boosters/the_anchor.png', label: 'Anchor', phrase: 'Freeze time and grab what you want!', glow: 'shadow-slate-500/50' }
};

export function BoosterPurchaseModal({
    isOpen,
    onClose,
    boosterType,
    onPurchase
}: BoosterPurchaseModalProps) {
    if (!isOpen) return null;

    const activeConfig = BOOSTER_CONFIG[boosterType];

    const handleBuy = (pkg: PurchasePackage) => {
        // Fake processing delay for visual feedback if desired, or just instant:
        onPurchase(pkg);
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-[120] flex items-center justify-center animate-in fade-in duration-300 p-4">
            <div className="bg-black rounded-[32px] w-full max-w-sm p-6 shadow-2xl flex flex-col gap-6 border-4 border-yellow-500/80 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-yellow-600/20 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-all z-10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="flex flex-col items-center text-center mt-2 relative z-10">
                    <div className={`w-40 h-40 flex items-center justify-center mb-4 relative`}>
                        <img src={activeConfig.imageSrc} alt={activeConfig.label} className="w-40 h-40 object-contain filter drop-shadow-xl relative z-10 scale-125" />
                    </div>
                    <h2 className="text-3xl font-display font-extrabold text-yellow-500 tracking-tight text-shadow-sm">Out of {activeConfig.label}?</h2>
                    <p className="text-yellow-100/80 text-sm mt-2 font-medium">{activeConfig.phrase}</p>
                </div>

                {/* Purchase Options */}
                <div className="flex flex-col gap-3 relative z-10">
                    {/* Mega Pack */}
                    <button
                        onClick={() => handleBuy({ type: 'all', amount: 5, cost: 60 })}
                        className="group relative flex items-center justify-between bg-gradient-to-r from-yellow-300 to-yellow-500 p-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg hover:shadow-yellow-500/40 border border-yellow-200/50 overflow-hidden"
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <div className="flex items-center gap-3">
                            <div className="bg-black/20 p-2 rounded-xl backdrop-blur-sm">
                                <Gift className="w-6 h-6 text-yellow-900" />
                            </div>
                            <div className="text-left flex flex-col">
                                <span className="font-bold text-yellow-900 text-lg leading-tight">Mega Pack</span>
                                <span className="text-yellow-900/80 text-xs font-bold">5x ALL Boosters</span>
                            </div>
                        </div>
                        <div className="bg-yellow-900 text-yellow-400 font-extrabold px-3 py-1.5 rounded-lg shadow-sm border border-yellow-700/50">
                            $60.00
                        </div>
                    </button>

                    {/* Epic Pack */}
                    <button
                        onClick={() => handleBuy({ type: 'all', amount: 3, cost: 20 })}
                        className="group relative flex items-center justify-between bg-gradient-to-r from-amber-600 to-amber-700 p-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg border border-amber-400/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-black/20 p-2 rounded-xl backdrop-blur-sm">
                                <Shield className="w-6 h-6 text-yellow-100" />
                            </div>
                            <div className="text-left flex flex-col">
                                <span className="font-bold text-yellow-100 text-lg leading-tight">Epic Pack</span>
                                <span className="text-yellow-200/80 text-xs font-bold">3x ALL Boosters</span>
                            </div>
                        </div>
                        <div className="bg-yellow-900 text-yellow-500 font-extrabold px-3 py-1.5 rounded-lg shadow-sm border border-yellow-700/50">
                            $20.00
                        </div>
                    </button>

                    {/* Booster Specific Packs */}
                    <div className="grid grid-cols-2 gap-3 mt-1">
                        <button
                            onClick={() => handleBuy({ type: 'single', amount: 3, cost: 15 })}
                            className="flex flex-col items-center justify-center bg-black/50 border-2 border-yellow-700/30 p-3 rounded-2xl hover:bg-yellow-900/20 hover:border-yellow-600/50 transition-all hover:scale-[1.05] active:scale-95 shadow-none"
                        >
                            <div className="flex -space-x-6 mb-2">
                                <img src={activeConfig.imageSrc} alt={activeConfig.label} className="w-16 h-16 object-contain drop-shadow-md relative z-30" />
                                <img src={activeConfig.imageSrc} alt={activeConfig.label} className="w-16 h-16 object-contain drop-shadow-md opacity-80 relative z-20" />
                                <img src={activeConfig.imageSrc} alt={activeConfig.label} className="w-16 h-16 object-contain drop-shadow-md opacity-60 relative z-10" />
                            </div>
                            <span className="font-bold text-yellow-500 text-sm">3x {activeConfig.label}</span>
                            <span className="text-yellow-100/80 font-black mt-1">$15.00</span>
                        </button>

                        <button
                            onClick={() => handleBuy({ type: 'single', amount: 1, cost: 10 })}
                            className="flex flex-col items-center justify-center bg-black/50 border-2 border-yellow-700/30 p-3 rounded-2xl hover:bg-yellow-900/20 hover:border-yellow-600/50 transition-all hover:scale-[1.05] active:scale-95 shadow-none"
                        >
                            <div className="mb-2">
                                <img src={activeConfig.imageSrc} alt={activeConfig.label} className="w-24 h-24 object-contain drop-shadow-md" />
                            </div>
                            <span className="font-bold text-yellow-500 text-sm">1x {activeConfig.label}</span>
                            <span className="text-yellow-100/80 font-black mt-1">$10.00</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
