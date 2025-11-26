"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import { Loader2, Wand2, Download, FileText, Image as ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RainbowButton } from "@/components/ui/rainbow-button"

const formSchema = z.object({
  appName: z.string().min(2, {
    message: "App name must be at least 2 characters.",
  }),
  appFocus: z.string().min(3, {
    message: "App focus must be at least 3 characters.",
  }),
  color1: z.string().min(2, {
    message: "Please enter a color.",
  }),
  color2: z.string().min(2, {
    message: "Please enter a second color.",
  }),
  model: z.string({ message: "Please select a model." }).min(1, {
    message: "Please select a model.",
  }),
  outputCount: z.string({ message: "Please choose an output count." }).min(1, {
    message: "Please choose an output count.",
  }),
})

// Basic color mapping for Turkish color names to CSS values for preview
const colorMap: Record<string, string> = {
  turkuaz: "turquoise",
  "safir yesil": "#0F52BA", // Approximation
  kirmizi: "red",
  mavi: "blue",
  yesil: "green",
  sari: "yellow",
  mor: "purple",
  turuncu: "orange",
  siyah: "black",
  beyaz: "white",
  gri: "gray",
  pembe: "pink",
  lacivert: "navy",
  bordo: "maroon",
}

const getColorValue = (val: string) => {
  if (!val) return "transparent"
  const lower = val.toLowerCase()
  if (colorMap[lower]) return colorMap[lower]
  return val // Return as is (hex, rgb, or valid css name)
}

export function LogoMaker() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [generationCount, setGenerationCount] = useState<number>(0)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      appName: "Acme Finance",
      appFocus: "Rocket wallet",
      color1: "Turquoise",
      color2: "Emerald",
      model: "nano-banana",
      outputCount: "2",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setGeneratedImages([])
    setGenerationCount(parseInt(values.outputCount))
    const startTime = Date.now()
    const maxPollDurationMs = 5 * 60 * 1000

    try {
      const createRes = await fetch(`${apiBaseUrl}/api/predictions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!createRes.ok) {
        throw new Error("Failed to start generation")
      }

      const { predictionID } = await createRes.json()

      while (true) {
        if (Date.now() - startTime > maxPollDurationMs) {
          console.error("Generation timed out after 5 minutes")
          setIsLoading(false)
          break
        }

        await new Promise((resolve) => setTimeout(resolve, 2000))

        const pollRes = await fetch(`${apiBaseUrl}/api/predictions/${predictionID}`)
        if (!pollRes.ok) continue

        const result = await pollRes.json()

        if (result.status === "success") {
          const output = Array.isArray(result.output)
            ? result.output
            : [result.output]
          setGeneratedImages(output)
          setIsLoading(false)
          break
        } else if (result.status === "failed" || result.status === "error") {
          console.error("Generation failed", result)
          setIsLoading(false)
          break
        }
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="shadow-xl border-0">
        <CardHeader className="space-y-1 pb-8">
          <CardTitle className="text-xl font-bold">AI Logo Maker</CardTitle>
          <CardDescription>
            Quickly design a modern, app-store-ready logo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">App Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g. PixelPilot" 
                            {...field} 
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1" 
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                            <FileText className="h-5 w-5" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">App Focus</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g. Flying rocket, Wallet" 
                            {...field} 
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1" 
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Color 1</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="e.g. Turquoise" 
                            {...field} 
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1" 
                          />
                          <div 
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm border shadow-sm"
                            style={{ backgroundColor: getColorValue(field.value) }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Color 2</FormLabel>
                      <FormControl>
                         <div className="relative">
                          <Input 
                            placeholder="e.g. Purple" 
                            {...field} 
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1" 
                          />
                          <div 
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm border shadow-sm"
                            style={{ backgroundColor: getColorValue(field.value) }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input/60 focus:ring-1">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nano-banana">Nano Banana</SelectItem>
                          <SelectItem value="seedream-v4">
                            Seedream v4
                          </SelectItem>
                          <SelectItem value="reve-text">Reve Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="outputCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Output Count</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input/60 focus:ring-1">
                            <SelectValue placeholder="Select a count" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Image</SelectItem>
                          <SelectItem value="2">2 Images</SelectItem>
                          <SelectItem value="3">3 Images</SelectItem>
                          <SelectItem value="4">4 Images</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <RainbowButton type="submit" className="w-full h-12 rounded-xl text-base font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Logo
                  </>
                )}
              </RainbowButton>
            </form>
          </Form>
        </CardContent>

        {/* Loading State or Result */}
        {(isLoading || generatedImages.length > 0) && (
          <CardFooter className="flex flex-col items-start gap-4 pt-8">
            <div className="w-full space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                {isLoading ? "Generating..." : "Generated Logos:"}
              </h3>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-8">
                  {Array.from({ length: generationCount }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-[2rem] bg-muted animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-8">
                  {generatedImages.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square rounded-[2rem] overflow-hidden border bg-white/50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                       <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-10 pointer-events-none" />
                      <Image
                        src={img}
                        alt={`Generated logo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                        <Button variant="secondary" size="sm" className="rounded-full" asChild>
                          <a href={img} download target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
