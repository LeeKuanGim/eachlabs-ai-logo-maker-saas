"use client"

import { useEffect, useRef, useState } from "react"
import { Sparkles, Layers, Download, Palette, Zap, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description: "Advanced AI models create unique, professional logos from simple text descriptions. No design expertise required.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Layers,
    title: "Multiple AI Models",
    description: "Choose from different AI models optimized for various styles - minimalist, detailed, or artistic.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Download,
    title: "Instant Downloads",
    description: "Get your logos instantly in high-resolution PNG format, ready for app stores and websites.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Palette,
    title: "Color Intelligence",
    description: "Specify your brand colors and watch AI incorporate them seamlessly into your design.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate professional logos in under 60 seconds. Iterate quickly until you find the perfect design.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Commercial Ready",
    description: "All generated logos are unique and ready for commercial use in your applications.",
    gradient: "from-indigo-500 to-purple-500",
  },
]

export function FeaturesSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = itemRefs.current.indexOf(entry.target as HTMLDivElement)
          if (entry.isIntersecting && index !== -1) {
            setVisibleItems((prev) => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 dither-pattern-noise opacity-30" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
            Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Everything You Need to
            <span className="block text-primary">Create Amazing Logos</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features designed for developers and entrepreneurs who want
            professional results without the hassle.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={(el) => { itemRefs.current[index] = el }}
              className={cn(
                "group relative p-6 md:p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500",
                visibleItems.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Gradient background on hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br",
                  feature.gradient
                )}
              />

              {/* Icon */}
              <div
                className={cn(
                  "inline-flex p-3 rounded-xl bg-gradient-to-br mb-4",
                  feature.gradient
                )}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative corner */}
              <div className="absolute top-4 right-4 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className={cn(
                  "absolute top-0 right-0 w-8 h-px bg-gradient-to-l",
                  feature.gradient
                )} />
                <div className={cn(
                  "absolute top-0 right-0 w-px h-8 bg-gradient-to-b",
                  feature.gradient
                )} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
