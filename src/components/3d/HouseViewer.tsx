'use client';

import React, { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sky, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import HouseModel from './HouseModel';

interface HouseViewerProps {
  type: 'Modern Villa' | 'Luxury Duplex' | 'Small House' | 'Apartment' | 'Farm House' | 'Commercial Building';
  wallColor: string;
  interiorColor: string;
  floorType: 'wood' | 'marble' | 'carpet';
  roofVisible: boolean;
  dayMode: boolean;
  gardenDesign: 'minimalist' | 'lush' | 'desert';
  measureMode: boolean;
  measurePoints: THREE.Vector3[];
  setMeasurePoints: React.Dispatch<React.SetStateAction<THREE.Vector3[]>>;
  cameraPreset: 'front' | 'top' | 'inside' | null;
  setCameraPreset: (preset: 'front' | 'top' | 'inside' | null) => void;
  glbUrl?: string;
}

// Inner helper component to manage camera presets
function CameraPresetController({
  preset,
  setPreset,
}: {
  preset: 'front' | 'top' | 'inside' | null;
  setPreset: (preset: 'front' | 'top' | 'inside' | null) => void;
}) {
  const { camera } = useThree();

  useEffect(() => {
    if (!preset) return;

    if (preset === 'front') {
      camera.position.set(6, 4, 8);
    } else if (preset === 'top') {
      camera.position.set(0.01, 10, 0);
    } else if (preset === 'inside') {
      camera.position.set(0.5, 0.45, 0.8);
    }
    
    camera.lookAt(0, 0.5, 0);
    setPreset(null); // Clear preset immediately to allow OrbitControls manual override
  }, [preset, camera, setPreset]);

  return null;
}

export default function HouseViewer({
  type,
  wallColor,
  interiorColor,
  floorType,
  roofVisible,
  dayMode,
  gardenDesign,
  measureMode,
  measurePoints,
  setMeasurePoints,
  cameraPreset,
  setCameraPreset,
  glbUrl,
}: HouseViewerProps) {
  // Calculate midpoint for distance label overlay
  const getMidpoint = () => {
    if (measurePoints.length !== 2) return null;
    return new THREE.Vector3()
      .addVectors(measurePoints[0], measurePoints[1])
      .multiplyScalar(0.5);
  };

  const midpoint = getMidpoint();
  const distanceFt = midpoint 
    ? (measurePoints[0].distanceTo(measurePoints[1]) * 8.5).toFixed(1) 
    : '0.0';

  // Environment and light controls
  const ambientIntensity = dayMode ? 0.8 : 0.25;
  const directColor = dayMode ? '#fffbeb' : '#93c5fd'; // Warm sunlight vs moon light
  const directIntensity = dayMode ? 1.5 : 0.4;

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden rounded-2xl border border-slate-800">
      {/* 3D Loading Overlay */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950 text-slate-400 z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium text-sm tracking-wide">Rendering 3D Architectural Model...</p>
          </div>
        </div>
      }>
        <Canvas
          shadows
          camera={{ position: [6, 4, 8], fov: 45 }}
          style={{ transition: 'background 1s ease-in-out' }}
        >
          {/* Atmospheric Sky Dome */}
          <Sky 
            distance={450000} 
            sunPosition={dayMode ? [8, 6, 6] : [-5, 0.5, -4]} 
            mieCoefficient={0.005} 
            mieDirectionalG={0.07} 
            rayleigh={dayMode ? 3 : 0.5} 
            turbidity={dayMode ? 8 : 20} 
          />

          {/* Ambient light for general fill */}
          <ambientLight intensity={ambientIntensity} />

          {/* Directional light acting as Sun or Moon */}
          <directionalLight
            castShadow
            position={dayMode ? [8, 12, 6] : [-5, 8, -4]}
            intensity={directIntensity}
            color={directColor}
            shadow-mapSize={[2048, 2048]} // Higher resolution shadows for photorealism
            shadow-camera-left={-6}
            shadow-camera-right={6}
            shadow-camera-top={6}
            shadow-camera-bottom={-6}
          />

          {/* Additional warm light emission from doors/windows when night */}
          {!dayMode && (
            <>
              <pointLight position={[0, 1.2, 0.8]} intensity={1.2} color="#fbbf24" distance={5} />
              <pointLight position={[-1.2, 0.8, -0.5]} intensity={0.9} color="#fbbf24" distance={4} />
              <pointLight position={[1.2, 0.8, 0.5]} intensity={0.9} color="#fbbf24" distance={4} />
            </>
          )}

          {/* Camera Controller component to adjust to preset angles */}
          <CameraPresetController preset={cameraPreset} setPreset={setCameraPreset} />

          {/* Main House Model */}
          <HouseModel
            type={type}
            wallColor={wallColor}
            interiorColor={interiorColor}
            floorType={floorType}
            roofVisible={roofVisible}
            dayMode={dayMode}
            gardenDesign={gardenDesign}
            measurePoints={measurePoints}
            setMeasurePoints={setMeasurePoints}
            measureMode={measureMode}
            glbUrl={glbUrl}
          />

          {/* Soft contact shadows beneath objects for realistic depth */}
          <ContactShadows 
            position={[0, -0.01, 0]} 
            opacity={0.65} 
            scale={12} 
            blur={2} 
            far={4} 
          />

          {/* Measurement Label Projected in 3D Space */}
          {measureMode && measurePoints.length === 2 && midpoint && (
            <Html position={[midpoint.x, midpoint.y + 0.3, midpoint.z]} center>
              <div className="bg-rose-500 text-white px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap shadow-xl border border-rose-400 select-none animate-bounce flex items-center gap-1">
                <span>📐 {distanceFt} ft</span>
                <button 
                  className="ml-1 hover:bg-rose-600 rounded px-1" 
                  onClick={() => setMeasurePoints([])}
                >
                  ✕
                </button>
              </div>
            </Html>
          )}

          {/* Orbit Camera Controls */}
          <OrbitControls 
            enablePan={!measureMode} // Disable pan while measuring to make points easier to click
            maxPolarAngle={Math.PI / 2 - 0.05} // Don't let camera go below ground
            minDistance={3}
            maxDistance={15}
            dampingFactor={0.05}
            enableDamping
          />
        </Canvas>
      </Suspense>

      {/* Measurement HUD Overlay */}
      {measureMode && (
        <div className="absolute top-4 left-4 glass px-3 py-2 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 z-10 flex flex-col gap-1 border border-indigo-500/30">
          <div className="flex items-center gap-1.5 text-rose-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Measure Mode Active
          </div>
          {measurePoints.length === 0 && <p className="text-slate-500 dark:text-slate-400">Click a point on the house/ground</p>}
          {measurePoints.length === 1 && <p className="text-slate-500 dark:text-slate-400">Click a second point to measure distance</p>}
          {measurePoints.length === 2 && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="text-slate-700 dark:text-slate-300">Measured: <span className="font-bold text-rose-500">{distanceFt} ft</span></div>
              <button 
                onClick={() => setMeasurePoints([])}
                className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 py-0.5 px-2 rounded-md font-semibold text-[10px] mt-1 transition-all"
              >
                Reset points
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
