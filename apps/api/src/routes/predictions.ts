import { Hono } from "hono"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "../db"
import { logoGenerations } from "../db/schema"

const EACHLABS_API_URL = "https://api.eachlabs.ai/v1/prediction"

const MODEL_MAP: Record<string, string> = {
  "nano-banana": "nano-banana",
  "seedream-v4": "seedream-v4-text-to-image",
  "reve-text": "reve-text-to-image",
}

const statusMap: Record<string, string> = {
  success: "succeeded",
  failed: "failed",
  running: "running",
  queued: "queued",
}

const DEFAULT_FETCH_TIMEOUT_MS = Number(process.env.EACHLABS_TIMEOUT_MS ?? 30_000)

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function safeJson(response: Response) {
  try {
    return await response.json()
  } catch (error) {
    console.error("Failed to parse provider response:", error)
    return null
  }
}

const requestSchema = z.object({
  appName: z.string().min(2),
  appFocus: z.string().min(2),
  color1: z.string().min(1),
  color2: z.string().min(1),
  model: z.enum(["nano-banana", "seedream-v4", "reve-text"]),
  outputCount: z.union([z.string(), z.number()]).optional(),
})
const paramsSchema = z.object({ id: z.string().min(1) })

export const predictions = new Hono()

predictions.post("/", async (c) => {
  let generationId: string | null = null

  try {
    const body = await c.req.json()
    const parsedBody = requestSchema.safeParse(body)

    if (!parsedBody.success) {
      return c.json(
        { error: "Invalid request body", details: parsedBody.error.format() },
        400
      )
    }

    const { appName, appFocus, color1, color2, model, outputCount } = parsedBody.data
    const apiKey = process.env.EACHLABS_API_KEY

    if (!apiKey) {
      return c.json({ error: "EACHLABS_API_KEY is not set" }, 500)
    }

    const selectedModel = MODEL_MAP[model]
    if (!selectedModel) {
      return c.json({ error: "Invalid model selected" }, 400)
    }

    const prompt = `Design an iOS 16–ready, minimalist, and modern app icon for ${appName}. Use a softly rounded square background with a sophisticated gradient that blends ${color1} and ${color2}. Center a clean, easily recognizable symbol that represents ${appFocus}, with subtle depth via gentle shadow and light effects. If including text, weave the app name or initials in a sleek, highly legible way. The icon must remain crisp and recognizable at every size on a plain white background.`

    const parsedOutputCount = Number.parseInt(`${outputCount ?? 1}`, 10)
    const outputCountValue = Number.isFinite(parsedOutputCount)
      ? Math.max(1, parsedOutputCount)
      : 1

    try {
      const [record] = await db
        .insert(logoGenerations)
        .values({
          appName,
          appFocus,
          color1,
          color2,
          model: selectedModel,
          outputCount: outputCountValue,
          prompt,
          status: "running",
        })
        .returning({ id: logoGenerations.id })

      generationId = record?.id ?? null
    } catch (error) {
      console.error("Failed to persist generation request:", error)
    }

    let input: Record<string, unknown> = {
      prompt,
      num_images: outputCountValue,
      sync_mode: false,
    }

    if (selectedModel === "nano-banana") {
      input = {
        ...input,
        output_format: "png",
        aspect_ratio: "1:1",
        limit_generations: true,
      }
    } else if (selectedModel === "seedream-v4-text-to-image") {
      input = {
        ...input,
        image_size: "square_hd",
        enable_safety_checker: true,
      }
    } else if (selectedModel === "reve-text-to-image") {
      input = {
        ...input,
        aspect_ratio: "1:1",
        output_format: "png",
      }
    }

    const response = await fetchWithTimeout(`${EACHLABS_API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: selectedModel,
        version: "0.0.1",
        input,
      }),
    }).catch((error) => {
      console.error("Prediction request failed:", error)
      return null
    })

    if (!response) {
      if (generationId) {
        try {
          await db
            .update(logoGenerations)
            .set({
              status: "failed",
              error: "Failed to reach provider",
              updatedAt: new Date(),
            })
            .where(eq(logoGenerations.id, generationId))
        } catch (dbError) {
          console.error("Failed to update generation status:", dbError)
        }
      }

      return c.json({ error: "Failed to reach provider" }, 502)
    }

    const prediction = await safeJson(response)

    if (!prediction) {
      if (generationId) {
        try {
          await db
            .update(logoGenerations)
            .set({
              status: "failed",
              error: "Invalid provider response",
              updatedAt: new Date(),
            })
            .where(eq(logoGenerations.id, generationId))
        } catch (dbError) {
          console.error("Failed to update generation status:", dbError)
        }
      }

      return c.json({ error: "Invalid provider response" }, 502)
    }

    if (!response.ok) {
      if (generationId) {
        try {
          await db
            .update(logoGenerations)
            .set({
              status: "failed",
              error: prediction?.message || "Failed to create prediction",
              updatedAt: new Date(),
            })
            .where(eq(logoGenerations.id, generationId))
        } catch (dbError) {
          console.error("Failed to update generation status:", dbError)
        }
      }

      return c.json(
        { error: prediction?.message || "Failed to create prediction" },
        response.status
      )
    }

    const providerPredictionId = prediction?.id ?? prediction?.prediction?.id ?? generationId
    const imagesCandidate = prediction?.output ?? prediction?.images
    const imageList = Array.isArray(imagesCandidate)
      ? imagesCandidate.map((item: unknown) => (typeof item === "string" ? item : JSON.stringify(item)))
      : []

    if (generationId) {
      try {
        await db
          .update(logoGenerations)
          .set({
            status: "succeeded",
            providerPredictionId,
            images: imageList,
            providerResponse: prediction,
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.id, generationId))
      } catch (dbError) {
        console.error("Failed to update generation status:", dbError)
      }
    }

    return c.json({ predictionID: providerPredictionId, prediction })
  } catch (error) {
    console.error("Prediction error:", error)

    if (generationId) {
      try {
        await db
          .update(logoGenerations)
          .set({
            status: "failed",
            error: "Internal server error",
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.id, generationId))
      } catch (dbError) {
        console.error("Failed to update generation status:", dbError)
      }
    }

    return c.json({ error: "Internal server error" }, 500)
  }
})

predictions.get("/:id", async (c) => {
  try {
    const parsedParams = paramsSchema.safeParse({ id: c.req.param("id") })
    if (!parsedParams.success) {
      return c.json({ error: "Invalid prediction id" }, 400)
    }

    const { id } = parsedParams.data
    const apiKey = process.env.EACHLABS_API_KEY

    if (!apiKey) {
      return c.json({ error: "EACHLABS_API_KEY is not set" }, 500)
    }

    const response = await fetchWithTimeout(`${EACHLABS_API_URL}/${id}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    }).catch((error) => {
      console.error("Prediction fetch failed:", error)
      return null
    })

    if (!response) {
      return c.json({ error: "Failed to reach provider" }, 502)
    }

    const prediction = await safeJson(response)

    if (!prediction) {
      return c.json({ error: "Invalid provider response" }, 502)
    }

    if (response.ok && prediction) {
      const imagesCandidate = prediction?.output ?? prediction?.images
      const imageList = Array.isArray(imagesCandidate)
        ? imagesCandidate.map((item: unknown) => (typeof item === "string" ? item : JSON.stringify(item)))
        : []

      const status = statusMap[prediction.status] ?? "running"

      try {
        await db
          .update(logoGenerations)
          .set({
            status,
            images: imageList,
            providerResponse: prediction,
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.providerPredictionId, id))
      } catch (dbError) {
        console.error("Failed to sync prediction status:", dbError)
      }
    }

    if (!response.ok) {
      return c.json(
        { error: prediction?.message || "Failed to fetch prediction" },
        response.status
      )
    }

    return c.json(prediction)
  } catch (error) {
    console.error("Prediction fetch error:", error)
    return c.json({ error: "Internal server error" }, 500)
  }
})
