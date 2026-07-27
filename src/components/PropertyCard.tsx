'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, Compass, MapPin, Maximize2, Bed, Bath, ArrowRightLeft } from 'lucide-react';
import { Property } from '../data/properties';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (property: Property) => void;
}

export default function PropertyCard({
  property,
  onViewDetails,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}: PropertyCardProps) {
  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 flex flex-col h-full">
      
      {/* Property Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          sizes="(max-w-700px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-950/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-950 hover:scale-105'
          }`}
        >
          <Heart className={`w-4.5 h-4.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Category / Type Badge */}
        <div className="absolute bottom-4 left-4 flex gap-1.5 flex-wrap font-sans">
          <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
            {property.type}
          </span>
          {property.featured && (
            <span className="bg-accent text-foreground text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full shadow-sm">
              ★ Featured
            </span>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Rating and Price */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
            Built {property.yearBuilt}
          </span>
          <div className="flex items-center gap-1 bg-amber-500/10 py-0.5 px-2 rounded-lg text-amber-600 dark:text-amber-500 text-xs font-bold">
            ★ {property.rating.toFixed(1)}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-50 hover:text-primary transition-colors line-clamp-1 mb-1.5">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-4">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-primary" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Core Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-3 px-1 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 text-center text-xs font-medium text-slate-650 dark:text-slate-350 mb-5">
          <div className="flex flex-col items-center gap-1 border-r border-slate-200/50 dark:border-slate-800/40">
            <Bed className="w-4 h-4 text-primary" />
            <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'Studio'}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-slate-200/50 dark:border-slate-800/40">
            <Bath className="w-4 h-4 text-primary" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Maximize2 className="w-4 h-4 text-primary" />
            <span className="truncate">{property.area.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Action Bottom Section */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider leading-none">Price</span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-50 leading-none mt-1">{formatPrice(property.price)}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(property)}
              title="Compare specs"
              className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                isCompared
                  ? 'bg-primary/10 border-primary text-primary dark:text-accent'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>

            {/* View Details */}
            <button
              onClick={() => onViewDetails(property)}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-primary/10 hover:shadow-primary/20 active:scale-[0.98]"
            >
              Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
