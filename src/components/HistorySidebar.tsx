import React from "react";
import { useCaptionStore } from "@/lib/store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarDays, Clock, Share2, Trash2 } from "lucide-react";

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
  const { savedCaptions: storeSavedCaptions, deleteSavedCaption } =
    useCaptionStore();
  const [selectedDate, setSelectedDate] = React.useState<Date>();

  const savedCaptions = storeSavedCaptions.map((caption) => ({
    id: caption.id,
    text: caption.text,
    date: caption.createdAt,
  }));

  return (
    <Card className="h-full w-[320px] bg-white p-4 flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Saved Captions</h2>
      <ScrollArea className="flex-grow">
        <div className="space-y-4 pr-4">
          {savedCaptions.map((caption) => (
            <Card key={caption.id} className="p-4 space-y-3">
              <p className="text-sm text-gray-700">{caption.text}</p>

              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {caption.date.toLocaleDateString()}
              </div>

              {caption.scheduled && caption.scheduledDate && (
                <div className="text-xs text-blue-600 flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  Scheduled for: {caption.scheduledDate.toLocaleDateString()}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        if (date) onSchedule(caption.id, date);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(caption.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(caption.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default HistorySidebar;
