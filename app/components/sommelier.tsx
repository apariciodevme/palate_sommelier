// components/SommelierApp.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import menuDataRaw from '@/data/menu.json';
import { RestaurantData, MenuItem } from '@/types/menu';
import Image from 'next/image';
import Footer from './Footer';

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

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="p-4 min-h-screen font-sans text-slate-700 lg:pt-0 relative flex flex-col">
            {/* Fixed Background Layer */}
            <div className="fixed inset-0 z-[-1]">
                <Image
                    src="/plt.webp"
                    alt="Background"
                    fill
                    className="object-cover opacity-50 grayscale-20"
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/50 to-background/80" />
            </div>

            <header className="flex flex-col items-center text-center mb-12">
                <Image
                    src={"/palate.webp"}
                    alt="Palate"
                    width={200}
                    height={200}
                />

                <p className="text-brown text-2xl italic font-serif pr-4 lg:text-3xl mt-4">Palate Sommelier Pairing</p>
            </header>

            <div className="grid lg:grid-cols-2 lg:gap-24 lg:items-start lg:max-w-6xl lg:mx-auto w-full">
                <div className="max-w-xl mx-auto lg:mx-0 w-full space-y-6">
                    <label className="block text-sm uppercase tracking-wider text-slate-600 font-semibold text-center lg:text-left">
                        What are you eating today?
                    </label>

                    <div className="relative z-50" ref={dropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full p-4 rounded-full border border-lightBlue/30 bg-white/50 backdrop-blur-sm text-lg text-left transition-colors hover:border-brown focus:border-brown flex justify-between items-center group"
                        >
                            <span className={selectedDishName ? "text-slate-900" : "text-slate-400 italic"}>
                                {selectedDishName || "Select a dish..."}
                            </span>
                            <motion.span
                                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-brown"
                            >
                                ▼
                            </motion.span>
                        </motion.button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 max-h-[60vh] overflow-y-auto p-2 scrollbar-hide origin-top"
                                >
                                    {menuData.menu.map((category) => (
                                        <div key={category.category} className="mb-2">
                                            <div className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-lightBlue sticky top-0 bg-white z-10">
                                                {category.category}
                                            </div>
                                            {category.items.map((item) => (
                                                <motion.button
                                                    key={item.dish}
                                                    whileHover={{ x: 4, backgroundColor: "rgba(248, 250, 252, 1)" }}
                                                    onClick={() => {
                                                        setSelectedDishName(item.dish);
                                                        setSelectedTier('byGlass');
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm md:text-base transition-colors flex justify-between items-center ${selectedDishName === item.dish
                                                        ? 'bg-slate-50 text-brown font-medium'
                                                        : 'text-slate-700'
                                                        }`}
                                                >
                                                    <span>{item.dish}</span>
                                                    <span className="text-slate-400 text-xs">{item.price},-</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>


                <AnimatePresence mode="wait">
                    {selectedItem ? (
                        <motion.div
                            key="recommendation"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="max-w-xl mx-auto lg:mx-0 lg:mt-0 mt-12 w-full"
                        >
                            <div className="bg-white border border-lightBlue/20 shadow-sm rounded-3xl p-8 md:p-12 relative overflow-hidden">
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

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedTier + selectedItem.dish}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-center space-y-2 mb-8"
                                    >
                                        <h3 className="text-3xl md:text-4xl font-serif font-medium text-slate-900 leading-tight">
                                            {selectedItem.pairings[selectedTier].name}
                                        </h3>
                                        <p className="text-brown font-medium tracking-wide uppercase text-sm">
                                            {selectedItem.pairings[selectedTier].grape}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

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
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-20 lg:mt-0 text-center text-slate-800 font-serif text-xl lg:text-2xl italic flex items-center justify-center h-full"
                        >
                            Select a dish to discover it&apos;s perfect partner...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-auto w-full">
                <Footer />
            </div>


        </div>
    );
}