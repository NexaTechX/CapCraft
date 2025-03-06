import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBrandStore } from "@/lib/brandSettings";
import DashboardLayout from "@/components/DashboardLayout";

const BrandSettings = () => {
  const { settings, updateSettings } = useBrandStore();
  const [hashtags, setHashtags] = React.useState(
    settings.preferredHashtags.join(", "),
  );
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateSettings({
        ...settings,
        preferredHashtags: hashtags.split(",").map((tag) => tag.trim()),
      });
      toast({
        title: "Success",
        description: "Brand settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save brand settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Brand Settings</h1>
        </div>

        <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-violet-100/50 shadow-lg shadow-violet-100/20">
          <div className="space-y-2">
            <Label htmlFor="brandName" className="text-violet-700">
              Brand Name
            </Label>
            <Input
              id="brandName"
              value={settings.name}
              onChange={(e) => updateSettings({ name: e.target.value })}
              className="bg-white/80 backdrop-blur-sm border-violet-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultTone" className="text-violet-700">
              Default Tone
            </Label>
            <Select
              value={settings.defaultTone}
              onValueChange={(value) => updateSettings({ defaultTone: value })}
            >
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-violet-100">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultLanguage" className="text-violet-700">
              Default Language
            </Label>
            <Select
              value={settings.defaultLanguage}
              onValueChange={(value) =>
                updateSettings({ defaultLanguage: value })
              }
            >
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-violet-100">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hashtags" className="text-violet-700">
              Preferred Hashtags
            </Label>
            <Input
              id="hashtags"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="Enter hashtags separated by commas"
              className="bg-white/80 backdrop-blur-sm border-violet-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emojiStyle" className="text-violet-700">
              Emoji Style
            </Label>
            <Select
              value={settings.emojiStyle}
              onValueChange={(value: "minimal" | "moderate" | "expressive") =>
                updateSettings({ emojiStyle: value })
              }
            >
              <SelectTrigger className="bg-white/80 backdrop-blur-sm border-violet-100">
                <SelectValue placeholder="Select emoji style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="expressive">Expressive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200 hover:shadow-violet-300"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Brand Settings"
            )}
          </Button>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default BrandSettings;
