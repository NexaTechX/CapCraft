import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

const NotificationSettings = () => {
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();
  const [settings, setSettings] = React.useState({
    emailNotifications: true,
    pushNotifications: false,
    scheduledPostReminders: true,
    engagementAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
  });

  const handleToggle = (key: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Success",
        description: "Notification settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save notification settings",
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
          <h1 className="text-2xl font-bold">Notification Settings</h1>
        </div>

        <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-violet-100/50 shadow-lg shadow-violet-100/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="text-violet-700">
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-500">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleToggle("emailNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications" className="text-violet-700">
                  Push Notifications
                </Label>
                <p className="text-sm text-gray-500">
                  Receive notifications in your browser
                </p>
              </div>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleToggle("pushNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="scheduledPostReminders"
                  className="text-violet-700"
                >
                  Scheduled Post Reminders
                </Label>
                <p className="text-sm text-gray-500">
                  Get reminded before your scheduled posts go live
                </p>
              </div>
              <Switch
                id="scheduledPostReminders"
                checked={settings.scheduledPostReminders}
                onCheckedChange={(checked) =>
                  handleToggle("scheduledPostReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="engagementAlerts" className="text-violet-700">
                  Engagement Alerts
                </Label>
                <p className="text-sm text-gray-500">
                  Get notified about significant engagement on your posts
                </p>
              </div>
              <Switch
                id="engagementAlerts"
                checked={settings.engagementAlerts}
                onCheckedChange={(checked) =>
                  handleToggle("engagementAlerts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyReports" className="text-violet-700">
                  Weekly Reports
                </Label>
                <p className="text-sm text-gray-500">
                  Receive weekly performance reports
                </p>
              </div>
              <Switch
                id="weeklyReports"
                checked={settings.weeklyReports}
                onCheckedChange={(checked) =>
                  handleToggle("weeklyReports", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingEmails" className="text-violet-700">
                  Marketing Emails
                </Label>
                <p className="text-sm text-gray-500">
                  Receive marketing and promotional emails
                </p>
              </div>
              <Switch
                id="marketingEmails"
                checked={settings.marketingEmails}
                onCheckedChange={(checked) =>
                  handleToggle("marketingEmails", checked)
                }
              />
            </div>
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
              "Save Notification Settings"
            )}
          </Button>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default NotificationSettings;
