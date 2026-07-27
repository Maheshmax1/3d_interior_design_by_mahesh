'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRightLeft, X, Maximize2, Bed, Bath, ArrowUpRight } from 'lucide-react';
import { Property } from '../data/properties';

interface CompareWidgetProps {
  comparedProperties: Property[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onViewDetails: (property: Property) => void;
}

export default function CompareWidget({
  comparedProperties,
  onRemove,
  onClearAll,
  onViewDetails,
}: CompareWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (comparedProperties.length === 0) return null;

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 max-w-[90vw] md:max-w-3xl font-sans">
      
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-5 rounded-2xl flex items-center gap-2 shadow-xl shadow-primary/20 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowRightLeft className="w-4.5 h-4.5 animate-pulse" />
          <span>Compare Properties ({comparedProperties.length})</span>
        </button>
      )}

      {/* Main Comparison Drawer */}
      {isOpen && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl p-5 w-full flex flex-col gap-4 animate-scale-in">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-primary dark:text-accent">
              <ArrowRightLeft className="w-5 h-5" />
              <h3 className="font-extrabold text-sm tracking-wide">Compare Properties</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={onClearAll}
                className="text-slate-400 hover:text-slate-605 dark:hover:text-slate-350 text-xs font-semibold cursor-pointer"
              >
                Clear all
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
            {comparedProperties.map((property) => (
              <div 
                key={property.id} 
                className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-105 dark:border-slate-850 flex flex-col gap-3 relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => onRemove(property.id)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-900/60 text-white flex items-center justify-center hover:bg-slate-900 transition-all z-10 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Photo */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-200">
                  <Image 
                    src={property.images[0]} 
                    alt={property.name} 
                    fill 
                    sizes="(max-w-300px) 100vw, 20vw"
                    className="object-cover"
                  />
                </div>

                {/* Basic Info */}
                <div>
                  <span className="text-[9px] bg-primary/10 text-primary dark:text-accent font-bold uppercase tracking-wider py-0.5 px-1.5 rounded">
                    {property.type}
                  </span>
                  <h4 className="font-extrabold text-xs text-slate-805 dark:text-slate-50 mt-1 line-clamp-1">
                    {property.name}
                  </h4>
                  <p className="text-xs font-black text-primary dark:text-accent mt-0.5">
                    {formatPrice(property.price)}
                  </p>
                </div>

                {/* Specs */}
                <div className="flex flex-col gap-1.5 border-t border-slate-150 dark:border-slate-800/80 pt-2.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5 text-primary" /> Bedrooms</span>
                    <span className="text-slate-700 dark:text-slate-200">{property.bedrooms > 0 ? property.bedrooms : 'Studio'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 text-primary" /> Bathrooms</span>
                    <span className="text-slate-700 dark:text-slate-200">{property.bathrooms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-primary" /> Area</span>
                    <span className="text-slate-700 dark:text-slate-200">{property.area.toLocaleString()} sqft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Year Built</span>
                    <span className="text-slate-700 dark:text-slate-200">{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rating</span>
                    <span className="text-slate-700 dark:text-slate-200">★ {property.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Details Button */}
                <button
                  onClick={() => onViewDetails(property)}
                  className="w-full mt-1 bg-primary hover:bg-primary/95 text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  View Details
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Empty Slots */}
            {comparedProperties.length < 3 && Array.from({ length: 3 - comparedProperties.length }).map((_, idx) => (
              <div 
                key={idx} 
                className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500 select-none min-h-[220px]"
              >
                <ArrowRightLeft className="w-7 h-7 mb-2 opacity-40" />
                <p className="text-xs font-bold">Add property</p>
                <p className="text-[10px] mt-0.5">Select another property to compare side-by-side</p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
