"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Float, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface FloatingLogoProps {
  position?: [number, number, number]
  scale?: number
}

export function FloatingLogo({ position = [0, 0, 0], scale = 1 }: FloatingLogoProps) {
  const groupRef = useRef<THREE.Group>(null)
  const meshRef = useRef<THREE.Mesh>(null)
  const { resolvedTheme } = useTheme()
  const { pointer } = useThree()

  // Colors based on theme
  const colors = useMemo(() => ({
    light: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#ec4899",
    },
    dark: {
      primary: "#60a5fa",
      secondary: "#a78bfa",
      accent: "#f472b6",
    },
  }), [])

  const currentColors = resolvedTheme === "dark" ? colors.dark : colors.light

  useFrame(() => {
    if (!groupRef.current) return

    // Subtle rotation based on mouse position
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.3,
      0.05
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.2,
      0.05
    )
  })

  return (
    <group ref={groupRef} position={position}>
      <Float
        speed={2}
        rotationIntensity={0.5}
        floatIntensity={0.5}
        floatingRange={[-0.1, 0.1]}
      >
        {/* Main logo shape - abstract geometric form */}
        <mesh ref={meshRef} scale={scale}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color={currentColors.primary}
            speed={2}
            distort={0.3}
            radius={1}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Inner glow */}
        <mesh scale={scale * 0.7}>
          <icosahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial
            color={currentColors.secondary}
            speed={3}
            distort={0.4}
            radius={1}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Core accent */}
        <mesh scale={scale * 0.4}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color={currentColors.accent}
            speed={4}
            distort={0.2}
            radius={1}
            transparent
            opacity={0.8}
            emissive={currentColors.accent}
            emissiveIntensity={resolvedTheme === "dark" ? 0.3 : 0.1}
          />
        </mesh>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <OrbitingParticle
            key={i}
            index={i}
            total={6}
            color={currentColors.secondary}
            radius={1.5 * scale}
          />
        ))}
      </Float>
    </group>
  )
}

interface OrbitingParticleProps {
  index: number
  total: number
  color: string
  radius: number
}

function OrbitingParticle({ index, total, color, radius }: OrbitingParticleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const offset = (index / total) * Math.PI * 2

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime * 0.5 + offset
    meshRef.current.position.x = Math.cos(t) * radius
    meshRef.current.position.y = Math.sin(t * 1.5) * radius * 0.5
    meshRef.current.position.z = Math.sin(t) * radius
  })

  return (
    <mesh ref={meshRef} scale={0.08}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} />
    </mesh>
  )
}
