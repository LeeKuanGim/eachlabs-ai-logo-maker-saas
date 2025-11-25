"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Sample logo placeholders - in production these would be real logos
const sampleLogos = [
  { id: 1, name: "TechFlow", gradient: "from-blue-500 to-cyan-500" },
  { id: 2, name: "Spark", gradient: "from-orange-500 to-red-500" },
  { id: 3, name: "Nexus", gradient: "from-purple-500 to-pink-500" },
  { id: 4, name: "Pulse", gradient: "from-green-500 to-emerald-500" },
  { id: 5, name: "Nova", gradient: "from-violet-500 to-indigo-500" },
  { id: 6, name: "Apex", gradient: "from-yellow-500 to-orange-500" },
  { id: 7, name: "Drift", gradient: "from-teal-500 to-cyan-500" },
  { id: 8, name: "Bloom", gradient: "from-pink-500 to-rose-500" },
  { id: 9, name: "Orbit", gradient: "from-indigo-500 to-blue-500" },
  { id: 10, name: "Flux", gradient: "from-emerald-500 to-teal-500" },
  { id: 11, name: "Zenith", gradient: "from-rose-500 to-pink-500" },
  { id: 12, name: "Prism", gradient: "from-cyan-500 to-blue-500" },
]

interface LogoCardProps {
  logo: typeof sampleLogos[0]
  index: number
}

function LogoCard({ logo, index }: LogoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative w-32 h-32 md:w-40 md:h-40 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        className={cn(
          "w-full h-full rounded-2xl",
          "bg-white/5 dark:bg-white/5 backdrop-blur-sm",
          "border border-white/10 dark:border-white/10",
          "flex items-center justify-center",
          "transition-shadow duration-300",
          isHovered && "shadow-xl shadow-primary/20"
        )}
        animate={{
          rotateX: isHovered ? mousePosition.y * -20 : 0,
          rotateY: isHovered ? mousePosition.x * 20 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Logo Icon */}
        <div
          className={cn(
            "w-16 h-16 md:w-20 md:h-20 rounded-xl",
            "bg-gradient-to-br",
            logo.gradient,
            "flex items-center justify-center",
            "text-white font-bold text-2xl md:text-3xl",
            "shadow-lg"
          )}
          style={{
            transform: isHovered ? "translateZ(30px)" : "translateZ(0px)",
            transition: "transform 0.3s ease",
          }}
        >
          {logo.name.charAt(0)}
        </div>

        {/* Glow effect on hover */}
        {isHovered && (
          <div
            className={cn(
              "absolute inset-0 rounded-2xl opacity-50",
              "bg-gradient-to-br",
              logo.gradient,
              "blur-xl -z-10"
            )}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

interface CarouselColumnProps {
  logos: typeof sampleLogos
  direction: "up" | "down"
  speed?: number
}

function CarouselColumn({ logos, direction, speed = 25 }: CarouselColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Double the logos for seamless loop
  const doubledLogos = [...logos, ...logos]

  return (
    <div
      className="relative h-[500px] md:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        ref={columnRef}
        className="flex flex-col gap-4 md:gap-6"
        animate={{
          y: direction === "up" ? [0, -50 * logos.length * 2.5] : [-50 * logos.length * 2.5, 0],
        }}
        transition={{
          y: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {doubledLogos.map((logo, index) => (
          <LogoCard key={`${logo.id}-${index}`} logo={logo} index={index % logos.length} />
        ))}
      </motion.div>
    </div>
  )
}

export function LogoCarousel() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-[500px] md:h-[600px]" />
  }

  // Split logos into 3 columns
  const column1 = sampleLogos.slice(0, 4)
  const column2 = sampleLogos.slice(4, 8)
  const column3 = sampleLogos.slice(8, 12)

  return (
    <div className="relative w-full h-full">
      {/* Main carousel container with rotation */}
      <div
        className="flex gap-4 md:gap-6 justify-center items-center"
        style={{
          transform: "rotate(-10deg) translateY(-20px)",
          transformOrigin: "center center",
        }}
      >
        <CarouselColumn logos={column1} direction="down" speed={30} />
        <CarouselColumn logos={column2} direction="up" speed={25} />
        <CarouselColumn logos={column3} direction="down" speed={35} />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background via-background/50 to-transparent pointer-events-none z-10" />

      {/* Side fades for better blending */}
      <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </div>
  )
}
