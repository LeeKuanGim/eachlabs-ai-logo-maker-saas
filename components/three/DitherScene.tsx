"use client"

import { useTheme } from "next-themes"
import { useIsMobile } from "@/hooks/use-mobile"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { GradientMesh } from "./GradientMesh"
import { FloatingLogo } from "./FloatingLogo"

interface DitherSceneProps {
  showLogo?: boolean
  logoPosition?: [number, number, number]
  logoScale?: number
}

export function DitherScene({
  showLogo = true,
  logoPosition = [1.5, 0, 0],
  logoScale = 1,
}: DitherSceneProps) {
  const { resolvedTheme } = useTheme()
  const isMobile = useIsMobile()
  const reducedMotion = useReducedMotion()

  // Theme-based gradient colors
  const gradientColors = {
    light: ["#dbeafe", "#ede9fe", "#fce7f3"] as [string, string, string],
    dark: ["#1e1b4b", "#312e81", "#1e293b"] as [string, string, string],
  }

  // Adjust for mobile
  const mobileLogoPosition: [number, number, number] = isMobile
    ? [0, 0.5, 0]
    : logoPosition
  const mobileLogoScale = isMobile ? logoScale * 0.8 : logoScale

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />

      {/* Gradient background */}
      <GradientMesh
        colors={gradientColors}
        speed={reducedMotion ? 0 : 0.3}
      />

      {/* Floating logo */}
      {showLogo && !reducedMotion && (
        <FloatingLogo
          position={mobileLogoPosition}
          scale={mobileLogoScale}
        />
      )}

      {/* Static logo for reduced motion */}
      {showLogo && reducedMotion && (
        <mesh position={mobileLogoPosition} scale={mobileLogoScale}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={resolvedTheme === "dark" ? "#60a5fa" : "#3b82f6"}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </>
  )
}
