import React from "react";
import NavigationBar from "./NavigationBar";
import CaptionGenerator from "./CaptionGenerator";
import HistorySidebar from "./HistorySidebar";

const Home = () => {
  const handleGenerate = (data: {
    keywords: string;
    image?: File;
    tone: string;
    language: string;
    includeEmojis: boolean;
    includeHashtags: boolean;
  }) => {
    console.log("Generating captions with:", data);
  };

  const handleSchedule = (id: string, date: Date) => {
    console.log("Scheduling caption", id, "for", date);
  };

  const handleDelete = (id: string) => {
    console.log("Deleting caption", id);
  };

  const handleShare = (id: string) => {
    console.log("Sharing caption", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="container mx-auto py-6 px-4 flex gap-6">
        <div className="flex-1">
          <CaptionGenerator onGenerate={handleGenerate} />
        </div>
        <HistorySidebar
          onSchedule={handleSchedule}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default Home;
