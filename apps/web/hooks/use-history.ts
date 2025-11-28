import { useQuery } from "@tanstack/react-query"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002"

export type HistoryItem = {
    id: string
    appName: string
    appFocus: string
    color1: string
    color2: string
    model: string
    status: "queued" | "running" | "succeeded" | "failed"
    images: string[]
    creditsCharged: number
    createdAt: string
}

async function fetchHistory(): Promise<HistoryItem[]> {
    // Mock data for design verification - Generating 15 items
    const baseItems: HistoryItem[] = [
        {
            id: "mock-1",
            appName: "Coffee House",
            appFocus: "Coffee shop",
            color1: "Brown",
            color2: "Cream",
            model: "nano-banana",
            status: "succeeded",
            images: ["https://placehold.co/400x400/3e2723/ffffff?text=Coffee"],
            creditsCharged: 1,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
        {
            id: "mock-2",
            appName: "TechStart",
            appFocus: "Technology startup",
            color1: "Blue",
            color2: "Silver",
            model: "seedream-v4",
            status: "succeeded",
            images: [
                "https://placehold.co/400x400/1a237e/ffffff?text=Tech1",
                "https://placehold.co/400x400/1a237e/ffffff?text=Tech2"
            ],
            creditsCharged: 2,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
            id: "mock-3",
            appName: "GreenLeaf",
            appFocus: "Eco-friendly products",
            color1: "Green",
            color2: "White",
            model: "reve-text",
            status: "failed",
            images: [],
            creditsCharged: 0,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
        {
            id: "mock-4",
            appName: "FastDelivery",
            appFocus: "Delivery service",
            color1: "Red",
            color2: "Yellow",
            model: "nano-banana",
            status: "running",
            images: [],
            creditsCharged: 1,
            createdAt: new Date().toISOString(),
        }
    ]

    // Generate more items to reach 15
    const extraItems: HistoryItem[] = Array.from({ length: 11 }).map((_, i) => ({
        id: `mock-extra-${i}`,
        appName: `Startup ${i + 1}`,
        appFocus: "Generic startup",
        color1: "Black",
        color2: "White",
        model: "nano-banana",
        status: i % 3 === 0 ? "failed" : "succeeded",
        images: i % 3 === 0 ? [] : [`https://placehold.co/400x400/000000/ffffff?text=Logo${i + 1}`],
        creditsCharged: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * (24 * (i + 2))).toISOString(),
    }))

    return [...baseItems, ...extraItems]
}

export function useHistory() {
    return useQuery({
        queryKey: ["history"],
        queryFn: fetchHistory,
    })
}
