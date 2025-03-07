import React, { useEffect, useState } from "react";
import CaptionGenerator from "./CaptionGenerator";
import HistorySidebar from "./HistorySidebar";
import { useToast } from "@/components/ui/use-toast";
import { useCaptionStore } from "@/lib/store";
import { useProfileStore } from "@/lib/profileSettings";
import DashboardLayout from "./DashboardLayout";
import LoadingSpinner from "./LoadingSpinner";
import { ensureTablesExist } from "@/lib/db";

const Home = () => {
  const { toast } = useToast();
  const { deleteSavedCaption, savedCaptions, loadSavedCaptions } =
    useCaptionStore();
  const { initialize: initializeProfile } = useProfileStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // Ensure database tables exist
        await ensureTablesExist();
        // Initialize profile settings
        await initializeProfile();
        // Load saved captions
        await loadSavedCaptions();
      } catch (error) {
        console.error("Error initializing dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [initializeProfile, loadSavedCaptions]);

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
    toast({
      title: "Caption Scheduled",
      description: `Your caption has been scheduled for ${date.toLocaleDateString()}`,
    });
  };

  const handleDelete = (id: string) => {
    deleteSavedCaption(id);
    toast({
      title: "Caption Deleted",
      description: "Your caption has been removed from saved items",
    });
  };

  const handleShare = (id: string) => {
    const caption = savedCaptions.find((c) => c.id === id);
    if (caption) {
      navigator.clipboard.writeText(caption.text);
      toast({
        title: "Caption Copied",
        description: "Your caption has been copied to clipboard for sharing",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <LoadingSpinner size="lg" text="Loading your dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex gap-6">
        <div className="flex-1">
          <CaptionGenerator onGenerate={handleGenerate} />
        </div>
        <HistorySidebar
          onSchedule={handleSchedule}
          onDelete={handleDelete}
          onShare={handleShare}
        />
      </div>
    </DashboardLayout>
  );
};

export default Home;
