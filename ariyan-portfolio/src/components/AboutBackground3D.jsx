import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';

function FloatingShape({ position, rotationSpeed, color, geometryType, scale }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed.x;
      meshRef.current.rotation.y += delta * rotationSpeed.y;
    }
  });

  // Logic to choose geometry based on prop
  let geometry;
  switch (geometryType) {
    case 'torus':
      geometry = <torusKnotGeometry args={[1, 0.3, 100, 16]} />;
      break;
    case 'icosahedron':
      geometry = <icosahedronGeometry args={[1, 0]} />;
      break;
    case 'octahedron':
       geometry = <octahedronGeometry args={[1, 0]} />;
       break;
    case 'tetrahedron':
       geometry = <tetrahedronGeometry args={[1, 0]} />;
       break;
    default:
      geometry = <icosahedronGeometry args={[1, 0]} />;
  }

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        {/* Wireframe Material for that "Ironman/Blueprint" look */}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          wireframe={true}
          transparent={true}
          opacity={0.15} // Subtle opacity
        />
      </mesh>
    </Float>
  );
}

export default function AboutBackground3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        
        {/* EXISTING SHAPES */}
        <FloatingShape 
          position={[-6, 2, -5]} 
          rotationSpeed={{ x: 0.1, y: 0.1 }} 
          color="#06b6d4" // Cyan
          geometryType="icosahedron"
          scale={1.5}
        />
        <FloatingShape 
          position={[6, -2, -5]} 
          rotationSpeed={{ x: 0.05, y: 0.08 }} 
          color="#a855f7" // Purple
          geometryType="torus"
          scale={1.2}
        />
        <FloatingShape 
          position={[0, 5, -10]} 
          rotationSpeed={{ x: 0.1, y: 0.05 }} 
          color="#3b82f6" // Blue
          geometryType="icosahedron"
          scale={2}
        />

        {/* --- NEW SHAPES ADDED HERE --- */}

        {/* NEW SHAPE 4: Teal Octahedron (Upper Right) */}
        <FloatingShape 
          position={[5, 4, -6]} 
          rotationSpeed={{ x: 0.08, y: 0.12 }} 
          color="#2dd4bf" // Teal
          geometryType="octahedron"
          scale={1.3}
        />

        {/* NEW SHAPE 5: Pink Tetrahedron (Far Upper Left, Distant) */}
        <FloatingShape 
          position={[-7, 6, -8]} 
          rotationSpeed={{ x: 0.06, y: 0.04 }} 
          color="#d946ef" // Pink/Fuschia
          geometryType="tetrahedron"
          scale={1.8}
        />

        <Environment preset="city" />
      </Canvas>
      {/* Gradient Fade to blend with black background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
    </div>
  );
}