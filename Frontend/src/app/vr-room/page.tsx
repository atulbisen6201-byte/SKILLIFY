'use client'

import { useState, Suspense, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Float, Environment, Sparkles, Text, RoundedBox, Plane, Box, Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import {
  ChevronLeft,
  Glasses,
  Play,
  Info,
  ChevronRight,
  Users,
  Clock,
  Star,
  Briefcase,
  Code,
  Palette,
  TrendingUp,
  X,
  Maximize2,
  MousePointer,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/sidebar'
import { ChatWidget } from '@/components/chat-widget'

const vrRooms = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Experience a day in the life of a software engineer at a top tech company',
    icon: Code,
    duration: '15 min',
    participants: '2.4K',
    rating: 4.9,
    color: '#6366f1',
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Lead product strategy meetings and make critical decisions',
    icon: Briefcase,
    duration: '20 min',
    participants: '1.8K',
    rating: 4.8,
    color: '#8b5cf6',
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    description: 'Design user experiences in a creative studio environment',
    icon: Palette,
    duration: '18 min',
    participants: '1.5K',
    rating: 4.7,
    color: '#ec4899',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze data and build ML models in a research lab',
    icon: TrendingUp,
    duration: '22 min',
    participants: '1.2K',
    rating: 4.9,
    color: '#10b981',
  },
]

// Shared 3D Components
function CameraController({ targetPosition }: { targetPosition: [number, number, number] }) {
  const { camera } = useThree()
  useFrame(() => {
    camera.position.lerp(new THREE.Vector3(...targetPosition), 0.05)
  })
  return null
}

function DatabaseServer({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.8
    }
  })
  return (
    <group ref={groupRef} position={position}>
      <Cylinder args={[0.3, 0.3, 0.25, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.2} />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.25, 16]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#312e81" emissive="#4f46e5" emissiveIntensity={0.4} />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 0.25, 16]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.2} />
      </Cylinder>
    </group>
  )
}

function ProjectWheel({ position = [0, 0, 0] as [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.4
      groupRef.current.rotation.x = state.clock.elapsedTime * 0.2
    }
  })
  return (
    <group ref={groupRef} position={position}>
      <Cylinder args={[0.6, 0.6, 0.08, 12]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#8b5cf6" wireframe emissive="#8b5cf6" emissiveIntensity={0.3} />
      </Cylinder>
    </group>
  )
}

function Desk({ position = [0, 0, 0] as [number, number, number], color = '#374151' }) {
  return (
    <group position={position}>
      {/* Desktop */}
      <RoundedBox args={[2.5, 0.1, 1.2]} position={[0, 0.75, 0]} radius={0.02}>
        <meshStandardMaterial color={color} />
      </RoundedBox>
      {/* Legs */}
      <Box args={[0.1, 0.75, 0.1]} position={[-1.1, 0.375, 0.5]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      <Box args={[0.1, 0.75, 0.1]} position={[1.1, 0.375, 0.5]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      <Box args={[0.1, 0.75, 0.1]} position={[-1.1, 0.375, -0.5]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      <Box args={[0.1, 0.75, 0.1]} position={[1.1, 0.375, -0.5]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
    </group>
  )
}

function Monitor({ position = [0, 0, 0] as [number, number, number], screenColor = '#6366f1' }) {
  return (
    <group position={position}>
      {/* Screen */}
      <RoundedBox args={[1.2, 0.7, 0.05]} position={[0, 0.35, 0]} radius={0.02}>
        <meshStandardMaterial color="#111827" />
      </RoundedBox>
      {/* Screen glow */}
      <Plane args={[1.1, 0.6]} position={[0, 0.35, 0.03]}>
        <meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.3} />
      </Plane>
      {/* Stand */}
      <Box args={[0.1, 0.3, 0.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
      <Box args={[0.4, 0.02, 0.25]} position={[0, -0.14, 0]}>
        <meshStandardMaterial color="#374151" />
      </Box>
    </group>
  )
}

function Chair({ position = [0, 0, 0] as [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <RoundedBox args={[0.5, 0.08, 0.5]} position={[0, 0.45, 0]} radius={0.02}>
        <meshStandardMaterial color="#1f2937" />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[0.5, 0.6, 0.08]} position={[0, 0.75, -0.25]} radius={0.02}>
        <meshStandardMaterial color="#1f2937" />
      </RoundedBox>
      {/* Base */}
      <Cylinder args={[0.03, 0.03, 0.4]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
      {/* Wheels base */}
      <Cylinder args={[0.25, 0.25, 0.03]} position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#374151" />
      </Cylinder>
    </group>
  )
}

function FloatingParticle({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
  })
  
  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </mesh>
  )
}

// Software Engineer Scene
function SoftwareEngineerScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={0.5} intensity={0.8} />
      
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Plane>
      
      {/* Main workstation */}
      <Desk position={[0, 0, 0]} color="#1e293b" />
      <Monitor position={[0, 0.8, -0.3]} screenColor="#6366f1" />
      <Monitor position={[-0.7, 0.8, -0.2]} screenColor="#22c55e" />
      <Chair position={[0, 0, 1]} />
      
      {/* Secondary workstations */}
      <Desk position={[-3, 0, -2]} />
      <Monitor position={[-3, 0.8, -2.3]} screenColor="#f59e0b" />
      <Chair position={[-3, 0, -1]} />
      
      <Desk position={[3, 0, -2]} />
      <Monitor position={[3, 0.8, -2.3]} screenColor="#ec4899" />
      <Chair position={[3, 0, -1]} />
      
      {/* Animated Database Server */}
      <DatabaseServer position={[3, 0.75, -2]} />
      
      {/* Floating code particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <FloatingParticle 
          key={i} 
          position={[(Math.random() - 0.5) * 8, Math.random() * 3 + 1, (Math.random() - 0.5) * 8]} 
          color={['#6366f1', '#22c55e', '#f59e0b'][i % 3]}
        />
      ))}
      
      {/* Floating text labels */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text position={[-2, 2.5, -3]} fontSize={0.3} color="#6366f1">
          {'{ code }'}
        </Text>
      </Float>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text position={[2, 3, -2]} fontSize={0.25} color="#22c55e">
          {'<deploy />'}
        </Text>
      </Float>
      
      <Sparkles count={50} scale={10} size={2} speed={0.3} color="#6366f1" />
      <Environment preset="night" />
      <OrbitControls 
        enableZoom={true} 
        enablePan={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

// Product Manager Scene
function ProductManagerScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#6366f1" />
      <spotLight position={[0, 8, 0]} angle={0.6} penumbra={0.5} intensity={0.8} />
      
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Plane>
      
      {/* Conference table */}
      <RoundedBox args={[4, 0.1, 2]} position={[0, 0.75, 0]} radius={0.05}>
        <meshStandardMaterial color="#1e293b" />
      </RoundedBox>
      
      {/* Animated Project Wheel */}
      <ProjectWheel position={[0, 3.2, 0]} />
      
      {/* Chairs around table */}
      <Chair position={[-1.5, 0, 1.3]} />
      <Chair position={[0, 0, 1.3]} />
      <Chair position={[1.5, 0, 1.3]} />
      <Chair position={[-1.5, 0, -1.3]} />
      <Chair position={[0, 0, -1.3]} />
      <Chair position={[1.5, 0, -1.3]} />
      
      {/* Presentation screen */}
      <RoundedBox args={[3, 1.8, 0.1]} position={[0, 2, -4]} radius={0.05}>
        <meshStandardMaterial color="#111827" />
      </RoundedBox>
      <Plane args={[2.8, 1.6]} position={[0, 2, -3.94]}>
        <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.2} />
      </Plane>
      
      {/* Roadmap visualization */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text position={[0, 2.2, -3.9]} fontSize={0.15} color="#ffffff">
          Q4 ROADMAP
        </Text>
      </Float>
      
      {/* Floating metrics */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[-3, 2.5, 0]}>
          <RoundedBox args={[0.8, 0.5, 0.05]} radius={0.02}>
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
          </RoundedBox>
          <Text position={[0, 0, 0.03]} fontSize={0.12} color="#ffffff">
            +42%
          </Text>
        </group>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[3, 2, 1]}>
          <RoundedBox args={[0.8, 0.5, 0.05]} radius={0.02}>
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.3} />
          </RoundedBox>
          <Text position={[0, 0, 0.03]} fontSize={0.12} color="#ffffff">
            10K DAU
          </Text>
        </group>
      </Float>
      
      <Sparkles count={30} scale={12} size={2} speed={0.2} color="#8b5cf6" />
      <Environment preset="city" />
      <OrbitControls 
        enableZoom={true} 
        enablePan={true}
        minDistance={4}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

// UX Designer Scene
function UXDesignerScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ec4899" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#f59e0b" />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={0.5} intensity={0.8} />
      
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Plane>
      
      {/* Design desk */}
      <Desk position={[0, 0, 0]} color="#1e293b" />
      <Monitor position={[0, 0.8, -0.3]} screenColor="#ec4899" />
      <Chair position={[0, 0, 1]} />
      
      {/* Drawing tablet */}
      <RoundedBox args={[0.6, 0.02, 0.4]} position={[0.8, 0.82, 0.2]} radius={0.01}>
        <meshStandardMaterial color="#374151" />
      </RoundedBox>
      <Plane args={[0.55, 0.35]} position={[0.8, 0.84, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#1f2937" emissive="#ec4899" emissiveIntensity={0.1} />
      </Plane>
      
      {/* Floating design elements */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <group position={[-2, 2, -1]}>
          <RoundedBox args={[0.8, 0.8, 0.05]} radius={0.1}>
            <meshStandardMaterial color="#ec4899" />
          </RoundedBox>
        </group>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <group position={[2.5, 2.5, 0]}>
          <Sphere args={[0.3, 32, 32]}>
            <meshStandardMaterial color="#f59e0b" />
          </Sphere>
        </group>
      </Float>
      
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
        <group position={[-1.5, 3, 1]}>
          <Cylinder args={[0.2, 0.2, 0.4, 32]}>
            <meshStandardMaterial color="#22c55e" />
          </Cylinder>
        </group>
      </Float>
      
      {/* Color palette floating */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <group position={[3, 1.5, -2]}>
          <RoundedBox args={[0.3, 0.3, 0.05]} position={[0, 0, 0]} radius={0.02}>
            <meshStandardMaterial color="#ec4899" />
          </RoundedBox>
          <RoundedBox args={[0.3, 0.3, 0.05]} position={[0.35, 0, 0]} radius={0.02}>
            <meshStandardMaterial color="#8b5cf6" />
          </RoundedBox>
          <RoundedBox args={[0.3, 0.3, 0.05]} position={[0.7, 0, 0]} radius={0.02}>
            <meshStandardMaterial color="#6366f1" />
          </RoundedBox>
        </group>
      </Float>
      
      {/* Wireframe mockup */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.4}>
        <group position={[-3, 2, 0]}>
          <RoundedBox args={[1, 1.5, 0.02]} radius={0.05}>
            <meshStandardMaterial color="#1e293b" wireframe />
          </RoundedBox>
        </group>
      </Float>
      
      <Sparkles count={40} scale={10} size={3} speed={0.4} color="#ec4899" />
      <Environment preset="sunset" />
      <OrbitControls 
        enableZoom={true} 
        enablePan={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

// Data Scientist Scene
function DataScientistScene() {
  const graphRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (graphRef.current) {
      graphRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#10b981" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#06b6d4" />
      <spotLight position={[0, 8, 0]} angle={0.5} penumbra={0.5} intensity={0.8} />
      
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0f172a" />
      </Plane>
      
      {/* Research desk */}
      <Desk position={[0, 0, 0]} color="#1e293b" />
      <Monitor position={[-0.5, 0.8, -0.3]} screenColor="#10b981" />
      <Monitor position={[0.5, 0.8, -0.3]} screenColor="#06b6d4" />
      <Chair position={[0, 0, 1]} />
      
      {/* 3D Data visualization */}
      <group ref={graphRef} position={[-3, 2, 0]}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Box 
            key={i} 
            args={[0.2, 0.3 + Math.random() * 1.5, 0.2]} 
            position={[i * 0.3 - 1, (0.3 + Math.random() * 1.5) / 2, 0]}
          >
            <meshStandardMaterial 
              color={i % 2 === 0 ? '#10b981' : '#06b6d4'} 
              emissive={i % 2 === 0 ? '#10b981' : '#06b6d4'}
              emissiveIntensity={0.3}
            />
          </Box>
        ))}
      </group>
      
      {/* Floating neural network nodes */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group position={[3, 2.5, -1]}>
          <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.15, 16, 16]} position={[0.5, 0.3, 0]}>
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.15, 16, 16]} position={[0.3, -0.4, 0]}>
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.5} />
          </Sphere>
          <Sphere args={[0.15, 16, 16]} position={[-0.3, 0.2, 0]}>
            <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
          </Sphere>
        </group>
      </Float>
      
      {/* Floating equations */}
      <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text position={[2, 3.5, 0]} fontSize={0.2} color="#10b981">
          f(x) = mx + b
        </Text>
      </Float>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text position={[-2, 3, 1]} fontSize={0.18} color="#06b6d4">
          {'∑ (xi - x̄)²'}
        </Text>
      </Float>
      
      {/* Data particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <FloatingParticle 
          key={i} 
          position={[(Math.random() - 0.5) * 10, Math.random() * 4 + 1, (Math.random() - 0.5) * 10]} 
          color={['#10b981', '#06b6d4', '#f59e0b'][i % 3]}
        />
      ))}
      
      <Sparkles count={60} scale={12} size={2} speed={0.3} color="#10b981" />
      <Environment preset="night" />
      <OrbitControls 
        enableZoom={true} 
        enablePan={true}
        minDistance={3}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  )
}

// Scene selector
function CareerScene({ roomId }: { roomId: string }) {
  switch (roomId) {
    case 'software-engineer':
      return <SoftwareEngineerScene />
    case 'product-manager':
      return <ProductManagerScene />
    case 'ux-designer':
      return <UXDesignerScene />
    case 'data-scientist':
      return <DataScientistScene />
    default:
      return <SoftwareEngineerScene />
  }
}

function FloatingBox({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  )
}

function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      <Sparkles count={100} scale={15} size={2} speed={0.4} color="#8b5cf6" />
      
      <FloatingBox position={[-3, 0, 0]} color="#6366f1" />
      <FloatingBox position={[3, 1, -2]} color="#8b5cf6" />
      <FloatingBox position={[0, -1, 2]} color="#ec4899" />
      <FloatingBox position={[2, 2, 1]} color="#10b981" />
      
      <Environment preset="night" />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

const tourSteps: Record<string, Array<{ title: string; text: string; cameraPos: [number, number, number] }>> = {
  'software-engineer': [
    { title: 'Developer Desk', text: 'This is where you write code, compile, and run tests. Dual monitors and IDE setup are essential for productivity.', cameraPos: [-0.5, 1.2, 2.5] },
    { title: 'Server Node cluster', text: 'This is the cloud deployment node where your code is running. Monitoring metrics and system health is key.', cameraPos: [3, 1.5, -2] },
    { title: 'Colleague Workspace', text: 'Collaborate with your teammates, perform code reviews, and pair program on challenging bugs.', cameraPos: [-3, 1.2, -1.8] },
  ],
  'product-manager': [
    { title: 'Conference Table', text: 'This is where you lead sprint planning, design reviews, and align different stakeholder priorities.', cameraPos: [0, 1.5, 2] },
    { title: 'Product Roadmap Screen', text: 'The roadmap shows high-level product goals and timelines for Q4. Keep tabs on feature dependencies.', cameraPos: [0, 1.8, -3.2] },
    { title: 'Backlog Metrics Dashboard', text: 'Review customer metrics, product analytics, and KPIs to plan the next feature priority.', cameraPos: [-3, 2.2, 0.8] },
  ],
  'ux-designer': [
    { title: 'Design Workspace', text: 'This is where you create Figma wireframes, prototype flows, and review typography and color palettes.', cameraPos: [0, 1.2, 2.2] },
    { title: 'Critique Wall', text: 'Conduct design critiques with developers and product managers to iterate on mockups.', cameraPos: [-3, 1.8, 0.8] },
    { title: 'Brand Color Palette Board', text: 'Collect brand elements, UI inspirations, and user research interview highlights.', cameraPos: [3, 1.4, -1.8] },
  ],
  'data-scientist': [
    { title: 'Modeling Cluster', text: 'Train deep learning models, run PyTorch training scripts, and track training loss metrics here.', cameraPos: [0, 1.2, 2.2] },
    { title: '3D Data visualization', text: 'Analyze data distributions, check feature correlations, and build dashboard reports.', cameraPos: [-3, 1.8, 0.8] },
    { title: 'Neural Network Hub', text: 'Read the latest AI papers, write algorithm specs, and document model performance benchmarks.', cameraPos: [3, 2.2, -1] },
  ],
};

export default function VRRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [activeRoom, setActiveRoom] = useState<string | null>(null)
  const [isTourActive, setIsTourActive] = useState(false)
  const [currentTourStep, setCurrentTourStep] = useState(0)

  const handleEnterRoom = (roomId: string) => {
    setActiveRoom(roomId)
  }

  const handleExitRoom = () => {
    setActiveRoom(null)
    setIsTourActive(false)
    setCurrentTourStep(0)
  }

  const activeRoomData = vrRooms.find(r => r.id === activeRoom)
  const roomTourSteps = activeRoom ? tourSteps[activeRoom] || [] : []
  const currentCameraTarget = isTourActive && roomTourSteps[currentTourStep]
    ? roomTourSteps[currentTourStep].cameraPos
    : ([0, 2, 6] as [number, number, number])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Full Screen VR Experience */}
        <AnimatePresence>
          {activeRoom && activeRoomData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background"
            >
              {/* 3D Canvas */}
              <div className="absolute inset-0">
                <Canvas camera={{ position: [0, 2, 6], fov: 60 }}>
                  <Suspense fallback={null}>
                    <CareerScene roomId={activeRoom} />
                    <CameraController targetPosition={currentCameraTarget} />
                  </Suspense>
                </Canvas>
              </div>

              {/* UI Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top bar */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pointer-events-auto"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl backdrop-blur-sm"
                      style={{ backgroundColor: `${activeRoomData.color}30` }}
                    >
                      <activeRoomData.icon className="h-6 w-6" style={{ color: activeRoomData.color }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">{activeRoomData.title}</h2>
                      <p className="text-sm text-muted-foreground">Desktop Preview Mode</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 backdrop-blur-sm bg-background/50">
                      <Maximize2 className="h-4 w-4" />
                      Fullscreen
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleExitRoom}
                      className="backdrop-blur-sm bg-background/50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Bottom controls */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto"
                >
                  <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MousePointer className="h-4 w-4" />
                          <span>Click and drag to look around</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RotateCcw className="h-4 w-4" />
                          <span>Scroll to zoom</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleExitRoom}>
                          Exit Room
                        </Button>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: activeRoomData.color }}
                          onClick={() => {
                            setIsTourActive(true)
                            setCurrentTourStep(0)
                          }}
                        >
                          Start Tour
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tour Guide Panel */}
                <AnimatePresence>
                  {isTourActive && roomTourSteps[currentTourStep] && (
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-80 pointer-events-auto"
                    >
                      <div className="rounded-2xl border border-primary/30 bg-card/90 backdrop-blur-md p-5 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                            Tour Step {currentTourStep + 1} of {roomTourSteps.length}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={() => setIsTourActive(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <h4 className="text-lg font-bold text-foreground">
                          {roomTourSteps[currentTourStep].title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {roomTourSteps[currentTourStep].text}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={currentTourStep === 0}
                            onClick={() => setCurrentTourStep(prev => prev - 1)}
                            className="gap-1"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Back
                          </Button>
                          <Button
                            size="sm"
                            style={{ backgroundColor: activeRoomData.color }}
                            onClick={() => {
                              if (currentTourStep < roomTourSteps.length - 1) {
                                setCurrentTourStep(prev => prev + 1)
                              } else {
                                setIsTourActive(false)
                              }
                            }}
                          >
                            {currentTourStep === roomTourSteps.length - 1 ? 'Finish Tour' : 'Next Step'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Side info panel */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-72 pointer-events-auto"
                >
                  <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 space-y-4">
                    <h3 className="font-semibold">About This Career</h3>
                    <p className="text-sm text-muted-foreground">{activeRoomData.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activeRoomData.duration}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Participants</span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {activeRoomData.participants}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rating</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-3 w-3 fill-current" />
                          {activeRoomData.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-h-screen">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-[50vh] min-h-[400px] overflow-hidden"
          >
            {/* 3D Canvas */}
            <div className="absolute inset-0">
              <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
                <Suspense fallback={null}>
                  <HeroScene />
                </Suspense>
              </Canvas>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

            {/* Content */}
            <div className="relative flex h-full flex-col items-center justify-center p-4 text-center pt-16 lg:pt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm"
              >
                <Glasses className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold sm:text-4xl lg:text-5xl"
              >
                <span className="gradient-text">VR Career Rooms</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 max-w-xl text-muted-foreground"
              >
                Experience your future career in immersive virtual reality. 
                Step into different roles and see what a day in the life looks like.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 flex gap-4"
              >
                <Button 
                  size="lg" 
                  className="gap-2 glow"
                  onClick={() => {
                    const roomToEnter = selectedRoom || 'software-engineer'
                    handleEnterRoom(roomToEnter)
                  }}
                >
                  <Play className="h-4 w-4" />
                  Start VR Experience
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={() => {
                    const element = document.getElementById('how-it-works')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  <Info className="h-4 w-4" />
                  Learn More
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* VR Rooms Grid */}
          <div className="p-4 lg:p-8">
            <div className="mx-auto max-w-7xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold">Explore Career Rooms</h2>
                <p className="text-muted-foreground">
                  Choose a career path and immerse yourself in the experience
                </p>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                {vrRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    onClick={() => setSelectedRoom(room.id)}
                    className={`group cursor-pointer rounded-2xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg ${
                      selectedRoom === room.id ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${room.color}20` }}
                      >
                        <room.icon className="h-7 w-7" style={{ color: room.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {room.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {room.description}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {room.duration}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {room.participants}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            {room.rating}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>

                    {selectedRoom === room.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 border-t border-border pt-4"
                      >
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1 gap-2" 
                            style={{ backgroundColor: room.color }}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEnterRoom(room.id)
                            }}
                          >
                            <Play className="h-4 w-4" />
                            Enter Room
                          </Button>
                          <Button 
                            variant="outline" 
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEnterRoom(room.id)
                              setIsTourActive(true)
                              setCurrentTourStep(0)
                            }}
                          >
                            <Info className="h-4 w-4" />
                            Preview
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Info Section */}
              <motion.div
                id="how-it-works"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="mt-8 rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">How VR Career Rooms Work</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                      Our VR experiences use cutting-edge technology to simulate real workplace environments. 
                      You&apos;ll interact with virtual colleagues, attend meetings, and complete tasks typical 
                      for each role. Compatible with most VR headsets or accessible via desktop preview mode.
                    </p>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div className="rounded-xl bg-card/50 px-6 py-4">
                      <p className="text-2xl font-bold gradient-text">50+</p>
                      <p className="text-xs text-muted-foreground">Career Rooms</p>
                    </div>
                    <div className="rounded-xl bg-card/50 px-6 py-4">
                      <p className="text-2xl font-bold gradient-text">10K+</p>
                      <p className="text-xs text-muted-foreground">VR Sessions</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <ChatWidget />
    </div>
  )
}
