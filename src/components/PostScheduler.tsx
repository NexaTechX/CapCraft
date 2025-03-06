import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarDays, Clock, Send, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  schedulePost,
  getScheduledPosts,
  cancelScheduledPost,
} from "@/lib/scheduling";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";

interface PostSchedulerProps {
  captionId?: string;
  captionText?: string;
  onSchedule?: (date: Date) => void;
  onPostNow?: () => void;
}

export default function PostScheduler({
  captionId,
  captionText,
  onSchedule,
  onPostNow,
}: PostSchedulerProps) {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [loading, setLoading] = useState(false);
  const [postingNow, setPostingNow] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("schedule");

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const posts = await getScheduledPosts(user.id);
      setScheduledPosts(posts);
    } catch (error) {
      console.error("Error loading scheduled posts:", error);
    }
  };

  const handleSchedule = async () => {
    if (!date || !captionId) {
      toast({
        title: "Error",
        description: "Please select a date and caption",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const [hours, minutes] = time.split(":").map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes);

      await schedulePost(captionId, scheduledDate);
      onSchedule?.(scheduledDate);

      toast({
        title: "Success",
        description: `Post scheduled for ${scheduledDate.toLocaleString()}`,
      });

      // Reload scheduled posts
      await loadScheduledPosts();
      setActiveTab("upcoming");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostNow = async () => {
    if (!captionId) {
      toast({
        title: "Error",
        description: "No caption selected",
        variant: "destructive",
      });
      return;
    }

    try {
      setPostingNow(true);
      // Simulate posting
      await new Promise((resolve) => setTimeout(resolve, 1500));

      onPostNow?.();
      toast({
        title: "Success",
        description: "Caption posted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post caption",
        variant: "destructive",
      });
    } finally {
      setPostingNow(false);
    }
  };

  const handleCancelScheduled = async (postId: string) => {
    try {
      await cancelScheduledPost(postId);
      await loadScheduledPosts();
      toast({
        title: "Success",
        description: "Scheduled post cancelled",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel scheduled post",
        variant: "destructive",
      });
    }
  };

  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      timeSlots.push(
        `${i.toString().padStart(2, "0")}:${j.toString().padStart(2, "0")}`,
      );
    }
  }

  return (
    <Card className="p-4 bg-white shadow-sm border-violet-100/50">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="schedule">Schedule Post</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {captionText && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-100 text-sm">
              <p className="text-gray-700">{captionText}</p>
            </div>
          )}

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {date ? date.toLocaleDateString() : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>

            <Select value={time} onValueChange={setTime}>
              <SelectTrigger className="w-[180px]">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
              onClick={handleSchedule}
              disabled={!date || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Schedule Post
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex-1 border-violet-200 hover:bg-violet-50 text-violet-700"
              onClick={handlePostNow}
              disabled={postingNow}
            >
              {postingNow ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Post Now
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="space-y-4">
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarDays className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No scheduled posts</p>
              </div>
            ) : (
              scheduledPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 border-violet-100/50">
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className="bg-violet-50 text-violet-700 border-violet-200"
                      >
                        {new Date(post.scheduled_time).toLocaleString()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-1"
                        onClick={() => handleCancelScheduled(post.id)}
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {post.saved_captions?.text || "Caption not available"}
                    </p>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
