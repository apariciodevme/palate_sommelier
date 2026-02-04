// components/SommelierApp.tsx
'use client';

import React, { useState, useMemo } from 'react';
import menuDataRaw from '@/data/menu.json';
import { RestaurantData, MenuItem } from '@/types/menu';
import Image from 'next/image';

const menuData = menuDataRaw as RestaurantData;

export default function SommelierApp() {
    const [selectedDishName, setSelectedDishName] = useState<string>('');
    const [selectedTier, setSelectedTier] = useState<'byGlass' | 'midRange' | 'exclusive'>('byGlass');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Find the selected item object from the flat list of all dishes
    const selectedItem = useMemo(() => {
        for (const cat of menuData.menu) {
            const found = cat.items.find((item) => item.dish === selectedDishName);
            if (found) return found;
        }
        return null;
    }, [selectedDishName]);

    // Close dropdown when clicking outside (simple implementation)
    // Ideally use a ref and event listener, but for this scope inline toggle is okay

    return (
        <div className="p-4 md:p-12 bg-background min-h-screen font-sans text-slate-700">
            <header className="flex flex-col items-center text-center mb-12">
                <Image
                    src={"/palate.webp"}
                    alt="Palate"
                    width={200}
                    height={200}
                />
                <div className="h-px w-20 bg-gold-500 mx-auto mb-4" />
                <p className="text-brown text-2xl italic font-serif">Palate Sommelier Pairing</p>
            </header>

            <div className="max-w-xl mx-auto space-y-6">
                <label className="block text-sm uppercase tracking-wider text-slate-500 font-semibold text-center">
                    What are you eating tonight?
                </label>

                <div className="relative z-50">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full p-4 rounded-full border border-lightBlue/30 bg-white/50 backdrop-blur-sm text-lg text-left transition-all hover:border-brown focus:border-brown flex justify-between items-center group"
                    >
                        <span className={selectedDishName ? "text-slate-900" : "text-slate-400 italic"}>
                            {selectedDishName || "Select a dish..."}
                        </span>
                        <span className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} text-brown`}>
                            ▼
                        </span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                            {menuData.menu.map((category) => (
                                <div key={category.category} className="mb-2">
                                    <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-lightBlue sticky top-0 bg-white">
                                        {category.category}
                                    </div>
                                    {category.items.map((item) => (
                                        <button
                                            key={item.dish}
                                            onClick={() => {
                                                setSelectedDishName(item.dish);
                                                setSelectedTier('byGlass');
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-lg text-sm md:text-base transition-colors flex justify-between items-center ${selectedDishName === item.dish
                                                ? 'bg-slate-50 text-brown font-medium'
                                                : 'hover:bg-slate-50 text-slate-700'
                                                }`}
                                        >
                                            <span>{item.dish}</span>
                                            <span className="text-slate-400 text-xs">{item.price},-</span>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selectedItem ? (
                <div className="max-w-xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-white border border-lightBlue/20 shadow-sm rounded-t-3xl p-8 md:p-12 relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute -top-6 -right-6 opacity-5 text-9xl font-serif text-brown">“</div>

                        <h2 className="text-xs font-bold uppercase tracking-widest text-lightBlue mb-8 text-center">
                            Sommelier Recommendation
                        </h2>

                        <div className="flex justify-center flex-wrap gap-2 mb-10 bg-slate-50 p-1.5 rounded-full w-fit mx-auto">
                            {[
                                { id: 'byGlass', label: 'By the Glass' },
                                { id: 'midRange', label: 'Mid-Range' },
                                { id: 'exclusive', label: 'Exclusive' }
                            ].map((tier) => (
                                <button
                                    key={tier.id}
                                    onClick={() => setSelectedTier(tier.id as any)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${selectedTier === tier.id
                                        ? 'bg-brown text-white shadow-md'
                                        : 'text-slate-500 hover:text-brown'
                                        }`}
                                >
                                    {tier.label}
                                </button>
                            ))}
                        </div>

                        <div className="text-center space-y-2 mb-8">
                            <h3 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 leading-tight">
                                {selectedItem.pairings[selectedTier].name}
                            </h3>
                            <p className="text-brown font-medium tracking-wide uppercase text-sm">
                                {selectedItem.pairings[selectedTier].grape}
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 text-sm text-slate-500 font-medium mb-10 border-y border-slate-100 py-4">
                            <div className="flex flex-col items-center">
                                <span className="text-xs uppercase tracking-wider text-slate-400 mb-1">Vintage</span>
                                <span className="text-slate-900">{selectedItem.pairings[selectedTier].vintage}</span>
                            </div>
                            <div className="w-px bg-slate-200"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-xs uppercase tracking-wider text-slate-400 mb-1">Price</span>
                                <span className="text-slate-900">{selectedItem.pairings[selectedTier].price} NOK</span>
                            </div>
                        </div>

                        <div className="relative">
                            <p className="text-xl text-slate-600 italic leading-relaxed font-serif text-center px-4">
                                "{selectedItem.pairings[selectedTier].note}"
                            </p>
                        </div>
                    </div>
                    {/* Bottle flourish at bottom */}
                    <div className="h-2 bg-linear-to-r from-lightBlue/10 via-brown/40 to-lightBlue/10 opacity-50"></div>
                </div>
            ) : (
                <div className="mt-20 text-center text-brown/60 font-serif text-xl italic animate-pulse">
                    Select a dish above to discover its perfect partner...
                </div>
            )}

            <div className="mt-20 flex justify-center opacity-80 mix-blend-multiply">
                <Image
                    src={"/plt.png"}
                    alt="Palate"
                    width={200}
                    height={50}
                    className="opacity-90 grayscale hover:grayscale-0 transition-all duration-500"
                />
            </div>
        </div>
    );
}