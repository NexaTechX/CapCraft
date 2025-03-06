import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  BarChart,
  Activity,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import {
  getAnalyticsSummary,
  getEngagementOverTime,
  getPlatformPerformance,
  getContentTypePerformance,
  AnalyticsSummary,
} from "@/lib/analytics";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
} from "recharts";

const Analytics = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [platformData, setPlatformData] = useState<any[]>([]);
  const [contentTypeData, setContentTypeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);

      try {
        // Load all data in parallel
        const [summary, engagement, platforms, contentTypes] =
          await Promise.all([
            getAnalyticsSummary(user.id),
            getEngagementOverTime(user.id),
            getPlatformPerformance(user.id),
            getContentTypePerformance(user.id),
          ]);

        setAnalytics(summary);
        setEngagementData(engagement);
        setPlatformData(platforms);
        setContentTypeData(contentTypes);
      } catch (error) {
        console.error("Error loading analytics data:", error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  return (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading analytics data..." />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
            </TabsList>
          </Tabs>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Captions</p>
                      <h3 className="text-3xl font-bold text-gray-900">
                        {analytics?.totalPosts || 0}
                      </h3>
                      <p className="text-xs text-green-600 mt-1">
                        +12% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-violet-100 rounded-full">
                      <Activity className="h-6 w-6 text-violet-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <h3 className="text-3xl font-bold text-gray-900">
                        {(analytics?.averageEngagement || 0).toFixed(1)}%
                      </h3>
                      <p className="text-xs text-green-600 mt-1">
                        +5.2% from last month
                      </p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <TrendingUp className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Followers</p>
                      <h3 className="text-3xl font-bold text-gray-900">
                        2,845
                      </h3>
                      <p className="text-xs text-green-600 mt-1">
                        +124 new followers
                      </p>
                    </div>
                    <div className="p-3 bg-pink-100 rounded-full">
                      <Users className="h-6 w-6 text-pink-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Posts</p>
                      <h3 className="text-3xl font-bold text-gray-900">12</h3>
                      <p className="text-xs text-blue-600 mt-1">
                        Next: Today, 5:30 PM
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Engagement Over Time
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart
                        data={engagementData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" stroke="#888" fontSize={12} />
                        <YAxis stroke="#888" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          }}
                          labelStyle={{ fontWeight: "bold" }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="engagement"
                          stroke="#8884d8"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top Performing Captions
                  </h3>
                  <div className="space-y-4">
                    {analytics?.topPerformingPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-violet-200 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                      >
                        <p className="text-sm">{post.text}</p>
                        <div className="mt-2 text-sm text-gray-600 flex gap-4">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-red-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                clipRule="evenodd"
                                fillRule="evenodd"
                              ></path>
                            </svg>
                            {post.likes} likes
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path>
                              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                            </svg>
                            {post.comments} comments
                          </span>
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1 text-green-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                            </svg>
                            {post.engagement} total
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Engagement Metrics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={engagementData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#8884d8"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="likes"
                      stroke="#ff7300"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="#82ca9d"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Content Performance
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={contentTypeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="type" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="count"
                      name="Number of Posts"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="engagement"
                      name="Engagement Score"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Platform Performance
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={platformData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#888" fontSize={12} />
                    <YAxis stroke="#888" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="posts"
                      name="Number of Posts"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="engagement"
                      name="Engagement Score"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="followers"
                      name="Followers"
                      fill="#ff7300"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabsContent>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
