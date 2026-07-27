'use client';

import React from 'react';
import { Sun, Moon, Eye, EyeOff, Ruler, Compass, Check } from 'lucide-react';

interface ViewerControlsProps {
  wallColor: string;
  setWallColor: (color: string) => void;
  interiorColor: string;
  setInteriorColor: (color: string) => void;
  floorType: 'wood' | 'marble' | 'carpet';
  setFloorType: (type: 'wood' | 'marble' | 'carpet') => void;
  roofVisible: boolean;
  setRoofVisible: (visible: boolean) => void;
  dayMode: boolean;
  setDayMode: (day: boolean) => void;
  gardenDesign: 'minimalist' | 'lush' | 'desert';
  setGardenDesign: (design: 'minimalist' | 'lush' | 'desert') => void;
  measureMode: boolean;
  setMeasureMode: (mode: boolean) => void;
  setCameraPreset: (preset: 'front' | 'top' | 'inside' | null) => void;
}

const WALL_COLORS = [
  { name: 'Classic White', value: '#f8fafc' },
  { name: 'Modern Gray', value: '#64748b' },
  { name: 'Desert Sand', value: '#fef08a' },
  { name: 'Sage Green', value: '#a3e635' },
  { name: 'Navy Slate', value: '#1e293b' },
  { name: 'Terracotta', value: '#ea580c' },
];

const INTERIOR_COLORS = [
  { name: 'Cozy Cream', value: '#fef3c7' },
  { name: 'Soft Gray', value: '#cbd5e1' },
  { name: 'Mint Green', value: '#dcfce7' },
  { name: 'Sky Blue', value: '#e0f2fe' },
];

export default function ViewerControls({
  wallColor,
  setWallColor,
  interiorColor,
  setInteriorColor,
  floorType,
  setFloorType,
  roofVisible,
  setRoofVisible,
  dayMode,
  setDayMode,
  gardenDesign,
  setGardenDesign,
  measureMode,
  setMeasureMode,
  setCameraPreset,
}: ViewerControlsProps) {
  return (
    <div className="w-full flex flex-col gap-6 text-slate-800 dark:text-slate-100">
      
      {/* 1. Environmental Controls (Lighting & Roof) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setDayMode(!dayMode)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-sm transition-all duration-300 ${
            dayMode 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-sm' 
              : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-400'
          }`}
        >
          {dayMode ? (
            <>
              <Sun className="w-4 h-4 animate-spin-slow" />
              <span>Day Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span>Night Mode</span>
            </>
          )}
        </button>

        <button
          onClick={() => setRoofVisible(!roofVisible)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-sm transition-all duration-300 ${
            !roofVisible 
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          {roofVisible ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Roof Off (Inside)</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Roof On</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Interactive Modes (Measure Tool) */}
      <div>
        <button
          onClick={() => setMeasureMode(!measureMode)}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border font-medium text-sm transition-all duration-300 ${
            measureMode 
              ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20' 
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
          }`}
        >
          <Ruler className="w-4 h-4" />
          <span>{measureMode ? 'Deactivate Room Measure' : 'Activate Room Measure'}</span>
        </button>
      </div>

      {/* 3. Camera Preset Angles */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5" />
          Camera Preset Angles
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {['front', 'top', 'inside'].map((preset) => (
            <button
              key={preset}
              onClick={() => setCameraPreset(preset as 'front' | 'top' | 'inside')}
              className="py-2 px-3 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all capitalize"
            >
              {preset} View
            </button>
          ))}
        </div>
      </div>

      {/* 4. Exterior Wall Colors */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Exterior Wall Color
        </h4>
        <div className="grid grid-cols-6 gap-2">
          {WALL_COLORS.map((color) => {
            const isSelected = wallColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => setWallColor(color.value)}
                style={{ backgroundColor: color.value }}
                title={color.name}
                className={`w-full aspect-square rounded-full flex items-center justify-center transition-all shadow-inner relative group border ${
                  isSelected 
                    ? 'border-indigo-600 dark:border-indigo-400 scale-110 ring-2 ring-indigo-600/30' 
                    : 'border-slate-200 dark:border-slate-800 hover:scale-105'
                }`}
              >
                {isSelected && (
                  <Check className={`w-4 h-4 ${color.value === '#f8fafc' ? 'text-slate-800' : 'text-white'}`} />
                )}
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 bg-slate-900 text-white text-[10px] py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-semibold">
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Interior Wall Colors (Conditional if Roof Off) */}
      {!roofVisible && (
        <div className="animate-float-in">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Interior Wall Color
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {INTERIOR_COLORS.map((color) => {
              const isSelected = interiorColor === color.value;
              return (
                <button
                  key={color.value}
                  onClick={() => setInteriorColor(color.value)}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                  className={`py-2 px-3 rounded-xl border text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    isSelected 
                      ? 'border-indigo-600 bg-white dark:bg-slate-800 font-bold scale-[1.02]' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-900 text-slate-500'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ backgroundColor: color.value }}></span>
                  {color.name.split(' ')[1]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Floor TypeSwitcher */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Floor Tile / Texture
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {(['wood', 'marble', 'carpet'] as const).map((type) => {
            const isSelected = floorType === type;
            return (
              <button
                key={type}
                onClick={() => setFloorType(type)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                  isSelected 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-md' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Garden Design Layout */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
          Landscape / Garden Layout
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {(['minimalist', 'lush', 'desert'] as const).map((design) => {
            const isSelected = gardenDesign === design;
            return (
              <button
                key={design}
                onClick={() => setGardenDesign(design)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {design}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
