"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// Placeholder logo showcase items (would be replaced with real generated logos)
const showcaseLogos = [
  { id: 1, name: "Finance App", colors: ["#3b82f6", "#8b5cf6"] },
  { id: 2, name: "Health Tracker", colors: ["#10b981", "#06b6d4"] },
  { id: 3, name: "Music Player", colors: ["#f43f5e", "#ec4899"] },
  { id: 4, name: "Task Manager", colors: ["#f59e0b", "#f97316"] },
  { id: 5, name: "Social Network", colors: ["#6366f1", "#8b5cf6"] },
  { id: 6, name: "E-commerce", colors: ["#14b8a6", "#22c55e"] },
  { id: 7, name: "Weather App", colors: ["#0ea5e9", "#38bdf8"] },
  { id: 8, name: "Fitness Coach", colors: ["#ef4444", "#f97316"] },
]

export function ShowcaseSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the visibility of items
            showcaseLogos.forEach((_, index) => {
              setTimeout(() => {
                setVisibleItems((prev) => new Set([...prev, index]))
              }, index * 100)
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="showcase" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Dither pattern overlay */}
      <div className="absolute inset-0 dither-pattern-halftone opacity-5" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
            Showcase
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            See What AI Can
            <span className="block text-primary">Create For You</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore examples of logos created with our AI. Each one is unique,
            professional, and ready for use.
          </p>
        </div>

        {/* Logo grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {showcaseLogos.map((logo, index) => (
            <div
              key={logo.id}
              className={cn(
                "group relative aspect-square rounded-2xl overflow-hidden border border-border/50 bg-card transition-all duration-500",
                visibleItems.has(index)
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95",
                hoveredItem === index ? "z-10 scale-105 shadow-2xl" : ""
              )}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Gradient background as placeholder */}
              <div
                className="absolute inset-0 opacity-20 transition-opacity duration-300 group-hover:opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${logo.colors[0]}, ${logo.colors[1]})`,
                }}
              />

              {/* Placeholder logo shape */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-1/2 h-1/2 rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${logo.colors[0]}, ${logo.colors[1]})`,
                    boxShadow: `0 20px 40px -10px ${logo.colors[0]}50`,
                  }}
                >
                  {/* Inner shape */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-1/2 h-1/2 bg-white/30 rounded-lg rotate-45" />
                  </div>
                </div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-sm font-medium">{logo.name}</div>
                  <div className="text-xs text-white/60 mt-1">AI Generated</div>
                </div>
              </div>

              {/* Dither effect on hover */}
              <div className="absolute inset-0 dither-pattern-halftone opacity-0 group-hover:opacity-10 transition-opacity duration-300 mix-blend-overlay" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-2">
            Ready to create your own?
          </p>
          <a
            href="/create"
            className="text-primary font-medium hover:underline"
          >
            Start generating logos →
          </a>
        </div>
      </div>
    </section>
  )
}
