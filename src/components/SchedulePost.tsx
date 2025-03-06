import React from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Card } from "./ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarDays, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "./ui/use-toast";

interface SchedulePostProps {
  captionId: string;
  onSchedule?: (date: Date) => void;
}

export default function SchedulePost({
  captionId,
  onSchedule,
}: SchedulePostProps) {
  const { toast } = useToast();
  const [date, setDate] = React.useState<Date>();
  const [time, setTime] = React.useState("12:00");
  const [loading, setLoading] = React.useState(false);

  const handleSchedule = async () => {
    if (!date) {
      toast({
        title: "Error",
        description: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const [hours, minutes] = time.split(":").map(Number);
      const scheduledDate = new Date(date);
      scheduledDate.setHours(hours, minutes);

      const { error } = await supabase
        .from("saved_captions")
        .update({
          scheduled_date: scheduledDate.toISOString(),
        })
        .eq("id", captionId);

      if (error) throw error;
      onSchedule?.(scheduledDate);

      toast({
        title: "Success",
        description: `Post scheduled for ${scheduledDate.toLocaleString()}`,
      });
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

  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      timeSlots.push(
        `${i.toString().padStart(2, "0")}:${j.toString().padStart(2, "0")}`,
      );
    }
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Schedule Post</h3>
      <div className="space-y-4">
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

        <Button
          className="w-full"
          onClick={handleSchedule}
          disabled={!date || loading}
        >
          {loading ? "Scheduling..." : "Schedule Post"}
        </Button>
      </div>
    </Card>
  );
}
