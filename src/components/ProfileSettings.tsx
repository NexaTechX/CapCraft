import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "./ui/use-toast";
import { Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useProfileStore } from "@/lib/profileSettings";
import InstagramAccountManager from "./InstagramAccountManager";
import { supabase } from "@/lib/supabase";

const ProfileSettings = () => {
  const { settings, updateSettings, initialize } = useProfileStore();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      await initialize();
    };
    init();
  }, [initialize]);

  const [hashtags, setHashtags] = React.useState(
    settings.preferredHashtags.join(", "),
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateSettings({
        ...settings,
        preferredHashtags: hashtags.split(",").map((tag) => tag.trim()),
      });
      toast({
        title: "Success",
        description: "Profile settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setLoading(true);
        const file = e.target.files[0];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Please upload an image file");
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
          throw new Error("Image size should be less than 2MB");
        }

        const fileExt = file.name.split(".").pop();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const filePath = `${user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        await updateSettings({ avatarUrl: publicUrl });
        toast({
          title: "Success",
          description: "Avatar updated successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update avatar",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
          <TabsTrigger value="social">Social Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-violet-100/50 shadow-lg shadow-violet-100/20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-2 ring-violet-100">
                  <AvatarImage src={settings.avatarUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                    {settings.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 bg-white hover:bg-violet-50 border-violet-200"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="name" className="text-violet-700">
                  Display Name
                </Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) => updateSettings({ name: e.target.value })}
                  className="bg-white/80 backdrop-blur-sm border-violet-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTone" className="text-violet-700">
                Default Tone
              </Label>
              <Select
                value={settings.defaultTone}
                onValueChange={(value) =>
                  updateSettings({ defaultTone: value })
                }
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
                "Save Profile Settings"
              )}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-6 bg-white/50 backdrop-blur-sm border-violet-100/50 shadow-lg shadow-violet-100/20">
            <InstagramAccountManager />
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileSettings;
