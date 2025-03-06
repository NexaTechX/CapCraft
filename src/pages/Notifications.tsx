import React from "react";
import { Card } from "@/components/ui/card";
import { Bell, Calendar, Heart, MessageCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const notifications = [
  {
    id: 1,
    type: "engagement",
    message: "Your latest caption received 100+ likes",
    time: "2 hours ago",
    icon: Heart,
  },
  {
    id: 2,
    type: "scheduled",
    message: "Scheduled post will be published in 1 hour",
    time: "1 hour ago",
    icon: Calendar,
  },
  {
    id: 3,
    type: "comment",
    message: "New comment on your caption",
    time: "30 minutes ago",
    icon: MessageCircle,
  },
];

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Bell className="h-6 w-6 text-gray-600" />
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-indigo-100 rounded-full">
                <notification.icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
