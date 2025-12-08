"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const CHECKMARK_ICON_BLUE = "/assets/figma/66cbec02adae279d4479c11bcbca347dd4db4a00.svg"
const CHECKMARK_ICON_GREY = "/assets/figma/3608cacbefa4cfb945effcfa84e4757fbfb7a87b.svg"

type PaymentFrequency = "monthly" | "annual"

interface PricingPlan {
    name: string
    price: {
        monthly: string
        annual: string
    }
    perUser?: boolean
    description: string
    features: string[]
    buttonText: string
    highlight?: boolean
    popularLabel?: string
}

const plans: PricingPlan[] = [
    {
        name: "Starter",
        price: {
            monthly: "Free",
            annual: "Free",
        },
        description: "Ideal for small projects",
        buttonText: "Try for free",
        features: [
            "Unlimited personal files",
            "Email support",
            "CSV data export",
            "Basic analytics dashboard",
            "1,000 API calls per month",
        ],
    },
    {
        name: "Professional",
        price: {
            monthly: "$15",
            annual: "$12", // Applied potential discount logic for annual
        },
        perUser: true,
        description: "For freelancers and startsup",
        buttonText: "Select plan",
        highlight: true,
        popularLabel: "MOST POPULAR PLAN",
        features: [
            "All starter features +",
            "Up to 5 user accounts",
            "Team collaboration tools",
            "Custom dashboards",
            "Multiple data export formats",
            "Basic custom integrations",
        ],
    },
    {
        name: "Organization",
        price: {
            monthly: "$30",
            annual: "$25",
        },
        perUser: true,
        description: "For fast-growing businesses",
        buttonText: "Select plan",
        features: [
            "All professional features +",
            "Enterprise security suite",
            "Single Sign-On (SSO)",
            "Custom contract terms",
            "Dedicated phone support",
            "Custom integration support",
            "Compliance tools",
        ],
    },
]

export function PricingSection() {
    const [frequency, setFrequency] = useState<PaymentFrequency>("monthly")

    return (
        <section className="py-24 relative overflow-hidden bg-white dark:bg-transparent" id="pricing">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] dark:text-white"
                    >
                        Plans & Pricing
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-[#4f4f4f] dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Choose the plan that fits your needs. No hidden fees and the flexibility to change anytime.
                    </motion.p>
                </div>

                {/* Payment Toggle */}
                <div className="flex flex-col items-center mb-16 gap-3">
                    <div className="bg-[#e1e1e1] dark:bg-gray-800 p-1 rounded-full flex items-center relative">
                        <button
                            onClick={() => setFrequency("monthly")}
                            className={cn(
                                "px-8 py-2 rounded-full text-[15px] font-medium transition-all duration-300 min-w-[120px]",
                                frequency === "monthly"
                                    ? "bg-white dark:bg-black text-[#1a1a1a] dark:text-white shadow-sm"
                                    : "text-[#1a1a1a] dark:text-gray-400"
                            )}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setFrequency("annual")}
                            className={cn(
                                "px-8 py-2 rounded-full text-[15px] font-medium transition-all duration-300 min-w-[120px]",
                                frequency === "annual"
                                    ? "bg-white dark:bg-black text-[#1a1a1a] dark:text-white shadow-sm"
                                    : "text-[#1a1a1a] dark:text-gray-400"
                            )}
                        >
                            Annual
                        </button>
                    </div>
                    <p className="text-[#1574d2] text-sm font-medium">
                        -15% off on annual payments
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto items-start">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                "relative rounded-[20px] flex flex-col h-full bg-white dark:bg-gray-950",
                                plan.highlight
                                    ? "border-2 border-[#FFC107] shadow-xl z-10 -mt-8 pt-0 overflow-hidden"
                                    : "border border-gray-200 dark:border-gray-800 shadow-lg p-8"
                            )}
                        >
                            {/* Highlight Header */}
                            {plan.highlight && (
                                <div className="bg-[#FFC107] text-black text-xs font-bold tracking-widest text-center py-2.5 uppercase w-full">
                                    {plan.popularLabel}
                                </div>
                            )}

                            <div className={cn("flex flex-col h-full", plan.highlight && "p-8 pt-6")}>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-2 text-[#1a1a1a] dark:text-white">{plan.name}</h3>
                                    <p className="text-[#4f4f4f] dark:text-gray-400 text-sm mb-6">
                                        {plan.description}
                                    </p>

                                    <div className="flex items-baseline gap-1.5">
                                        <span className={cn("font-bold tracking-tight text-[#1a1a1a] dark:text-white",
                                            plan.name === "Starter" ? "text-4xl" : "text-5xl"
                                        )}>
                                            {frequency === "monthly" ? plan.price.monthly : plan.price.annual}
                                        </span>
                                        {plan.perUser && (
                                            <span className="text-lg text-[#1a1a1a] font-medium dark:text-gray-300">
                                                /per user
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 flex-grow mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="shrink-0 pt-0.5">
                                                <img
                                                    src={plan.highlight ? CHECKMARK_ICON_BLUE : CHECKMARK_ICON_GREY}
                                                    alt="check"
                                                    className="w-5 h-5"
                                                />
                                            </div>
                                            <span className={cn("text-[15px]",
                                                i === 0 && plan.highlight ? "font-bold text-[#1a1a1a] dark:text-white" : "font-normal text-[#4f4f4f] dark:text-gray-300"
                                            )}>
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    className={cn(
                                        "w-full py-3.5 rounded-full text-[16px] font-medium transition-all duration-300",
                                        "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] hover:opacity-90"
                                    )}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
