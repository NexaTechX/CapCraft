import { motion } from "framer-motion";
import {
  Brain,
  Image,
  Languages,
  Sparkles,
  Clock,
  Instagram,
} from "lucide-react";

const features = [
  {
    name: "AI-Powered Generation",
    description:
      "Create engaging, context-aware captions in seconds using advanced AI that understands your brand voice and audience.",
    icon: Brain,
  },
  {
    name: "Smart Image Analysis",
    description:
      "Upload images and let our AI analyze them to generate perfectly matched captions that describe your visual content.",
    icon: Image,
  },
  {
    name: "Multi-Language Support",
    description:
      "Break language barriers with instant caption translation into multiple languages while maintaining your message's impact.",
    icon: Languages,
  },
  {
    name: "Brand Voice Customization",
    description:
      "Maintain consistent brand voice across all platforms with customizable tone settings and saved brand preferences.",
    icon: Sparkles,
  },
  {
    name: "Schedule & Auto-Post",
    description:
      "Plan ahead by scheduling your posts and let our platform automatically publish them at optimal times.",
    icon: Clock,
  },
  {
    name: "Instagram Integration",
    description:
      "Seamlessly connect your Instagram accounts and publish your captivating content directly from our platform.",
    icon: Instagram,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <div className="py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
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
            Everything you need
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Powerful features for powerful content
          </motion.p>
          <motion.p
            className="mt-6 text-lg leading-8 text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Create, schedule, and manage your social media content with our
            comprehensive suite of AI-powered tools.
          </motion.p>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mt-24 lg:max-w-none lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.name}
              variants={item}
              className="relative overflow-hidden rounded-lg border border-violet-100 bg-white p-8 shadow-lg shadow-violet-100/50 transition-all duration-300 hover:shadow-violet-200/50"
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="bg-violet-50 rounded-xl p-3 w-fit mb-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon className="h-6 w-6 text-violet-600" />
              </motion.div>
              <h3 className="text-lg font-semibold leading-8 text-gray-900 mb-2">
                {feature.name}
              </h3>
              <p className="text-base leading-7 text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
