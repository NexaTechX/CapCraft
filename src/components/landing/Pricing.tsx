import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "#",
    priceMonthly: "$9",
    description:
      "Perfect for individuals and content creators getting started.",
    features: [
      "100 AI-generated captions/month",
      "Basic image analysis",
      "3 languages",
      "Email support",
      "1 Instagram account",
      "Basic analytics",
    ],
    featured: false,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceMonthly: "$29",
    description: "Ideal for growing businesses and professional creators.",
    features: [
      "Unlimited captions",
      "Advanced AI with custom training",
      "All languages",
      "Priority support",
      "5 Instagram accounts",
      "Advanced analytics",
      "Brand voice customization",
      "Scheduled posting",
      "Team collaboration",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceMonthly: "$99",
    description: "Dedicated support and infrastructure for your company.",
    features: [
      "Everything in Pro",
      "Unlimited Instagram accounts",
      "Custom AI model training",
      "API access",
      "24/7 phone & email support",
      "Custom integrations",
      "Enterprise analytics",
      "Custom contracts",
    ],
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="py-24 sm:py-32" id="pricing">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-base font-semibold leading-7 text-violet-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Pricing
          </motion.h2>
          <motion.p
            className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Choose your perfect plan
          </motion.p>
          <motion.p
            className="mt-6 text-lg leading-8 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Start with a 14-day free trial. No credit card required.
          </motion.p>
        </motion.div>

        <motion.div
          className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 xl:gap-x-12"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              className={`relative overflow-hidden rounded-3xl p-8 ${tier.featured ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white ring-violet-500" : "bg-white ring-gray-200"} shadow-xl transition-all duration-300 hover:scale-105 xl:p-10`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              {tier.featured && (
                <div className="absolute -top-2 -right-2 p-1">
                  <div className="bg-gradient-to-br from-amber-500 to-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                    Popular
                  </div>
                </div>
              )}
              <h3
                className={`text-lg font-semibold leading-8 ${tier.featured ? "text-white" : "text-gray-900"}`}
              >
                {tier.name}
              </h3>
              <p
                className={`mt-4 text-sm leading-6 ${tier.featured ? "text-violet-100" : "text-gray-600"}`}
              >
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span
                  className={`text-4xl font-bold tracking-tight ${tier.featured ? "text-white" : "text-gray-900"}`}
                >
                  {tier.priceMonthly}
                </span>
                <span
                  className={
                    tier.featured ? "text-violet-100" : "text-gray-600"
                  }
                >
                  /month
                </span>
              </p>
              <Button
                variant={tier.featured ? "secondary" : "outline"}
                className={`mt-6 w-full ${tier.featured ? "bg-white text-violet-600 hover:bg-gray-50" : "border-violet-200 hover:bg-violet-50"}`}
                onClick={() => (window.location.href = "/auth")}
              >
                {tier.featured && <Sparkles className="mr-2 h-4 w-4" />}
                Get {tier.name}
              </Button>
              <ul
                role="list"
                className={`mt-8 space-y-3 text-sm leading-6 ${tier.featured ? "text-violet-100" : "text-gray-600"}`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className={`h-6 w-5 flex-none ${tier.featured ? "text-white" : "text-violet-600"}`}
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
