"use client"

import { useMemo, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { useTheme } from "next-themes"
import { Effect } from "postprocessing"
import { EffectComposer, EffectPass, RenderPass } from "postprocessing"
import * as THREE from "three"
import { ditherFragmentShader } from "@/lib/shaders/dither"

// Custom dither effect class for postprocessing
class DitherEffectImpl extends Effect {
  constructor({
    ditherMode = 1, // 0: bayer, 1: halftone, 2: noise
    ditherStrength = 0.6,
    ditherScale = 80,
    themeMode = 0,
    primaryColor = new THREE.Color("#000000"),
    secondaryColor = new THREE.Color("#ffffff"),
  } = {}) {
    super("DitherEffect", ditherFragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["resolution", new THREE.Uniform(new THREE.Vector2(1920, 1080))],
        ["ditherMode", new THREE.Uniform(ditherMode)],
        ["ditherStrength", new THREE.Uniform(ditherStrength)],
        ["ditherScale", new THREE.Uniform(ditherScale)],
        ["time", new THREE.Uniform(0)],
        ["themeMode", new THREE.Uniform(themeMode)],
        ["primaryColor", new THREE.Uniform(primaryColor)],
        ["secondaryColor", new THREE.Uniform(secondaryColor)],
      ]),
    })
  }

  update(_renderer: THREE.WebGLRenderer, _inputBuffer: THREE.WebGLRenderTarget, deltaTime: number) {
    const time = this.uniforms.get("time")
    if (time) {
      time.value += deltaTime
    }
  }
}

interface DitherEffectProps {
  ditherMode?: number
  strength?: number
  scale?: number
  enabled?: boolean
}

export function DitherPostProcessing({
  ditherMode = 1,
  strength = 0.5,
  scale = 80,
  enabled = true,
}: DitherEffectProps) {
  const { gl, scene, camera, size } = useThree()
  const { resolvedTheme } = useTheme()

  const { composer, effect } = useMemo(() => {
    const composer = new EffectComposer(gl)

    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const primaryColor = resolvedTheme === "dark"
      ? new THREE.Color("#f8fafc")
      : new THREE.Color("#0f172a")
    const secondaryColor = resolvedTheme === "dark"
      ? new THREE.Color("#0f172a")
      : new THREE.Color("#f8fafc")

    const effect = new DitherEffectImpl({
      ditherMode,
      ditherStrength: strength,
      ditherScale: scale,
      themeMode: resolvedTheme === "dark" ? 1 : 0,
      primaryColor,
      secondaryColor,
    })

    const effectPass = new EffectPass(camera, effect)
    effectPass.enabled = enabled
    composer.addPass(effectPass)

    return { composer, effect }
  }, [gl, scene, camera, resolvedTheme, ditherMode, strength, scale, enabled])

  // Update resolution
  useEffect(() => {
    composer.setSize(size.width, size.height)
    const resolution = effect.uniforms.get("resolution")
    if (resolution) {
      resolution.value.set(size.width, size.height)
    }
  }, [size, composer, effect])

  // Update theme colors
  useEffect(() => {
    const primaryColor = effect.uniforms.get("primaryColor")
    const secondaryColor = effect.uniforms.get("secondaryColor")
    const themeMode = effect.uniforms.get("themeMode")

    if (primaryColor && secondaryColor && themeMode) {
      if (resolvedTheme === "dark") {
        primaryColor.value.set("#f8fafc")
        secondaryColor.value.set("#0f172a")
        themeMode.value = 1
      } else {
        primaryColor.value.set("#0f172a")
        secondaryColor.value.set("#f8fafc")
        themeMode.value = 0
      }
    }
  }, [resolvedTheme, effect])

  useFrame(() => {
    composer.render()
  }, 1)

  return null
}

// Simplified version without post-processing for mobile
export function SimpleDitherOverlay() {
  const { resolvedTheme } = useTheme()

  return (
    <mesh position={[0, 0, 10]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial
        color={resolvedTheme === "dark" ? "#0f172a" : "#f8fafc"}
        transparent
        opacity={0}
      />
    </mesh>
  )
}
