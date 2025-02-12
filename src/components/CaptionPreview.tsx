import React from "react";
import { useCaptionStore } from "@/lib/store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Copy, Edit2, Save } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

interface Caption {
  id: string;
  text: string;
  isEditing?: boolean;
}

interface CaptionPreviewProps {
  onEdit?: (id: string, newText: string) => void;
  onCopy?: (text: string) => void;
  onSave?: (id: string) => void;
}

const CaptionPreview: React.FC<CaptionPreviewProps> = ({
  onEdit = () => {},
  onCopy = () => {},
  onSave = () => {},
}) => {
  const { captions: storeCaptions, saveCaptions } = useCaptionStore();

  const [editableCaptions, setEditableCaptions] = React.useState(
    storeCaptions.map((caption) => ({
      id: caption.id,
      text: caption.text,
      isEditing: false,
    })),
  );

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

  const handleSave = (id: string) => {
    const caption = editableCaptions.find((c) => c.id === id);
    if (caption) {
      onEdit(id, caption.text);
      handleEditToggle(id);
      onSave(id);
    }
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
                  onChange={(e) => handleTextChange(caption.id, e.target.value)}
                  className="w-full min-h-[100px]"
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {caption.text}
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (caption.isEditing) {
                            handleSave(caption.id);
                          } else {
                            handleEditToggle(caption.id);
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
                        onClick={() => onCopy(caption.text)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CaptionPreview;
