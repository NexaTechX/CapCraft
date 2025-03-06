import React from "react";
import { useCaptionStore } from "@/lib/store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CalendarDays, Clock, Share2, Trash2, Send, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";

interface SavedCaption {
  id: string;
  text: string;
  date: Date;
  scheduled?: boolean;
  scheduledDate?: Date;
}

interface HistorySidebarProps {
  onSchedule?: (id: string, date: Date) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({
  onSchedule = () => {},
  onDelete = () => {},
  onShare = () => {},
}) => {
  const { toast } = useToast();
  const {
    savedCaptions: storeSavedCaptions,
    deleteSavedCaption,
    scheduleCaption,
    loadSavedCaptions,
  } = useCaptionStore();
  const [activeTab, setActiveTab] = React.useState("all");

  React.useEffect(() => {
    const loadCaptions = async () => {
      try {
        await loadSavedCaptions();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load saved captions",
          variant: "destructive",
        });
      }
    };
    loadCaptions();
  }, [loadSavedCaptions, toast]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedCaption(id);
      onDelete(id);
      toast({
        title: "Success",
        description: "Caption deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete caption",
        variant: "destructive",
      });
    }
  };

  const handlePostNow = (id: string) => {
    toast({
      title: "Posted",
      description: "Caption has been posted successfully",
    });
  };

  const savedCaptions = storeSavedCaptions.map((caption) => ({
    id: caption.id,
    text: caption.text,
    date: new Date(caption.created_at),
    scheduled: caption.scheduled_date !== null,
    scheduledDate: caption.scheduled_date
      ? new Date(caption.scheduled_date)
      : undefined,
  }));

  const scheduledCaptions = savedCaptions.filter(
    (caption) => caption.scheduled,
  );
  const unscheduledCaptions = savedCaptions.filter(
    (caption) => !caption.scheduled,
  );

  const displayCaptions =
    activeTab === "all"
      ? savedCaptions
      : activeTab === "scheduled"
        ? scheduledCaptions
        : unscheduledCaptions;

  return (
    <Card className="h-full w-[320px] bg-white p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Caption Library</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled
            {scheduledCaptions.length > 0 && (
              <Badge className="ml-2 bg-violet-100 text-violet-700 hover:bg-violet-100">
                {scheduledCaptions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
      </Tabs>

      <ScrollArea className="flex-grow">
        <div className="space-y-4 pr-4">
          {displayCaptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No captions found</p>
            </div>
          ) : (
            displayCaptions.map((caption) => (
              <motion.div
                key={caption.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  key={caption.id}
                  className="p-4 space-y-3 hover:shadow-md transition-shadow border-violet-100/50"
                >
                  <p className="text-sm text-gray-700">{caption.text}</p>

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {caption.date.toLocaleDateString()}
                  </div>

                  {caption.scheduled && caption.scheduledDate && (
                    <div className="text-xs text-blue-600 flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      Scheduled for: {caption.scheduledDate.toLocaleString()}
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-violet-200 hover:bg-violet-50 text-violet-700"
                      onClick={() => handlePostNow(caption.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-violet-200 hover:bg-violet-50 text-violet-700"
                      onClick={() => onShare(caption.id)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-violet-200 hover:bg-violet-50 text-violet-700"
                      onClick={() => handleDelete(caption.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default HistorySidebar;
