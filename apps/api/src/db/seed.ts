import "dotenv/config"
import { db } from "./index"
import { creditPackages } from "./schemas"

const packages = [
  {
    name: "Starter",
    credits: 5,
    priceInCents: 500, // $5
    sortOrder: 1,
    metadata: {
      description: "Perfect for trying out",
      popular: false,
    },
  },
  {
    name: "Popular",
    credits: 15,
    priceInCents: 1500, // $15
    sortOrder: 2,
    metadata: {
      description: "Most popular choice",
      popular: true,
    },
  },
  {
    name: "Pro",
    credits: 50,
    priceInCents: 4500, // $45 (10% discount)
    sortOrder: 3,
    metadata: {
      description: "Best value - save 10%",
      popular: false,
      savings: "10%",
    },
  },
]

async function seed() {
  console.log("Seeding credit packages...")

  for (const pkg of packages) {
    try {
      await db
        .insert(creditPackages)
        .values({
          name: pkg.name,
          credits: pkg.credits,
          priceInCents: pkg.priceInCents,
          sortOrder: pkg.sortOrder,
          isActive: true,
          metadata: pkg.metadata,
        })
        .onConflictDoNothing()

      console.log(`  ✓ ${pkg.name}: ${pkg.credits} credits for $${pkg.priceInCents / 100}`)
    } catch (error) {
      console.error(`  ✗ Failed to seed ${pkg.name}:`, error)
    }
  }

  console.log("Seeding complete!")
  process.exit(0)
}

seed().catch((error) => {
  console.error("Seed failed:", error)
  process.exit(1)
})
