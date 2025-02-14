"use client"

import { OrbitControls, Stars } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import type * as THREE from "three"

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

export default function Scene() {
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

