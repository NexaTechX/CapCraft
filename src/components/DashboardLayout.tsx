import React from "react";
import { motion } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import { Logo } from "./ui/logo";
import { Button } from "./ui/button";
import { useAuthStore } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useProfileStore } from "@/lib/profileSettings";
import LoadingSpinner from "./LoadingSpinner";
import {
  Home,
  Settings,
  BarChart2,
  Bell,
  Instagram,
  LogOut,
  User,
  Palette,
  BellRing,
  FileText,
  Calendar,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { signOut, user } = useAuthStore();
  const { settings, loading } = useProfileStore();

  const isActive = (path: string) => location.pathname.includes(path);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/dashboard/analytics", label: "Analytics", icon: BarChart2 },
    { path: "/dashboard/templates", label: "Templates", icon: FileText },
    { path: "/dashboard/schedule", label: "Schedule", icon: Calendar },
    { path: "/dashboard/notifications", label: "Notifications", icon: Bell },
  ];

  const settingsItems = [
    { path: "/dashboard/settings/profile", label: "Profile", icon: User },
    { path: "/dashboard/settings/brand", label: "Brand", icon: Palette },
    {
      path: "/dashboard/settings/social",
      label: "Social Accounts",
      icon: Instagram,
    },
    {
      path: "/dashboard/settings/notifications",
      label: "Notification Settings",
      icon: BellRing,
    },
  ];

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <motion.aside
        className="w-64 bg-white border-r border-gray-200 shadow-sm fixed h-full z-10"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100">
            <Logo />
          </div>

          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-violet-100">
                <AvatarImage src={settings?.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-500 text-white">
                  {settings?.name?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{settings?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link to={item.path} key={item.path}>
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    size="sm"
                    className={`w-full justify-start ${isActive(item.path) ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : "hover:bg-violet-50"}`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2 px-2">
                SETTINGS
              </p>
              <div className="space-y-1">
                {settingsItems.map((item) => (
                  <Link to={item.path} key={item.path}>
                    <Button
                      variant={isActive(item.path) ? "default" : "ghost"}
                      size="sm"
                      className={`w-full justify-start ${isActive(item.path) ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : "hover:bg-violet-50"}`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-violet-200 hover:bg-violet-50 text-violet-700"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
