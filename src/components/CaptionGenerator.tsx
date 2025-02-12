import React from "react";
import { useCaptionStore } from "@/lib/store";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ImagePlus, Wand2 } from "lucide-react";
import CustomizationPanel from "./CustomizationPanel";
import CaptionPreview from "./CaptionPreview";

interface CaptionGeneratorProps {
  onGenerate?: (data: {
    keywords: string;
    image?: File;
    tone: string;
    language: string;
    includeEmojis: boolean;
    includeHashtags: boolean;
  }) => void;
}

const CaptionGenerator = ({ onGenerate = () => {} }: CaptionGeneratorProps) => {
  const [keywords, setKeywords] = React.useState("");
  const [image, setImage] = React.useState<File | null>(null);
  const [tone, setTone] = React.useState("casual");
  const [language, setLanguage] = React.useState("en");
  const [includeEmojis, setIncludeEmojis] = React.useState(true);
  const [includeHashtags, setIncludeHashtags] = React.useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const { generateCaptions, captions, isGenerating } = useCaptionStore();

  const handleGenerate = async () => {
    await generateCaptions({
      keywords,
      image: image || undefined,
      tone,
      language,
      includeEmojis,
      includeHashtags,
    });
  };

  return (
    <div className="w-full max-w-[900px] mx-auto space-y-6 bg-gray-50 p-6 rounded-lg">
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords or Context</Label>
            <Textarea
              id="keywords"
              placeholder="Enter keywords or context for your caption..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Upload Image (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("image")?.click()}
                className="w-full"
              >
                <ImagePlus className="mr-2 h-4 w-4" />
                {image ? image.name : "Choose Image"}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <CustomizationPanel
        onToneChange={setTone}
        onLanguageChange={setLanguage}
        onEmojiToggle={setIncludeEmojis}
        onHashtagToggle={setIncludeHashtags}
      />

      <div className="flex justify-center">
        <Button size="lg" onClick={handleGenerate} className="w-full max-w-md">
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Captions
        </Button>
      </div>

      <CaptionPreview
        onCopy={(text) => navigator.clipboard.writeText(text)}
        onEdit={(id, text) => console.log("Edit caption", id, text)}
        onSave={(id) => console.log("Save caption", id)}
      />
    </div>
  );
};

export default CaptionGenerator;
