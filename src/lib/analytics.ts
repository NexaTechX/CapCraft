import { supabase } from "./supabase";

export interface AnalyticsSummary {
  totalPosts: number;
  averageEngagement: number;
  topPerformingPosts: {
    id: string;
    text: string;
    likes: number;
    comments: number;
    engagement: number;
  }[];
}

export async function getAnalyticsSummary(
  userId: string,
): Promise<AnalyticsSummary> {
  try {
    // Get saved captions count
    const { data: captionsData, error: captionsError } = await supabase
      .from("saved_captions")
      .select("id, text, created_at")
      .eq("user_id", userId);

    if (captionsError) throw captionsError;

    // If no captions, return empty data
    if (!captionsData || captionsData.length === 0) {
      return {
        totalPosts: 0,
        averageEngagement: 0,
        topPerformingPosts: [],
      };
    }

    // Generate sample engagement data based on actual captions
    const topPerformingPosts = captionsData
      .slice(0, Math.min(captionsData.length, 3))
      .map((caption) => {
        // Generate random engagement metrics
        const likes = Math.floor(Math.random() * 200) + 50;
        const comments = Math.floor(Math.random() * 50) + 5;
        return {
          id: caption.id,
          text: caption.text || "Caption text unavailable",
          likes,
          comments,
          engagement: likes + comments,
        };
      })
      .sort((a, b) => b.engagement - a.engagement); // Sort by engagement

    // Calculate average engagement
    const totalEngagement = topPerformingPosts.reduce(
      (sum, post) => sum + post.engagement,
      0,
    );
    const averageEngagement =
      topPerformingPosts.length > 0
        ? parseFloat(
            (totalEngagement / topPerformingPosts.length / 100).toFixed(1),
          )
        : 0;

    return {
      totalPosts: captionsData.length,
      averageEngagement,
      topPerformingPosts,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    // Return default values if there's an error
    return {
      totalPosts: 0,
      averageEngagement: 0,
      topPerformingPosts: [],
    };
  }
}

export async function getEngagementOverTime(userId: string, days: number = 30) {
  try {
    // Get saved captions to generate realistic data
    const { data: captionsData, error } = await supabase
      .from("saved_captions")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Generate data points for each day
    const data = [];
    const today = new Date();
    const dateMap = new Map();

    // Map captions to their creation dates
    if (captionsData && captionsData.length > 0) {
      captionsData.forEach((caption) => {
        const dateStr = new Date(caption.created_at)
          .toISOString()
          .split("T")[0];
        dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + 1);
      });
    }

    // Generate data for each day
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Use actual caption count for the day if available, otherwise use random data
      const captionCount = dateMap.get(dateStr) || 0;
      const baseEngagement = captionCount * 15; // Base engagement on actual captions
      const randomFactor = Math.floor(Math.random() * 20); // Add some randomness

      data.push({
        date: dateStr,
        engagement: baseEngagement + randomFactor,
        likes: Math.floor((baseEngagement + randomFactor) * 0.7),
        comments: Math.floor((baseEngagement + randomFactor) * 0.3),
      });
    }

    return data;
  } catch (error) {
    console.error("Error generating engagement data:", error);
    // Return empty data on error
    return [];
  }
}

export async function getPlatformPerformance(userId: string) {
  // Sample data for platform performance
  return [
    { name: "Instagram", posts: 40, engagement: 85, followers: 1250 },
    { name: "Twitter", posts: 30, engagement: 60, followers: 850 },
    { name: "Facebook", posts: 20, engagement: 45, followers: 620 },
    { name: "LinkedIn", posts: 10, engagement: 30, followers: 380 },
  ];
}

export async function getContentTypePerformance(userId: string) {
  // Sample data for content type performance
  return [
    { type: "Images", count: 45, engagement: 75 },
    { type: "Videos", count: 25, engagement: 90 },
    { type: "Text", count: 30, engagement: 50 },
  ];
}
