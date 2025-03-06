export interface CaptionTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: "promotional" | "personal" | "event";
}

import { supabase } from "./supabase";

export async function getUserTemplates() {
  const { data, error } = await supabase
    .from("caption_templates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function saveTemplate(template: Omit<CaptionTemplate, "id">) {
  const { data, error } = await supabase
    .from("caption_templates")
    .insert(template)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const captionTemplates: CaptionTemplate[] = [
  {
    id: "promo-1",
    name: "Product Launch",
    description: "Announce a new product or service",
    template:
      "🎉 Exciting news! Introducing {product}: {description}. Experience the difference at {link}. #NewLaunch #{industry} #{brand}",
    category: "promotional",
  },
  {
    id: "personal-1",
    name: "Life Update",
    description: "Share personal achievements or milestones",
    template:
      "✨ {emotion} to share this moment: {achievement}! {reflection} #LifeUpdate #Blessed",
    category: "personal",
  },
  {
    id: "event-1",
    name: "Event Announcement",
    description: "Promote upcoming events",
    template:
      "📅 Save the date! Join us for {eventName} on {date}. {details} RSVP now: {link} #Event #{eventType}",
    category: "event",
  },
  {
    id: "promo-2",
    name: "Limited Time Offer",
    description: "Create urgency with a time-limited promotion",
    template:
      "⏰ Don't miss out! Our {offer_description} is only available until {end_date}. Grab yours now at {link}. #LimitedTimeOffer #Deal #Sale",
    category: "promotional",
  },
  {
    id: "promo-3",
    name: "Testimonial Highlight",
    description: "Showcase customer feedback",
    template:
      '❤️ Here\'s what our customers are saying: "{testimonial_quote}" - {customer_name}. Experience the difference at {link}. #CustomerLove #Testimonial #HappyCustomers',
    category: "promotional",
  },
  {
    id: "personal-2",
    name: "Travel Memory",
    description: "Share a travel experience",
    template:
      "✈️ Exploring the beauty of {location}! {experience_description}. What's your favorite travel memory? #TravelDiaries #Wanderlust #{location}",
    category: "personal",
  },
  {
    id: "personal-3",
    name: "Daily Inspiration",
    description: "Share an inspirational thought",
    template:
      '✨ "{inspirational_quote}" - {author}. This resonates with me because {personal_reflection}. What inspires you today? #DailyInspiration #Motivation #Mindfulness',
    category: "personal",
  },
  {
    id: "event-2",
    name: "Event Recap",
    description: "Summarize a past event",
    template:
      "🎬 What an amazing {event_name} yesterday! {event_highlights}. Thanks to everyone who made it special. Can't wait for the next one! #EventRecap #{event_type} #Community",
    category: "event",
  },
  {
    id: "event-3",
    name: "Live Event Coverage",
    description: "Post during an ongoing event",
    template:
      "🔴 LIVE from {event_name}! {current_happening}. Stay tuned for more updates throughout the day. #LiveCoverage #{event_type} #RightNow",
    category: "event",
  },
];
