"use client"

import { useRef, useMemo, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { gradientVertexShader, gradientFragmentShader } from "@/lib/shaders/dither"

interface GradientMeshProps {
  colors?: {
    light: [string, string, string]
    dark: [string, string, string]
  }
  speed?: number
}

const defaultColors = {
  light: ["#3b82f6", "#8b5cf6", "#f8fafc"] as [string, string, string],
  dark: ["#1e1b4b", "#4c1d95", "#0f172a"] as [string, string, string],
}

export function GradientMesh({ colors = defaultColors, speed = 0.3 }: GradientMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { resolvedTheme } = useTheme()
  const { viewport, pointer } = useThree()
  const mouseRef = useRef({ x: 0.5, y: 0.5 })

  const uniforms = useMemo(() => ({
    time: { value: 0 },
    color1: { value: new THREE.Color(colors.light[0]) },
    color2: { value: new THREE.Color(colors.light[1]) },
    color3: { value: new THREE.Color(colors.light[2]) },
    speed: { value: speed },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [])

  // Update colors based on theme
  useEffect(() => {
    const themeColors = resolvedTheme === "dark" ? colors.dark : colors.light
    uniforms.color1.value.set(themeColors[0])
    uniforms.color2.value.set(themeColors[1])
    uniforms.color3.value.set(themeColors[2])
  }, [resolvedTheme, colors, uniforms])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // Update time
    uniforms.time.value += delta

    // Smooth mouse following
    mouseRef.current.x += (pointer.x * 0.5 + 0.5 - mouseRef.current.x) * 0.05
    mouseRef.current.y += (pointer.y * 0.5 + 0.5 - mouseRef.current.y) * 0.05
    uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y)
  })

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: gradientVertexShader,
      fragmentShader: gradientFragmentShader,
      uniforms,
      transparent: true,
    })
  }, [uniforms])

  return (
    <mesh
      ref={meshRef}
      scale={[viewport.width * 1.2, viewport.height * 1.2, 1]}
      position={[0, 0, -2]}
      material={shaderMaterial}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  )
}
