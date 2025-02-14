"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { useEffect, useRef, useState } from "react"
import type * as THREE from "three"
import { Rajdhani } from "next/font/google"

const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })

function MetatronCube() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
      groupRef.current.rotation.z += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {[...Array(13)].map((_, i) => (
        <mesh key={i} position={[Math.sin(((Math.PI * 2) / 13) * i) * 2, Math.cos(((Math.PI * 2) / 13) * i) * 2, 0]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="#00FFFF" emissive="#00FFFF" emissiveIntensity={0.5} />
        </mesh>
      ))}
      {[...Array(13)].map((_, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attachObject={["attributes", "position"]}
              count={2}
              array={
                new Float32Array([
                  Math.sin(((Math.PI * 2) / 13) * i) * 2,
                  Math.cos(((Math.PI * 2) / 13) * i) * 2,
                  0,
                  Math.sin(((Math.PI * 2) / 13) * ((i + 1) % 13)) * 2,
                  Math.cos(((Math.PI * 2) / 13) * ((i + 1) % 13)) * 2,
                  0,
                ])
              }
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00FFFF" linewidth={2} />
        </line>
      ))}
    </group>
  )
}

function ReactiveStars() {
  const { camera } = useThree()
  const starsRef = useRef<THREE.Points>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x = mousePosition.y * 0.05
      starsRef.current.rotation.y = mousePosition.x * 0.05
    }
  })

  return <Stars ref={starsRef} radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
}

function Scene() {
  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ReactiveStars />
      <MetatronCube />
    </>
  )
}

export default function Component() {
  return (
    <div className={`relative w-full h-screen bg-[#0B0B1E] text-white overflow-hidden ${rajdhani.className}`}>
      <div className="absolute inset-0 bg-[url('/sacred-geometry-pattern.png')] opacity-10"></div>
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00CED1] to-[#FF1493]">
              The Star Syndicate
            </span>
          </div>
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-[#00CED1]">
                Cosmic Hub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#32CD32]">
                Mystic Lounge
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#8A2BE2]">
                Astral Bazaar
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#FFD700]">
                Ethereal Transmissions
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
        <h1 className="text-6xl font-bold mb-8 max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-r from-[#00CED1] to-[#FF1493]">
          Embark on a Cosmic Journey
        </h1>
        <h2 className="text-xl mb-10 text-[#E6E6FA]">Join the Star Syndicate: Where Mysticism Meets the Cosmos</h2>
        <div className="flex justify-center space-x-4">
          <button className="bg-gradient-to-r from-[#00CED1] to-[#4B0082] text-white font-bold py-3 px-6 rounded-full hover:opacity-80 transition duration-300">
            Begin Your Odyssey
          </button>
          <button className="bg-transparent border-2 border-[#FF1493] text-[#FF1493] font-bold py-3 px-6 rounded-full hover:bg-[#FF1493] hover:text-white transition duration-300">
            Explore Cosmic Corsairs
          </button>
        </div>
      </div>
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 60 }} className="absolute inset-0">
        <Scene />
      </Canvas>
    </div>
  )
}

