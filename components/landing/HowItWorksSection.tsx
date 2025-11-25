"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquare, Sparkles, Download, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Describe Your Vision",
    description: "Enter your app name and describe what you want. Be as simple or detailed as you like - our AI understands natural language.",
    gradient: "from-blue-500 to-cyan-500",
    dither: "noise",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "AI Creates Magic",
    description: "Our advanced AI models analyze your input and generate multiple unique logo options tailored to your brand.",
    gradient: "from-purple-500 to-pink-500",
    dither: "bayer",
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Use",
    description: "Pick your favorite, download in high resolution, and use it immediately in your app or website.",
    gradient: "from-orange-500 to-red-500",
    dither: "halftone",
  },
]

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-advance steps
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isVisible])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
            How It Works
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            Three Simple Steps to
            <span className="block text-primary">Your Perfect Logo</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            No complicated tools, no design skills needed. Just describe, generate, and download.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-full w-full h-px bg-border z-0 hidden lg:block">
                    <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                <div
                  className={cn(
                    "relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer",
                    activeStep === index
                      ? "bg-card border-primary/50 shadow-lg shadow-primary/10"
                      : "bg-card/50 border-border/50 hover:border-primary/30",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Step number */}
                  <div
                    className={cn(
                      "absolute -top-4 -left-2 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                      activeStep === index
                        ? "bg-primary text-primary-foreground scale-110"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "inline-flex p-3 rounded-xl bg-gradient-to-br mb-4 transition-transform duration-300",
                      step.gradient,
                      activeStep === index ? "scale-110" : ""
                    )}
                  >
                    <step.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {/* Progress bar for active step */}
                  {activeStep === index && (
                    <div className="mt-4 h-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full bg-gradient-to-r animate-progress",
                          step.gradient
                        )}
                        style={{
                          animation: "progress 4s linear",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile layout */}
          <div className="md:hidden space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={cn(
                  "relative p-6 rounded-2xl border bg-card transition-all duration-500",
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 p-3 rounded-xl bg-gradient-to-br",
                      step.gradient
                    )}
                  >
                    <step.icon className="h-6 w-6 text-white" />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Step {step.number}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS for progress animation */}
      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
