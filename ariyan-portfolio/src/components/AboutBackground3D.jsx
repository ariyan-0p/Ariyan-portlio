import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Preload } from '@react-three/drei';

function FloatingShape({ position, rotationSpeed, color, geometryType, scale }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * rotationSpeed.x;
      meshRef.current.rotation.y += delta * rotationSpeed.y;
    }
  });

  // Optimization 1: useMemo ensures geometry isn't re-calculated on every frame
  const geometry = useMemo(() => {
    switch (geometryType) {
      case 'torus':
        // Optimization 2: Reduced segments from [100, 16] to [32, 8] for mobile
        return <torusKnotGeometry args={[1, 0.3, 32, 8]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={[1, 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={[1, 0]} />;
      default:
        return <icosahedronGeometry args={[1, 0]} />;
    }
  }, [geometryType]);

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <meshBasicMaterial
          color={color}
          wireframe={true}
          transparent={true}
          opacity={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function AboutBackground3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      {/* Optimization 3: Limited Device Pixel Ratio and disabled heavy antialiasing */}
      <Canvas 
        camera={{ position: [0, 0, 10] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        
        <FloatingShape 
          position={[-6, 2, -5]} 
          rotationSpeed={{ x: 0.1, y: 0.1 }} 
          color="#06b6d4" 
          geometryType="icosahedron"
          scale={1.5}
        />
        <FloatingShape 
          position={[6, -2, -5]} 
          rotationSpeed={{ x: 0.05, y: 0.08 }} 
          color="#a855f7" 
          geometryType="torus"
          scale={1.2}
        />
        <FloatingShape 
          position={[0, 5, -10]} 
          rotationSpeed={{ x: 0.1, y: 0.05 }} 
          color="#3b82f6" 
          geometryType="icosahedron"
          scale={2}
        />
        <FloatingShape 
          position={[5, 4, -6]} 
          rotationSpeed={{ x: 0.08, y: 0.12 }} 
          color="#2dd4bf" 
          geometryType="octahedron"
          scale={1.3}
        />
        <FloatingShape 
          position={[-7, 6, -8]} 
          rotationSpeed={{ x: 0.06, y: 0.04 }} 
          color="#d946ef" 
          geometryType="tetrahedron"
          scale={1.8}
        />

        <Preload all />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
    </div>
  );
}