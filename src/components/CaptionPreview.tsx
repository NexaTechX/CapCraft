import React, { useState, useEffect } from "react";
import { useCaptionStore } from "@/lib/store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Copy, Edit2, Save, Calendar, Share2, Hash } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import SchedulePost from "./SchedulePost";
import { Badge } from "./ui/badge";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import { SavedCaption } from "@/lib/types";
import {
  generateBasicHashtags,
  generateHashtags,
} from "@/lib/hashtagGenerator";

interface Caption extends Partial<SavedCaption> {
  isEditing?: boolean;
  suggestedHashtags?: string[];
}

interface CaptionPreviewProps {
  onEdit?: (id: string, newText: string) => void;
  onCopy?: (text: string) => void;
  onSave?: (caption: Caption) => void;
  onSchedule?: (id: string, date: Date) => void;
  onShare?: (id: string) => void;
}

const CaptionPreview: React.FC<CaptionPreviewProps> = ({
  onEdit = () => {},
  onCopy = () => {},
  onSave = () => {},
  onSchedule = () => {},
  onShare = () => {},
}) => {
  const { captions: storeCaptions, updateCaption } = useCaptionStore();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [loadingHashtags, setLoadingHashtags] = useState<
    Record<string, boolean>
  >({});

  const [editableCaptions, setEditableCaptions] = useState<Caption[]>(
    storeCaptions.map((caption) => ({
      ...caption,
      isEditing: false,
      suggestedHashtags: [],
    })),
  );

  useEffect(() => {
    setEditableCaptions(
      storeCaptions.map((caption) => ({
        ...caption,
        isEditing: false,
        suggestedHashtags:
          editableCaptions.find((c) => c.id === caption.id)
            ?.suggestedHashtags || [],
      })),
    );
  }, [storeCaptions]);

  const handleEditToggle = (id: string) => {
    setEditableCaptions((prev) =>
      prev.map((caption) =>
        caption.id === id
          ? { ...caption, isEditing: !caption.isEditing }
          : caption,
      ),
    );
  };

  const handleTextChange = (id: string, newText: string) => {
    setEditableCaptions((prev) =>
      prev.map((caption) =>
        caption.id === id ? { ...caption, text: newText } : caption,
      ),
    );
  };

  const handleSave = (caption: Caption) => {
    if (caption.isEditing) {
      updateCaption(caption.id!, caption.text!);
      handleEditToggle(caption.id!);
      onEdit(caption.id!, caption.text!);
    } else {
      onSave(caption);
    }
  };

  const handleGenerateHashtags = async (caption: Caption) => {
    if (!caption.id || !caption.text) return;

    setLoadingHashtags((prev) => ({ ...prev, [caption.id!]: true }));

    try {
      // First try with the AI-based generator
      let hashtags = await generateHashtags(caption.text, 8);

      // If AI fails or returns empty, use the basic generator
      if (!hashtags || hashtags.length === 0) {
        hashtags = generateBasicHashtags(caption.text, 8);
      }

      setEditableCaptions((prev) =>
        prev.map((c) =>
          c.id === caption.id ? { ...c, suggestedHashtags: hashtags } : c,
        ),
      );
    } catch (error) {
      console.error("Error generating hashtags:", error);
      // Fallback to basic hashtags
      const hashtags = generateBasicHashtags(caption.text, 8);
      setEditableCaptions((prev) =>
        prev.map((c) =>
          c.id === caption.id ? { ...c, suggestedHashtags: hashtags } : c,
        ),
      );
    } finally {
      setLoadingHashtags((prev) => ({ ...prev, [caption.id!]: false }));
    }
  };

  const addHashtagToCaption = (captionId: string, hashtag: string) => {
    setEditableCaptions((prev) =>
      prev.map((caption) => {
        if (caption.id === captionId) {
          const updatedText = `${caption.text} ${hashtag}`;
          return { ...caption, text: updatedText };
        }
        return caption;
      }),
    );
  };

  return (
    <div className="w-full max-w-[900px] bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Generated Captions</h2>
      <div className="space-y-4">
        {editableCaptions.map((caption) => (
          <Card key={caption.id} className="p-4">
            <div className="space-y-2">
              {caption.isEditing ? (
                <Textarea
                  value={caption.text}
                  onChange={(e) =>
                    handleTextChange(caption.id!, e.target.value)
                  }
                  className="w-full min-h-[100px]"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {caption.text}
                </p>
              )}

              {caption.suggestedHashtags &&
                caption.suggestedHashtags.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Suggested Hashtags:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {caption.suggestedHashtags.map((hashtag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-violet-50 text-violet-700 border-violet-200 cursor-pointer hover:bg-violet-100"
                          onClick={() =>
                            addHashtagToCaption(caption.id!, hashtag)
                          }
                        >
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {caption.tone && <span>Tone: {caption.tone}</span>}
                  {caption.language && (
                    <span>Language: {caption.language}</span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (caption.isEditing) {
                              handleSave(caption);
                            } else {
                              handleEditToggle(caption.id!);
                            }
                          }}
                        >
                          {caption.isEditing ? (
                            <Save className="h-4 w-4" />
                          ) : (
                            <Edit2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {caption.isEditing ? "Save changes" : "Edit caption"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onCopy(caption.text!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleGenerateHashtags(caption)}
                          disabled={loadingHashtags[caption.id!]}
                        >
                          {loadingHashtags[caption.id!] ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
                          ) : (
                            <Hash className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate hashtags</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <SchedulePost
                              captionId={caption.id!}
                              onSchedule={(date) => {
                                setSelectedDate(date);
                                onSchedule(caption.id!, date);
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schedule post</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onShare(caption.id!)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share caption</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {!caption.isEditing && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleSave(caption)}
                    >
                      Save to Library
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CaptionPreview;
