import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import InstagramAccountManager from "@/components/InstagramAccountManager";
import DashboardLayout from "@/components/DashboardLayout";

const SocialAccounts = () => {
  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Social Accounts</h1>
        </div>

        <Card className="p-6 bg-white/50 backdrop-blur-sm border-violet-100/50 shadow-lg shadow-violet-100/20">
          <InstagramAccountManager />
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default SocialAccounts;
