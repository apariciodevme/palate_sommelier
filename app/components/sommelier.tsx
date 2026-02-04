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

    // Find the selected item object from the flat list of all dishes
    const selectedItem = useMemo(() => {
        for (const cat of menuData.menu) {
            const found = cat.items.find((item) => item.dish === selectedDishName);
            if (found) return found;
        }
        return null;
    }, [selectedDishName]);

    return (
        <div className="p-4 md:p-12 bg-background min-h-screen font-sans text-slate-700">
            <header className="flex flex-col items-center text-center mb-12">
                <Image
                    src={"/palate.webp"}
                    alt="Palate"
                    width={200}
                    height={200}

                />
                <p className="text-brown text-2xl italic">Palate Sommelier Pairing</p>
            </header>

            <div className="space-y-6 p-12  rounded-2xl">
                <label className="block text-sm uppercase tracking-wider text-slate-700 font-semibold">
                    What are you eating tonight?
                </label>
                <select
                    value={selectedDishName}
                    onChange={(e) => {
                        setSelectedDishName(e.target.value);
                        setSelectedTier('byGlass');
                    }}
                    className="w-full p-4 rounded-full 
                   outline-none border border-lightBlue h-8 text-lg transition-colors cursor-pointer"
                >
                    <option value="">Select a dish</option>
                    {menuData.menu.map((category) => (
                        <optgroup key={category.category} label={category.category}>
                            {category.items.map((item) => (
                                <option key={item.dish} value={item.dish}>
                                    {item.dish} — {item.price} NOK
                                </option>
                            ))}
                        </optgroup>
                    ))}
                </select>
            </div>

            {selectedItem ? (
                <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-slate-100 border border-lightBlue rounded-2xl p-8 md:p-12 relative overflow-hidden">

                        {/* Decorative background element */}
                        <div className="absolute -top-10 -right-10 opacity-5 text-9xl font-serif">“</div>

                        <h2 className="text-sm font-bold uppercase tracking-widest text-lightBlue mb-6">
                            Our Recommendation
                        </h2>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {[
                                { id: 'byGlass', label: 'By the Glass' },
                                { id: 'midRange', label: 'Mid-Range' },
                                { id: 'exclusive', label: 'Exclusive' }
                            ].map((tier) => (
                                <button
                                    key={tier.id}
                                    onClick={() => setSelectedTier(tier.id as any)}
                                    className={`px-4 cursor-pointer py-2 rounded-full text-sm font-medium transition-colors ${selectedTier === tier.id
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {tier.label}
                                </button>
                            ))}
                        </div>

                        {/*Pairing block*/}

                        <div className="mb-8">
                            <h3 className="text-2xl md:text-3xl font-medium mb-2">
                                {selectedItem.pairings[selectedTier].name}
                            </h3>
                            <h3 className="text-md font-light mb-2">
                                {selectedItem.pairings[selectedTier].grape}
                            </h3>
                            <div className="flex gap-4 items-center text-slate-500 font-medium">
                                <span className="px-2 py-1 bg-slate-200 rounded text-xs">{selectedItem.pairings[selectedTier].vintage}</span>
                                <span>{selectedItem.pairings[selectedTier].price} NOK</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-200 pt-8">
                            <p className="text-xl text-slate-700 italic leading-relaxed font-serif">
                                "{selectedItem.pairings[selectedTier].note}"
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-16 text-center text-brown italic">
                    Select a dish above to discover its perfect wine partner.
                </div>
            )}

            <Image
                src={"/plt.png"}
                alt="Palate"
                width={500}
                height={200}
            />
        </div>
    );
}