-- Insert default caption templates
INSERT INTO caption_templates (id, name, description, template, category, is_public)
VALUES
  ('promo-1', 'Product Launch', 'Announce a new product or service', '🎉 Exciting news! Introducing {product}: {description}. Experience the difference at {link}. #NewLaunch #{industry} #{brand}', 'promotional', true),
  ('personal-1', 'Life Update', 'Share personal achievements or milestones', '✨ {emotion} to share this moment: {achievement}! {reflection} #LifeUpdate #Blessed', 'personal', true),
  ('event-1', 'Event Announcement', 'Promote upcoming events', '📅 Save the date! Join us for {eventName} on {date}. {details} RSVP now: {link} #Event #{eventType}', 'event', true),
  ('promo-2', 'Limited Time Offer', 'Promote a sale or special offer', '⏰ Don\'t miss out! {offerDetails} available for a limited time only. Shop now: {link} #Sale #LimitedTimeOffer', 'promotional', true),
  ('personal-2', 'Travel Memory', 'Share travel experiences', '✈️ Exploring the beauty of {location}! {experience} #Travel #Wanderlust #{location}', 'personal', true),
  ('event-2', 'Webinar Promotion', 'Promote online events', '💻 Join our free webinar on {topic} with expert {speaker}. Learn how to {benefit}! Register: {link} #Webinar #Learning', 'event', true);
