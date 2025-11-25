"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense, useRef, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

interface DitherCanvasProps {
  children: React.ReactNode
  className?: string
}

function CanvasFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
  )
}

export function DitherCanvas({ children, className }: DitherCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  useTheme() // Theme context available for children
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render canvas during SSR
  if (!mounted) {
    return (
      <div ref={containerRef} className={cn("webgl-canvas-container", className)}>
        <CanvasFallback />
      </div>
    )
  }

  // Device pixel ratio - lower on mobile for performance
  const dpr = isMobile ? [0.5, 1] : [1, 2]

  return (
    <div ref={containerRef} className={cn("webgl-canvas-container", className)}>
      <Canvas
        dpr={dpr as [number, number]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        camera={{
          position: [0, 0, 5],
          fov: 75,
          near: 0.1,
          far: 100,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </Canvas>
    </div>
  )
}
