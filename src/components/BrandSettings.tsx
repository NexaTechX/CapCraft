import React from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useBrandStore } from "@/lib/brandSettings";
import InstagramAccountManager from "./InstagramAccountManager";

const BrandSettings = () => {
  const { settings, updateSettings } = useBrandStore();
  const [hashtags, setHashtags] = React.useState(
    settings.preferredHashtags.join(", "),
  );

  const handleSave = async () => {
    try {
      updateSettings({
        ...settings,
        preferredHashtags: hashtags.split(",").map((tag) => tag.trim()),
      });
    } catch (error) {
      console.error("Error saving brand settings:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="brand" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="brand">Brand Settings</TabsTrigger>
          <TabsTrigger value="social">Social Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="brand">
          <Card className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Brand Settings</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={settings.name}
                  onChange={(e) => updateSettings({ name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTone">Default Tone</Label>
                <Select
                  value={settings.defaultTone}
                  onValueChange={(value) =>
                    updateSettings({ defaultTone: value })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="defaultLanguage">Default Language</Label>
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) =>
                    updateSettings({ defaultLanguage: value })
                  }
                >
                  <SelectTrigger>
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
                <Label htmlFor="hashtags">Preferred Hashtags</Label>
                <Input
                  id="hashtags"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="Enter hashtags separated by commas"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emojiStyle">Emoji Style</Label>
                <Select
                  value={settings.emojiStyle}
                  onValueChange={(
                    value: "minimal" | "moderate" | "expressive",
                  ) => updateSettings({ emojiStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select emoji style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="expressive">Expressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Brand Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="p-6">
            <InstagramAccountManager />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandSettings;
