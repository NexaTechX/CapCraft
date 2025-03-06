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
      .select("id")
      .eq("user_id", userId);

    if (captionsError) throw captionsError;

    // Sample data for demo purposes
    // In a real app, this would fetch actual analytics from the database
    return {
      totalPosts: captionsData?.length || 0,
      averageEngagement: 4.2,
      topPerformingPosts: [
        {
          id: "1",
          text: "Exploring new horizons! Just launched our latest collection inspired by coastal adventures. Check it out at the link in bio! #NewCollection #CoastalVibes",
          likes: 245,
          comments: 32,
          engagement: 312,
        },
        {
          id: "2",
          text: "Behind every successful business is a story of passion and perseverance. Today we're celebrating 5 years of bringing you the best products! 🎉 #Anniversary #Milestone",
          likes: 189,
          comments: 47,
          engagement: 267,
        },
        {
          id: "3",
          text: "The perfect blend of style and comfort. Our new premium line is designed for those who never compromise. Limited stock available now! #PremiumQuality #NewArrivals",
          likes: 156,
          comments: 28,
          engagement: 203,
        },
      ],
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
  // This would normally fetch real data from the database
  // For now, we'll generate sample data
  const data = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      engagement: Math.floor(Math.random() * 50) + 30,
      likes: Math.floor(Math.random() * 40) + 20,
      comments: Math.floor(Math.random() * 15) + 5,
    });
  }

  return data;
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
