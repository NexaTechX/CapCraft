import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getScheduledPosts, cancelScheduledPost } from "@/lib/scheduling";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  Trash2,
  Instagram,
} from "lucide-react";

const SchedulePage = () => {
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [activeTab, setActiveTab] = useState("calendar");
  const { toast } = useToast();

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const posts = await getScheduledPosts(user.id);
      setScheduledPosts(posts);
    } catch (error) {
      console.error("Error loading scheduled posts:", error);
      toast({
        title: "Error",
        description: "Failed to load scheduled posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPost = async (postId: string) => {
    try {
      await cancelScheduledPost(postId);
      await loadScheduledPosts();
      toast({
        title: "Success",
        description: "Post has been canceled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel post",
        variant: "destructive",
      });
    }
  };

  // Group posts by date for calendar view
  const postsByDate = scheduledPosts.reduce(
    (acc, post) => {
      const date = new Date(post.scheduled_time).toDateString();
      if (!acc[date]) acc[date] = [];
      acc[date].push(post);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Get posts for the selected date
  const selectedDatePosts = selectedDate
    ? postsByDate[selectedDate.toDateString()] || []
    : [];

  // Get dates that have posts for calendar highlighting
  const datesWithPosts = Object.keys(postsByDate).map(
    (dateStr) => new Date(dateStr),
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Post Schedule</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="calendar" className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4 md:col-span-1">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    booked: datesWithPosts,
                  }}
                  modifiersStyles={{
                    booked: {
                      fontWeight: "bold",
                      backgroundColor: "rgba(124, 58, 237, 0.1)",
                      color: "#7c3aed",
                      borderRadius: "0.25rem",
                    },
                  }}
                />
              </Card>

              <Card className="p-4 md:col-span-2">
                <h3 className="text-lg font-medium mb-4">
                  {selectedDate ? (
                    <>Posts for {selectedDate.toLocaleDateString()}</>
                  ) : (
                    "Select a date to view scheduled posts"
                  )}
                </h3>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner
                      size="sm"
                      text="Loading scheduled posts..."
                    />
                  </div>
                ) : selectedDatePosts.length > 0 ? (
                  <div className="space-y-4">
                    {selectedDatePosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="p-4 border-violet-100/50">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="bg-violet-50 text-violet-700 border-violet-200"
                              >
                                {new Date(
                                  post.scheduled_time,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-indigo-50 text-indigo-700 border-indigo-200"
                              >
                                <Instagram className="h-3 w-3 mr-1" />
                                Instagram
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-1"
                              onClick={() => handleCancelPost(post.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">
                            {post.saved_captions?.text ||
                              "Caption not available"}
                          </p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No posts scheduled for this date</p>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Upcoming Posts</h3>

              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="sm" text="Loading scheduled posts..." />
                </div>
              ) : scheduledPosts.length > 0 ? (
                <div className="space-y-4">
                  {scheduledPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-4 border-violet-100/50">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge
                                variant="outline"
                                className="bg-violet-50 text-violet-700 border-violet-200"
                              >
                                {new Date(
                                  post.scheduled_time,
                                ).toLocaleDateString()}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-violet-50 text-violet-700 border-violet-200"
                              >
                                {new Date(
                                  post.scheduled_time,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="bg-indigo-50 text-indigo-700 border-indigo-200"
                              >
                                <Instagram className="h-3 w-3 mr-1" />
                                Instagram
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700">
                              {post.saved_captions?.text ||
                                "Caption not available"}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-1"
                            onClick={() => handleCancelPost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No upcoming scheduled posts</p>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SchedulePage;
