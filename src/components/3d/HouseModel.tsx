'use client';

import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface HouseModelProps {
  type: 'Modern Villa' | 'Luxury Duplex' | 'Small House' | 'Apartment' | 'Farm House' | 'Commercial Building';
  wallColor: string;
  interiorColor: string;
  floorType: 'wood' | 'marble' | 'carpet';
  roofVisible: boolean;
  dayMode: boolean;
  gardenDesign: 'minimalist' | 'lush' | 'desert';
  measurePoints: THREE.Vector3[];
  setMeasurePoints: React.Dispatch<React.SetStateAction<THREE.Vector3[]>>;
  measureMode: boolean;
  glbUrl?: string;
}

// Sub-component to load actual photorealistic GLB models safely
function GLBLoader({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // Improve PBR material mapping
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.envMapIntensity = 1.2;
        }
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]} />;
}

export default function HouseModel({
  type,
  wallColor,
  interiorColor,
  floorType,
  roofVisible,
  dayMode,
  gardenDesign,
  measurePoints,
  setMeasurePoints,
  measureMode,
  glbUrl,
}: HouseModelProps) {
  const houseRef = useRef<THREE.Group>(null);

  // Soft rotation animation when not interacting
  useFrame((state) => {
    if (houseRef.current && !measureMode) {
      houseRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;
    }
  });

  // Get floor color/material traits (Realistic wood, polished marble, soft carpet)
  const floorProps = useMemo(() => {
    switch (floorType) {
      case 'wood':
        return { color: '#78350f', roughness: 0.45, metalness: 0.1 }; // polished hardwood
      case 'marble':
        return { color: '#f1f5f9', roughness: 0.08, metalness: 0.95 }; // reflective marble slab
      case 'carpet':
        return { color: '#d6d3d1', roughness: 0.95, metalness: 0.0 }; // high-roughness soft fabric
    }
  }, [floorType]);

  // Handle click for measurement tool
  const handleMeshClick = (e: ThreeEvent<MouseEvent>) => {
    if (!measureMode) return;
    e.stopPropagation();
    
    const point = e.point.clone();
    
    if (measurePoints.length >= 2) {
      setMeasurePoints([point]);
    } else {
      setMeasurePoints((prev) => [...prev, point]);
    }
  };

  // Render garden features based on design
  const renderGarden = () => {
    const trees = [];
    const lawnColor = gardenDesign === 'desert' ? '#eab308' : gardenDesign === 'lush' ? '#166534' : '#22c55e';
    
    if (gardenDesign === 'lush') {
      trees.push(
        { pos: [-3.6, 0, -3.6], scale: [0.65, 1.3, 0.65] },
        { pos: [3.6, 0, -3.6], scale: [0.8, 1.6, 0.8] },
        { pos: [-3.8, 0, 3.6], scale: [0.55, 1.1, 0.55] },
        { pos: [3.8, 0, 3.6], scale: [0.65, 1.25, 0.65] }
      );
    } else if (gardenDesign === 'minimalist') {
      trees.push({ pos: [-3.5, 0, -3.5], scale: [0.75, 1.6, 0.75] });
    } else {
      // Desert Cacti pos
      trees.push(
        { pos: [-3.5, 0, -3.5], isCactus: true, scale: [0.22, 1.1, 0.22] },
        { pos: [3.5, 0, 3.5], isCactus: true, scale: [0.18, 0.9, 0.18] }
      );
    }

    return (
      <group>
        {/* Base Lawn / Sand */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow onClick={handleMeshClick}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color={lawnColor} roughness={0.85} metalness={0.0} />
        </mesh>

        {/* Stone Path / Driveway */}
        {gardenDesign !== 'desert' && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 2.5]} receiveShadow>
            <planeGeometry args={[2, 5]} />
            <meshStandardMaterial color="#475569" roughness={0.75} metalness={0.2} />
          </mesh>
        )}

        {/* Fences */}
        <group position={[0, 0.25, -4.9]}>
          <mesh castShadow>
            <boxGeometry args={[9.8, 0.06, 0.04]} />
            <meshStandardMaterial color="#44403c" roughness={0.9} />
          </mesh>
          <mesh castShadow position={[0, -0.15, 0]}>
            <boxGeometry args={[9.8, 0.06, 0.04]} />
            <meshStandardMaterial color="#44403c" roughness={0.9} />
          </mesh>
          {Array.from({ length: 9 }).map((_, i) => (
            <mesh key={i} position={[-4.5 + i * 1.12, -0.1, 0]} castShadow>
              <boxGeometry args={[0.08, 0.5, 0.08]} />
              <meshStandardMaterial color="#44403c" roughness={0.9} />
            </mesh>
          ))}
        </group>

        {/* Render Trees / Cacti */}
        {trees.map((t, idx) => (
          <group key={idx} position={t.pos as [number, number, number]}>
            {t.isCactus ? (
              <group>
                <mesh castShadow position={[0, t.scale[1] / 2, 0]}>
                  <cylinderGeometry args={[t.scale[0], t.scale[0], t.scale[1], 8]} />
                  <meshStandardMaterial color="#165b33" roughness={0.8} />
                </mesh>
                <mesh castShadow position={[0.22, t.scale[1] * 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
                  <cylinderGeometry args={[t.scale[0] * 0.8, t.scale[0] * 0.8, 0.4, 8]} />
                  <meshStandardMaterial color="#165b33" roughness={0.8} />
                </mesh>
              </group>
            ) : (
              <group>
                <mesh castShadow position={[0, t.scale[1] / 4, 0]}>
                  <cylinderGeometry args={[0.08, 0.1, t.scale[1] / 2]} />
                  <meshStandardMaterial color="#543c2b" roughness={0.9} />
                </mesh>
                <mesh castShadow position={[0, (t.scale[1] * 3) / 4, 0]}>
                  <sphereGeometry args={[t.scale[0] * 0.9, 16, 16]} />
                  <meshStandardMaterial color="#155e34" roughness={0.7} />
                </mesh>
              </group>
            )}
          </group>
        ))}
      </group>
    );
  };

  // Render rooms inside if roof is off
  const renderInteriorDetails = () => {
    if (roofVisible) return null;

    return (
      <group>
        {/* Simple interior divider walls */}
        <mesh position={[-0.5, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 1, 2.5]} />
          <meshStandardMaterial color={interiorColor} roughness={0.8} />
        </mesh>
        <mesh position={[1, 0.5, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 0.08]} />
          <meshStandardMaterial color={interiorColor} roughness={0.8} />
        </mesh>

        {/* Sofa */}
        <group position={[-1.2, 0.1, 0.5]} rotation={[0, Math.PI / 2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.2, 0.5]} />
            <meshStandardMaterial color="#991b1b" roughness={0.75} /> 
          </mesh>
          <mesh position={[0, 0.25, -0.2]} castShadow>
            <boxGeometry args={[1.2, 0.3, 0.1]} />
            <meshStandardMaterial color="#991b1b" roughness={0.75} />
          </mesh>
        </group>

        {/* Coffee Table */}
        <mesh position={[-1.2, 0.1, -0.3]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.6]} />
          <meshStandardMaterial color="#271b12" roughness={0.6} />
        </mesh>

        {/* Dining Table & Chairs */}
        <group position={[1.2, 0.2, -0.8]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 0.05, 0.7]} />
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </mesh>
          {/* Table Legs */}
          {[-0.5, 0.5].map((x) =>
            [-0.25, 0.25].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, -0.1, z]}>
                <cylinderGeometry args={[0.02, 0.02, 0.2]} />
                <meshStandardMaterial color="#0f172a" roughness={0.5} />
              </mesh>
            ))
          )}
        </group>

        {/* Bed */}
        <group position={[1.5, 0.25, 1.2]}>
          <mesh castShadow>
            <boxGeometry args={[1.0, 0.2, 1.2]} />
            <meshStandardMaterial color="#1e40af" roughness={0.7} /> 
          </mesh>
          <mesh position={[0, 0.15, -0.55]} castShadow>
            <boxGeometry args={[0.9, 0.1, 0.2]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.8} /> 
          </mesh>
        </group>
      </group>
    );
  };

  // High-fidelity procedural geometries
  const renderArchitecture = () => {
    switch (type) {
      case 'Modern Villa':
        return (
          <group position={[0, 0, 0]} onClick={handleMeshClick}>
            {/* Floor Slab */}
            <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
              <boxGeometry args={[4.2, 0.1, 3.2]} />
              <meshStandardMaterial {...floorProps} />
            </mesh>

            {/* Villa Walls */}
            <mesh position={[-2.05, 1, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 1.8, 3.2]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            <mesh position={[2.05, 1, 0.8]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 1.8, 1.6]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            <mesh position={[0, 1, -1.55]} castShadow receiveShadow>
              <boxGeometry args={[4.2, 1.8, 0.1]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            
            {/* Front Reflective Window Glass */}
            <mesh position={[0.5, 1, 1.55]} castShadow>
              <boxGeometry args={[3, 1.8, 0.05]} />
              <meshPhysicalMaterial 
                color={dayMode ? "#cbd5e1" : "#fcd34d"} 
                transparent 
                opacity={dayMode ? 0.25 : 0.7} 
                roughness={0.05}
                metalness={0.98}
                clearcoat={1.0}
                emissive={dayMode ? "#000000" : "#d97706"}
                emissiveIntensity={dayMode ? 0 : 1.0}
              />
            </mesh>
            
            {/* Ground Level Interior */}
            {renderInteriorDetails()}

            {/* First Floor Slab */}
            <mesh position={[0, 1.95, 0]} receiveShadow castShadow>
              <boxGeometry args={[4.4, 0.1, 3.4]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.8} />
            </mesh>

            {/* Second Floor Bed/Room */}
            <group position={[0, 2, 0]}>
              <mesh position={[-1, 0.9, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 1.8, 3]} />
                <meshStandardMaterial color={wallColor} roughness={0.85} />
              </mesh>
              {/* Glass Balcony */}
              <mesh position={[1.4, 0.4, 0]} castShadow>
                <boxGeometry args={[0.02, 0.8, 3]} />
                <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.3} roughness={0.05} metalness={0.9} clearcoat={1} />
              </mesh>
              <mesh position={[0.7, 0.4, 1.49]} castShadow>
                <boxGeometry args={[1.45, 0.8, 0.02]} />
                <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.3} roughness={0.05} metalness={0.9} clearcoat={1} />
              </mesh>
            </group>

            {/* Roof Top Slab */}
            {roofVisible && (
              <mesh position={[0, 3.85, 0]} receiveShadow castShadow>
                <boxGeometry args={[4.4, 0.1, 3.4]} />
                <meshStandardMaterial color="#334155" roughness={0.85} />
              </mesh>
            )}

            {/* Infinity Pool */}
            <group position={[-3.3, 0.01, 1]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[1.5, 2.5]} />
                <meshStandardMaterial color="#0284c7" roughness={0.15} metalness={0.8} opacity={0.85} transparent />
              </mesh>
              <mesh position={[0, -0.05, 0]}>
                <boxGeometry args={[1.7, 0.1, 2.7]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.7} />
              </mesh>
            </group>
          </group>
        );

      case 'Luxury Duplex':
        return (
          <group position={[0, 0, 0]} onClick={handleMeshClick}>
            {/* Duplex Unit 1 (Left) */}
            <group position={[-1.25, 0, 0]}>
              <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
                <boxGeometry args={[2.2, 0.1, 3]} />
                <meshStandardMaterial {...floorProps} />
              </mesh>
              <mesh position={[-1.05, 1.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.1, 2.4, 3]} />
                <meshStandardMaterial color={wallColor} roughness={0.85} />
              </mesh>
              <mesh position={[0, 1.2, -1.45]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 2.4, 0.1]} />
                <meshStandardMaterial color={wallColor} roughness={0.85} />
              </mesh>
              <mesh position={[0, 1.2, 1.45]} castShadow>
                <boxGeometry args={[2, 2.2, 0.02]} />
                <meshPhysicalMaterial 
                  color={dayMode ? "#cbd5e1" : "#fde047"} 
                  transparent 
                  opacity={dayMode ? 0.25 : 0.75} 
                  roughness={0.05}
                  metalness={0.98}
                  clearcoat={1.0}
                  emissive={dayMode ? "#000000" : "#d97706"}
                  emissiveIntensity={dayMode ? 0 : 1.0}
                />
              </mesh>
              {roofVisible && (
                <mesh position={[0, 2.45, 0]} castShadow receiveShadow>
                  <boxGeometry args={[2.3, 0.1, 3.1]} />
                  <meshStandardMaterial color="#334155" roughness={0.85} />
                </mesh>
              )}
            </group>

            {/* Duplex Unit 2 (Right) */}
            <group position={[1.25, 0, 0.3]}>
              <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
                <boxGeometry args={[2.2, 0.1, 3]} />
                <meshStandardMaterial {...floorProps} />
              </mesh>
              <mesh position={[1.05, 1.5, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.1, 3.0, 3]} />
                <meshStandardMaterial color="#1e293b" roughness={0.85} /> 
              </mesh>
              <mesh position={[0, 1.5, -1.45]} castShadow receiveShadow>
                <boxGeometry args={[2.2, 3.0, 0.1]} />
                <meshStandardMaterial color={wallColor} roughness={0.85} />
              </mesh>
              <mesh position={[0, 1.5, 1.45]} castShadow>
                <boxGeometry args={[2, 2.8, 0.02]} />
                <meshPhysicalMaterial 
                  color={dayMode ? "#cbd5e1" : "#fde047"} 
                  transparent 
                  opacity={dayMode ? 0.25 : 0.75} 
                  roughness={0.05}
                  metalness={0.98}
                  clearcoat={1.0}
                  emissive={dayMode ? "#000000" : "#d97706"}
                  emissiveIntensity={dayMode ? 0 : 1.0}
                />
              </mesh>
              {roofVisible && (
                <mesh position={[0, 3.05, 0]} castShadow receiveShadow>
                  <boxGeometry args={[2.3, 0.1, 3.1]} />
                  <meshStandardMaterial color="#0f172a" roughness={0.85} />
                </mesh>
              )}
            </group>
          </group>
        );

      case 'Small House':
        return (
          <group position={[0, 0, 0]} onClick={handleMeshClick}>
            <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
              <boxGeometry args={[3.5, 0.1, 3]} />
              <meshStandardMaterial {...floorProps} />
            </mesh>

            {/* Cozy cottage walls */}
            <mesh position={[-1.7, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 1.7, 3]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            <mesh position={[1.7, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 1.7, 3]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            <mesh position={[0, 0.9, -1.45]} castShadow receiveShadow>
              <boxGeometry args={[3.5, 1.7, 0.1]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            <mesh position={[-0.8, 0.9, 1.45]} castShadow receiveShadow>
              <boxGeometry args={[1.9, 1.7, 0.1]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            <mesh position={[1.2, 0.9, 1.45]} castShadow receiveShadow>
              <boxGeometry args={[1.1, 1.7, 0.1]} />
              <meshStandardMaterial color={wallColor} roughness={0.85} />
            </mesh>
            {/* Wooden Door */}
            <mesh position={[0.3, 0.7, 1.45]} castShadow>
              <boxGeometry args={[0.5, 1.4, 0.08]} />
              <meshStandardMaterial color="#451a03" roughness={0.75} />
            </mesh>

            {renderInteriorDetails()}

            {/* Gable Roof */}
            {roofVisible && (
              <group position={[0, 1.75, 0]}>
                <mesh position={[-0.95, 0.65, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
                  <boxGeometry args={[2.1, 0.08, 3.2]} />
                  <meshStandardMaterial color="#991b1b" roughness={0.65} />
                </mesh>
                <mesh position={[0.95, 0.65, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow>
                  <boxGeometry args={[2.1, 0.08, 3.2]} />
                  <meshStandardMaterial color="#991b1b" roughness={0.65} />
                </mesh>
                {/* Chimney */}
                <mesh position={[0.8, 1.0, -0.6]} castShadow>
                  <boxGeometry args={[0.3, 0.8, 0.3]} />
                  <meshStandardMaterial color="#272522" roughness={0.8} />
                </mesh>
              </group>
            )}
          </group>
        );

      case 'Apartment':
        return (
          <group position={[0, 0, 0]} onClick={handleMeshClick}>
            <mesh position={[0, 0.05, 0]} receiveShadow castShadow>
              <boxGeometry args={[3.2, 0.1, 3.2]} />
              <meshStandardMaterial {...floorProps} />
            </mesh>

            {Array.from({ length: 4 }).map((_, floorIdx) => {
              const showFloorRoof = roofVisible || floorIdx < 3;
              const yOffset = floorIdx * 1.1;

              return (
                <group key={floorIdx} position={[0, yOffset, 0]}>
                  <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
                    <boxGeometry args={[3.0, 1.0, 3.0]} />
                    <meshStandardMaterial color={wallColor} roughness={0.85} />
                  </mesh>

                  {/* Windows with emissive lights */}
                  <mesh position={[-0.8, 0.6, 1.51]}>
                    <boxGeometry args={[0.6, 0.5, 0.02]} />
                    <meshStandardMaterial 
                      color={dayMode ? "#cbd5e1" : "#fcd34d"} 
                      transparent 
                      opacity={dayMode ? 0.4 : 0.8} 
                      roughness={0.05}
                      metalness={0.9}
                      emissive={dayMode ? "#000000" : "#d97706"}
                      emissiveIntensity={dayMode ? 0 : 1.0}
                    />
                  </mesh>
                  <mesh position={[0.8, 0.6, 1.51]}>
                    <boxGeometry args={[0.6, 0.5, 0.02]} />
                    <meshStandardMaterial 
                      color={dayMode ? "#cbd5e1" : "#fcd34d"} 
                      transparent 
                      opacity={dayMode ? 0.4 : 0.8} 
                      roughness={0.05}
                      metalness={0.9}
                      emissive={dayMode ? "#000000" : "#d97706"}
                      emissiveIntensity={dayMode ? 0 : 1.0}
                    />
                  </mesh>
                  {/* Balcony */}
                  <mesh position={[0, 0.3, 1.55]} castShadow>
                    <boxGeometry args={[2.4, 0.3, 0.02]} />
                    <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
                  </mesh>

                  {showFloorRoof && (
                    <mesh position={[0, 1.05, 0]} receiveShadow castShadow>
                      <boxGeometry args={[3.1, 0.08, 3.1]} />
                      <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        );

      case 'Farm House':
        return (
          <group position={[0, 0, 0]} onClick={handleMeshClick}>
            {/* Porch Floor */}
            <mesh position={[0, 0.08, 0]} receiveShadow castShadow>
              <boxGeometry args={[4.6, 0.15, 3.8]} />
              <meshStandardMaterial color="#78350f" roughness={0.8} /> 
            </mesh>

            {/* Main Cabin */}
            <group position={[0, 0.15, -0.3]}>
              <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.6, 1.5, 2.6]} />
                <meshStandardMaterial color={wallColor} roughness={0.9} />
              </mesh>

              {/* Timber columns */}
              {Array.from({ length: 4 }).map((_, i) => (
                <mesh key={i} position={[-2.1 + i * 1.4, 0.7, 1.6]} castShadow>
                  <cylinderGeometry args={[0.04, 0.04, 1.4]} />
                  <meshStandardMaterial color="#451a03" roughness={0.85} />
                </mesh>
              ))}

              {/* Porch Roof overhang */}
              {roofVisible && (
                <mesh position={[0, 1.55, 0.8]} castShadow>
                  <boxGeometry args={[4.5, 0.05, 1.8]} />
                  <meshStandardMaterial color="#4b5563" roughness={0.7} />
                </mesh>
              )}

              {/* Barn Roof */}
              {roofVisible && (
                <group position={[0, 1.5, 0]}>
                  <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                    <boxGeometry args={[2.0, 2.0, 2.7]} />
                    <meshStandardMaterial color="#7f1d1d" roughness={0.65} />
                  </mesh>
                </group>
              )}

              {renderInteriorDetails()}
            </group>

            {/* Vineyard fences */}
            <group position={[-3.6, 0, -1]}>
              {Array.from({ length: 3 }).map((_, row) => (
                <group key={row} position={[0, 0, row * 0.8]}>
                  <mesh position={[0, 0.2, 0]}>
                    <boxGeometry args={[0.1, 0.4, 1.8]} />
                    <meshStandardMaterial color="#78350f" roughness={0.9} />
                  </mesh>
                  <mesh position={[0, 0.35, 0]} castShadow>
                    <boxGeometry args={[0.15, 0.3, 1.7]} />
                    <meshStandardMaterial color="#166534" roughness={0.9} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        );

      case 'Commercial Building':
        return (
          <group position={[0, 0, 0]} onClick={handleMeshClick}>
            <mesh position={[0, 0.05, 0]} receiveShadow>
              <boxGeometry args={[4.4, 0.1, 4.4]} />
              <meshStandardMaterial color="#1e293b" roughness={0.8} />
            </mesh>

            <group position={[0, 0.1, 0]}>
              <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
                <boxGeometry args={[3.2, 4.3, 3.2]} />
                <meshStandardMaterial color={wallColor} roughness={0.4} metalness={0.9} />
              </mesh>

              {/* Glass curtain walls */}
              {[-1.61, 1.61].map((z) => (
                <mesh key={z} position={[0, 2.25, z]} castShadow>
                  <boxGeometry args={[3.3, 4.2, 0.02]} />
                  <meshPhysicalMaterial 
                    color={dayMode ? "#38bdf8" : "#fcd34d"} 
                    transparent 
                    opacity={0.35} 
                    roughness={0.02} 
                    metalness={0.98} 
                    clearcoat={1.0}
                    emissive={dayMode ? "#000000" : "#d97706"}
                    emissiveIntensity={dayMode ? 0 : 0.8}
                  />
                </mesh>
              ))}
              {[-1.61, 1.61].map((x) => (
                <mesh key={x} position={[x, 2.25, 0]} castShadow>
                  <boxGeometry args={[0.02, 4.2, 3.3]} />
                  <meshPhysicalMaterial 
                    color={dayMode ? "#38bdf8" : "#fcd34d"} 
                    transparent 
                    opacity={0.35} 
                    roughness={0.02} 
                    metalness={0.98} 
                    clearcoat={1.0}
                    emissive={dayMode ? "#000000" : "#d97706"}
                    emissiveIntensity={dayMode ? 0 : 0.8}
                  />
                </mesh>
              ))}

              {/* Steel frame grids */}
              {Array.from({ length: 4 }).map((_, f) => (
                <mesh key={f} position={[0, (f + 1) * 1.05, 0]}>
                  <boxGeometry args={[3.32, 0.05, 3.32]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.15} />
                </mesh>
              ))}

              {/* Solar panels */}
              {roofVisible && (
                <group position={[0, 4.4, 0]}>
                  <mesh receiveShadow>
                    <boxGeometry args={[3.2, 0.05, 3.2]} />
                    <meshStandardMaterial color="#0f172a" roughness={0.8} />
                  </mesh>
                  <mesh position={[0, 0.05, 0]} rotation={[0.08, 0, 0]} castShadow>
                    <boxGeometry args={[2.6, 0.02, 2.0]} />
                    <meshStandardMaterial color="#1e1b4b" roughness={0.05} metalness={0.95} />
                  </mesh>
                </group>
              )}
            </group>
          </group>
        );
    }
  };

  return (
    <group ref={houseRef}>
      {/* If glbUrl is loaded, prioritize rendering the GLB primitive */}
      {glbUrl ? (
        <Suspense fallback={
          <group>
            {renderGarden()}
            {renderArchitecture()}
          </group>
        }>
          <GLBLoader url={glbUrl} />
        </Suspense>
      ) : (
        <group>
          {renderGarden()}
          {renderArchitecture()}
        </group>
      )}

      {/* Measurement Line & Markers */}
      {measureMode && measurePoints.map((pt, idx) => (
        <mesh key={idx} position={pt}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ef4444" depthTest={false} />
        </mesh>
      ))}

      {measureMode && measurePoints.length === 2 && (
        <group>
          <line>
            <bufferGeometry>
              <float32BufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    measurePoints[0].x, measurePoints[0].y, measurePoints[0].z,
                    measurePoints[1].x, measurePoints[1].y, measurePoints[1].z
                  ]),
                  3
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#ef4444" linewidth={3} depthTest={false} />
          </line>
        </group>
      )}
    </group>
  );
}
