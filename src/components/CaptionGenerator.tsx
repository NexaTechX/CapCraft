import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { ImagePlus, Loader2, Sparkles, FileText, Calendar } from "lucide-react";
import CustomizationPanel from "./CustomizationPanel";
import CaptionPreview from "./CaptionPreview";
import TemplateSelector from "./TemplateSelector";
import PostScheduler from "./PostScheduler";
import { useCaptionStore } from "@/lib/store";
import { useToast } from "./ui/use-toast";
import { analyzeImage } from "@/lib/imageAnalysis";
import { useProfileStore } from "@/lib/profileSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CaptionTemplate } from "@/lib/templates";

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

const CaptionGenerator: React.FC<CaptionGeneratorProps> = ({ onGenerate }) => {
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedCaption, setSelectedCaption] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { generateCaptions, isGenerating, captions, saveCaption } =
    useCaptionStore();
  const { settings: profileSettings } = useProfileStore();

  const [settings, setSettings] = useState({
    tone: profileSettings?.defaultTone || "casual",
    language: profileSettings?.defaultLanguage || "en",
    includeEmojis: profileSettings?.emojiStyle !== "minimal",
    includeHashtags: true,
  });

  React.useEffect(() => {
    if (profileSettings) {
      setSettings({
        tone: profileSettings.defaultTone || "casual",
        language: profileSettings.defaultLanguage || "en",
        includeEmojis: profileSettings.emojiStyle !== "minimal",
        includeHashtags: true,
      });
    }
  }, [profileSettings]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setAnalyzing(true);

      try {
        const analysis = await analyzeImage(file);
        setKeywords(analysis);
        toast({
          title: "Image Analysis Complete",
          description: "We've analyzed your image and suggested some keywords.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to analyze image",
          variant: "destructive",
        });
      } finally {
        setAnalyzing(false);
      }
    }
  };

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast({
        title: "Error",
        description: "Please enter keywords or upload an image",
        variant: "destructive",
      });
      return;
    }

    try {
      await generateCaptions({
        keywords,
        image,
        ...settings,
      });
      onGenerate?.({ keywords, image: image || undefined, ...settings });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate captions",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (caption: any) => {
    try {
      const savedCaption = await saveCaption(caption);
      setSelectedCaption(savedCaption);
      setActiveTab("schedule");
      toast({
        title: "Success",
        description: "Caption saved to library",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save caption",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: CaptionTemplate) => {
    // Replace placeholders with empty brackets for user to fill in
    const processedTemplate = template.template.replace(/\{([^}]+)\}/g, "[$1]");
    setKeywords(processedTemplate);
    toast({
      title: "Template Selected",
      description:
        "Template has been applied. Fill in the bracketed placeholders.",
    });
  };

  const handleSchedule = (date: Date) => {
    toast({
      title: "Post Scheduled",
      description: `Your post has been scheduled for ${date.toLocaleString()}`,
    });
  };

  const handlePostNow = () => {
    toast({
      title: "Post Published",
      description: "Your caption has been posted successfully",
    });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="generate" className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100/50 shadow-lg shadow-violet-100/20">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <motion.div
                    className="flex-1 space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="keywords" className="text-violet-700">
                      Keywords or Context
                    </Label>
                    <Textarea
                      id="keywords"
                      placeholder="Enter keywords, context, or let us analyze your image..."
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="min-h-[120px] bg-white/80 backdrop-blur-sm border-violet-100"
                    />
                  </motion.div>

                  <motion.div
                    className="w-[200px] space-y-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label className="text-violet-700">Image</Label>
                    <Card className="aspect-square flex items-center justify-center relative overflow-hidden bg-white/80 backdrop-blur-sm border-violet-100">
                      <AnimatePresence mode="wait">
                        {imagePreview ? (
                          <motion.img
                            key="preview"
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          />
                        ) : (
                          <motion.div
                            key="upload"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                          >
                            <Button
                              variant="outline"
                              className="absolute inset-0 w-full h-full rounded-none border-2 border-dashed border-violet-200 hover:border-violet-400 hover:bg-violet-50/50"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <ImagePlus className="h-8 w-8 text-violet-400" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </Card>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <CustomizationPanel
                    onToneChange={(tone) => setSettings({ ...settings, tone })}
                    onLanguageChange={(language) =>
                      setSettings({ ...settings, language })
                    }
                    onEmojiToggle={(enabled) =>
                      setSettings({ ...settings, includeEmojis: enabled })
                    }
                    onHashtagToggle={(enabled) =>
                      setSettings({ ...settings, includeHashtags: enabled })
                    }
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating || analyzing}
                  >
                    {isGenerating || analyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {analyzing ? "Analyzing Image..." : "Generating..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Captions
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <AnimatePresence>
            {captions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <CaptionPreview
                  onSave={handleSave}
                  onCopy={(text) => {
                    navigator.clipboard.writeText(text);
                    toast({
                      title: "Copied",
                      description: "Caption copied to clipboard",
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="templates">
          <TemplateSelector onSelectTemplate={handleTemplateSelect} />
        </TabsContent>

        <TabsContent value="schedule">
          <PostScheduler
            captionId={selectedCaption?.id}
            captionText={selectedCaption?.text}
            onSchedule={handleSchedule}
            onPostNow={handlePostNow}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CaptionGenerator;
