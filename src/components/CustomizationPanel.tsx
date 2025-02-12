import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card } from "./ui/card";

interface CustomizationPanelProps {
  onToneChange?: (tone: string) => void;
  onLanguageChange?: (language: string) => void;
  onEmojiToggle?: (enabled: boolean) => void;
  onHashtagToggle?: (enabled: boolean) => void;
}

const CustomizationPanel = ({
  onToneChange = () => {},
  onLanguageChange = () => {},
  onEmojiToggle = () => {},
  onHashtagToggle = () => {},
}: CustomizationPanelProps) => {
  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select onValueChange={onToneChange} defaultValue="casual">
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="funny">Funny</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select onValueChange={onLanguageChange} defaultValue="en">
            <SelectTrigger id="language">
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

        <div className="flex items-center space-x-2">
          <Switch id="emoji" defaultChecked onCheckedChange={onEmojiToggle} />
          <Label htmlFor="emoji">Include Emojis</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hashtags"
            defaultChecked
            onCheckedChange={onHashtagToggle}
          />
          <Label htmlFor="hashtags">Include Hashtags</Label>
        </div>
      </div>
    </Card>
  );
};

export default CustomizationPanel;
