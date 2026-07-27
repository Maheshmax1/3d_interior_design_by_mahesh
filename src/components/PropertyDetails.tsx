'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, Info, Video, HelpCircle, Download, Calendar, Mail, Phone, 
  MapPin, CheckCircle, Share2, Compass, Ruler, Flame, Box 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property } from '../data/properties';
import HouseViewer from './3d/HouseViewer';
import ViewerControls from './3d/ViewerControls';
import * as THREE from 'three';

interface PropertyDetailsProps {
  property: Property;
  onClose: () => void;
}

export default function PropertyDetails({ property, onClose }: PropertyDetailsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'showroom'>('info');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // 3D Customizer states (Bronze defaults)
  const [wallColor, setWallColor] = useState('#f8fafc'); 
  const [interiorColor, setInteriorColor] = useState('#fef3c7'); 
  const [floorType, setFloorType] = useState<'wood' | 'marble' | 'carpet'>('wood');
  const [roofVisible, setRoofVisible] = useState(true);
  const [dayMode, setDayMode] = useState(true);
  const [gardenDesign, setGardenDesign] = useState<'minimalist' | 'lush' | 'desert'>('minimalist');
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([]);
  const [cameraPreset, setCameraPreset] = useState<'front' | 'top' | 'inside' | null>(null);

  // Schedule Visit states
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('morning');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitScheduled, setVisitScheduled] = useState(false);

  // Contact builder state
  const [messageText, setMessageText] = useState(`Hi ${property.builder.name}, I am interested in exploring ${property.name}. Please send more information.`);
  const [messageSent, setMessageSent] = useState(false);

  const handleDownloadBrochure = (e: React.MouseEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 60,
      colors: ['#9a7b4f', '#c5a880', '#1c1917'],
      origin: { y: 0.7 }
    });
    alert(`Brochure downloaded successfully for "${property.name}"!`);
  };

  const handleScheduleVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitDate || !visitorName || !visitorPhone) {
      alert('Please fill out all fields to schedule a site visit.');
      return;
    }
    
    setVisitScheduled(true);
    confetti({
      particleCount: 150,
      spread: 80,
      colors: ['#9a7b4f', '#c5a880', '#10b981']
    });
  };

  const handleContactBuilder = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      alert(`Message successfully sent to ${property.builder.name}! They will get back to you shortly.`);
    }, 1200);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Listing share link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-md p-4 overflow-y-auto font-sans">
      <div 
        className="relative bg-white dark:bg-stone-900 w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border border-stone-200/60 dark:border-stone-800 flex flex-col max-h-[92vh] animate-scale-in"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-150 dark:border-stone-850">
          <div>
            <span className="text-[10px] bg-primary/10 text-primary dark:text-accent font-bold uppercase tracking-wider py-0.5 px-2 rounded">
              {property.type}
            </span>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 mt-1">
              {property.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share listing"
              className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-750 transition-all cursor-pointer"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-750 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-stone-50 dark:bg-stone-950 border-b border-stone-150 dark:border-stone-850 px-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'border-primary text-primary dark:text-accent font-black'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Info className="w-4 h-4" />
            Photos & Information
          </button>
          <button
            onClick={() => setActiveTab('showroom')}
            className={`py-3.5 px-4 text-sm font-bold border-b-2 flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'showroom'
                ? 'border-primary text-primary dark:text-accent font-black'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <Box className="w-4 h-4 text-primary" />
            Interactive 3D Showroom
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Tab 1: Photos & Basic Information */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left 2 Columns: Media & Description */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Main Image */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shadow-inner">
                  <Image
                    src={property.images[activeImageIdx]}
                    alt={property.name}
                    fill
                    priority
                    sizes="(max-w-1200px) 100vw"
                    className="object-cover"
                  />
                </div>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {property.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 shrink-0 border-2 transition-all cursor-pointer ${
                        activeImageIdx === idx 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${property.name} view ${idx + 1}`}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-2">Description</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                    {property.description}
                  </p>
                </div>

                {/* Amenities Grid */}
                <div>
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {property.amenities.map((amenity, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-2 py-2 px-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-150 dark:border-stone-800/80 text-xs text-stone-750 dark:text-stone-300 font-medium"
                      >
                        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Location */}
                <div>
                  <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 mb-3">Location on Map</h3>
                  <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-950 rounded-2xl overflow-hidden border border-stone-200/50 dark:border-stone-800/80 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[radial-gradient(#e7e5e4_1px,transparent_1px)] dark:bg-[radial-gradient(#44403c_1px,transparent_1px)] [background-size:16px_16px] opacity-75"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10 animate-bounce">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg ring-4 ring-primary/30">
                        <MapPin className="w-4.5 h-4.5" />
                      </div>
                      <span className="bg-stone-900 text-white text-[10px] font-bold py-0.5 px-2 rounded-md shadow whitespace-nowrap">
                        {property.location.split(',')[1]?.trim() || property.location}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-3 text-[10px] text-stone-400 font-bold tracking-widest uppercase">
                      Apex Maps Studio
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-col gap-6">
                
                {/* Download Brochure */}
                <div className="bg-stone-50 dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-800 flex flex-col items-start gap-3">
                  <h4 className="text-sm font-bold text-stone-850 dark:text-stone-200">Download Brochure</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Get full documentation, interior blueprints, layout specifications, and payment plans.
                  </p>
                  <button
                    onClick={handleDownloadBrochure}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/10 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Brochure (PDF)
                  </button>
                </div>

                {/* Schedule Visit */}
                <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800/80 flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-stone-850 dark:text-stone-200 flex items-center gap-1.5">
                    <Calendar className="w-4.5 h-4.5 text-primary" />
                    Schedule Visit
                  </h4>
                  {visitScheduled ? (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-105 dark:border-emerald-900/30 text-center flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                        ✓
                      </div>
                      <h5 className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Visit Scheduled Successfully!</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        Our builder agent will contact you at <span className="font-bold">{visitorPhone}</span> to confirm your slot on {visitDate} ({visitTime}).
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleScheduleVisit} className="flex flex-col gap-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Preferred Date</label>
                        <input 
                          type="date" 
                          required
                          value={visitDate}
                          onChange={(e) => setVisitDate(e.target.value)}
                          className="w-full mt-1 py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-950 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Time Slot</label>
                        <select
                          value={visitTime}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-full mt-1 py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-950 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        >
                          <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                          <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                          <option value="evening">Evening (4:00 PM - 7:00 PM)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Your Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. John Doe"
                          value={visitorName}
                          onChange={(e) => setVisitorName(e.target.value)}
                          className="w-full mt-1 py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-950 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="e.g. (555) 000-0000"
                          value={visitorPhone}
                          onChange={(e) => setVisitorPhone(e.target.value)}
                          className="w-full mt-1 py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-950 text-xs font-medium focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-1 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-950 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Confirm Slot Request
                      </button>
                    </form>
                  )}
                </div>

                {/* Builder Info */}
                <div className="bg-stone-50 dark:bg-stone-900/40 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 flex flex-col gap-4">
                  <h4 className="text-sm font-bold text-stone-850 dark:text-stone-200">Builder Agent</h4>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center font-extrabold text-sm shadow">
                      {property.builder.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-850 dark:text-stone-200">{property.builder.name}</h5>
                      <p className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">{property.builder.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a 
                      href={`tel:${property.builder.phone}`} 
                      className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-accent hover:underline"
                    >
                      <Phone className="w-4 h-4" />
                      {property.builder.phone}
                    </a>
                    <a 
                      href={`mailto:${property.builder.email}`} 
                      className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-accent hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      {property.builder.email}
                    </a>
                  </div>

                  <form onSubmit={handleContactBuilder} className="flex flex-col gap-2 mt-1">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={3}
                      className="w-full py-2 px-3 rounded-lg border border-stone-200 dark:border-stone-800 dark:bg-stone-950 text-xs font-medium focus:ring-2 focus:ring-primary outline-none resize-none"
                    />
                    <button
                      type="submit"
                      disabled={messageSent}
                      className="w-full bg-primary/10 hover:bg-primary/20 text-primary dark:text-accent py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-55 cursor-pointer"
                    >
                      {messageSent ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* Tab 2: 3D Showroom */}
          {activeTab === 'showroom' && (
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 h-auto lg:h-[70vh]">
              
              {/* Left 2 Columns: 3D Viewport */}
              <div className="w-full h-[380px] lg:h-full relative lg:col-span-2 shrink-0">
                <HouseViewer
                  type={property.type}
                  wallColor={wallColor}
                  interiorColor={interiorColor}
                  floorType={floorType}
                  roofVisible={roofVisible}
                  dayMode={dayMode}
                  gardenDesign={gardenDesign}
                  measureMode={measureMode}
                  measurePoints={measurePoints}
                  setMeasurePoints={setMeasurePoints}
                  cameraPreset={cameraPreset}
                  setCameraPreset={setCameraPreset}
                />
              </div>

              {/* Right Column: Customizer */}
              <div className="w-full h-auto lg:h-full lg:overflow-y-auto pr-1">
                <div className="bg-stone-50 dark:bg-stone-950/40 p-5 rounded-2xl border border-stone-150 dark:border-stone-800/80">
                  <h3 className="text-sm font-black text-stone-850 dark:text-stone-100 mb-4 flex items-center gap-1.5">
                    <Compass className="w-5 h-5 text-primary animate-spin-slow" />
                    3D Studio Configurator
                  </h3>
                  <ViewerControls
                    wallColor={wallColor}
                    setWallColor={setWallColor}
                    interiorColor={interiorColor}
                    setInteriorColor={setInteriorColor}
                    floorType={floorType}
                    setFloorType={setFloorType}
                    roofVisible={roofVisible}
                    setRoofVisible={setRoofVisible}
                    dayMode={dayMode}
                    setDayMode={setDayMode}
                    gardenDesign={gardenDesign}
                    setGardenDesign={setGardenDesign}
                    measureMode={measureMode}
                    setMeasureMode={setMeasureMode}
                    setCameraPreset={setCameraPreset}
                  />
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
