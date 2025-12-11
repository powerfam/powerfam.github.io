'use client';

import { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface TagData {
  tag: string;
  count: number;
  size: number;
}

interface BubbleProps {
  position: [number, number, number];
  tag: string;
  size: number;
  color: string;
  onClick: () => void;
  isDarkMode: boolean;
  index: number;
}

// 개별 3D 버블 컴포넌트
function Bubble({ position, tag, size, color, onClick, isDarkMode, index }: BubbleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const initialPosition = useRef(position);
  const time = useRef(Math.random() * 100);

  // 버블 부유 애니메이션
  useFrame((state, delta) => {
    if (meshRef.current) {
      time.current += delta;

      // 부드러운 부유 효과 (각 버블마다 다른 주파수)
      const floatY = Math.sin(time.current * (0.4 + index * 0.05)) * 0.15;
      const floatX = Math.sin(time.current * (0.3 + index * 0.03)) * 0.1;
      const floatZ = Math.cos(time.current * (0.35 + index * 0.04)) * 0.08;

      meshRef.current.position.x = initialPosition.current[0] + floatX;
      meshRef.current.position.y = initialPosition.current[1] + floatY;
      meshRef.current.position.z = initialPosition.current[2] + floatZ;

      // hover 시 스케일 변화
      const targetScale = hovered ? size * 1.3 : size;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.85}
          roughness={0.1}
          metalness={0.2}
          distort={hovered ? 0.4 : 0.2}
          speed={2}
          envMapIntensity={1}
        />

        {/* 내부 광택 효과를 위한 작은 구체 */}
        <mesh scale={0.85}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.3}
            roughness={0.0}
            metalness={0.8}
          />
        </mesh>

        {/* HTML 태그 라벨 */}
        <Html
          center
          distanceFactor={3}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <div
            className="whitespace-nowrap font-bold text-center px-2 py-1 rounded-lg backdrop-blur-sm"
            style={{
              color: isDarkMode ? '#FAF9F5' : '#3B3C36',
              fontSize: `${Math.max(12, size * 14)}px`,
              textShadow: isDarkMode
                ? '0 1px 3px rgba(0,0,0,0.8)'
                : '0 1px 3px rgba(255,255,255,0.8)',
              backgroundColor: isDarkMode
                ? 'rgba(59, 60, 54, 0.5)'
                : 'rgba(250, 249, 245, 0.5)',
              transform: hovered ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
          >
            {tag}
          </div>
        </Html>
      </mesh>
    </group>
  );
}

// 마우스 따라다니는 조명
function MovingLight() {
  const light = useRef<THREE.PointLight>(null);
  const { mouse, viewport } = useThree();

  useFrame(() => {
    if (light.current) {
      light.current.position.x = (mouse.x * viewport.width) / 2;
      light.current.position.y = (mouse.y * viewport.height) / 2;
    }
  });

  return <pointLight ref={light} intensity={50} color="#D99058" distance={15} />;
}

// 배경 파티클
function BackgroundParticles({ count = 100, isDarkMode }: { count?: number; isDarkMode: boolean }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  const ref = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={isDarkMode ? '#D99058' : '#826644'}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// 3D 버블 클라우드 Scene
function BubbleScene({
  tagCounts,
  onTagClick,
  isDarkMode
}: {
  tagCounts: TagData[];
  onTagClick: (tag: string) => void;
  isDarkMode: boolean;
}) {
  // 버블 위치 계산 (3D 구형 분포)
  const bubbles = useMemo(() => {
    const result: Array<{
      position: [number, number, number];
      tag: string;
      size: number;
      color: string;
    }> = [];

    // 색상 팔레트
    const colors = isDarkMode
      ? ['#D99058', '#E5A470', '#F0B888', '#A67C52', '#B8956A', '#CD8B5C']
      : ['#826644', '#D99058', '#A67C52', '#C17D4A', '#8B7355', '#B8956A'];

    const totalTags = tagCounts.length;

    tagCounts.forEach((item, index) => {
      // 피보나치 구체 분포 (균등하게 3D 공간에 배치)
      const phi = Math.acos(1 - 2 * (index + 0.5) / totalTags);
      const theta = Math.PI * (1 + Math.sqrt(5)) * index;

      // 반경 조절 (태그 수에 따라)
      const baseRadius = totalTags > 15 ? 4 : totalTags > 8 ? 3.5 : 3;

      const x = baseRadius * Math.sin(phi) * Math.cos(theta);
      const y = baseRadius * Math.sin(phi) * Math.sin(theta);
      const z = baseRadius * Math.cos(phi);

      // 크기 계산 (0.4 ~ 1.0)
      const maxCount = Math.max(...tagCounts.map(t => t.count));
      const normalizedSize = 0.4 + (item.count / maxCount) * 0.6;

      // 해시 기반 색상 선택
      let hash = 0;
      for (let i = 0; i < item.tag.length; i++) {
        hash = item.tag.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colorIndex = Math.abs(hash) % colors.length;

      result.push({
        position: [x, y, z],
        tag: item.tag,
        size: normalizedSize,
        color: colors[colorIndex],
      });
    });

    return result;
  }, [tagCounts, isDarkMode]);

  return (
    <>
      {/* 환경 조명 */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#D99058" />
      <MovingLight />

      {/* 배경 파티클 */}
      <BackgroundParticles isDarkMode={isDarkMode} />

      {/* 버블들 */}
      {bubbles.map((bubble, index) => (
        <Float
          key={bubble.tag}
          speed={1 + index * 0.1}
          rotationIntensity={0.1}
          floatIntensity={0.2}
        >
          <Bubble
            position={bubble.position}
            tag={bubble.tag}
            size={bubble.size}
            color={bubble.color}
            onClick={() => onTagClick(bubble.tag)}
            isDarkMode={isDarkMode}
            index={index}
          />
        </Float>
      ))}

      {/* 카메라 컨트롤 */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={5}
        maxDistance={12}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

// 로딩 컴포넌트
function LoadingFallback({ isDarkMode }: { isDarkMode: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={isDarkMode ? '#D99058' : '#826644'}
        wireframe
      />
    </mesh>
  );
}

// 메인 3D 버블 클라우드 컴포넌트
export default function BubbleCloud3D({
  tagCounts,
  onTagClick,
  isDarkMode,
}: {
  tagCounts: TagData[];
  onTagClick: (tag: string) => void;
  isDarkMode: boolean;
}) {
  const [isClient, setIsClient] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setIsClient(true);

    // WebGL 지원 확인
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(!!gl);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[500px] md:h-[700px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: isDarkMode ? 'rgba(59, 60, 54, 0.3)' : 'rgba(250, 249, 245, 0.5)' }}>
        <div className="text-center">
          <div
            className="w-20 h-20 mx-auto rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--menu-main)', opacity: 0.5 }}
          />
          <p className="mt-4 opacity-70">3D 버블 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!hasWebGL) {
    return (
      <div className="w-full h-[500px] md:h-[700px] flex items-center justify-center rounded-2xl" style={{ backgroundColor: isDarkMode ? 'rgba(59, 60, 54, 0.3)' : 'rgba(250, 249, 245, 0.5)' }}>
        <div className="text-center">
          <p className="opacity-70">WebGL을 지원하지 않는 브라우저입니다.</p>
          <p className="opacity-50 text-sm mt-2">2D 모드로 전환해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-[500px] md:h-[700px] rounded-2xl overflow-hidden relative"
      style={{
        backgroundColor: isDarkMode ? 'rgba(59, 60, 54, 0.3)' : 'rgba(250, 249, 245, 0.5)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={<LoadingFallback isDarkMode={isDarkMode} />}>
          <BubbleScene
            tagCounts={tagCounts}
            onTagClick={onTagClick}
            isDarkMode={isDarkMode}
          />
        </Suspense>
      </Canvas>

      {/* 조작 힌트 */}
      <div
        className="absolute bottom-4 left-4 right-4 text-center text-xs opacity-50 pointer-events-none"
        style={{ color: isDarkMode ? '#FAF9F5' : '#3B3C36' }}
      >
        드래그: 회전 • 스크롤: 확대/축소 • 버블 클릭: 태그 선택
      </div>
    </div>
  );
}
