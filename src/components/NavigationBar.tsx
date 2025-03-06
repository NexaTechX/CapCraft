import { Bell, Settings, BarChart2, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Logo } from "./ui/logo";
import { useAuthStore } from "@/lib/auth";

const NavigationBar = () => {
  const location = useLocation();
  const { signOut } = useAuthStore();

  const isActive = (path: string) => location.pathname.includes(path);

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 300,
      },
    }),
  };

  return (
    <motion.nav
      className="border-b bg-white/75 backdrop-blur-sm sticky top-0 z-50 shadow-sm shadow-violet-100/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard">
            <Logo />
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              custom={0}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link to="/dashboard">
                <Button
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  size="sm"
                  className={`space-x-2 ${isActive("/dashboard") ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : "hover:bg-violet-50"}`}
                >
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </motion.div>

            <motion.div
              custom={1}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link to="/dashboard/analytics">
                <Button
                  variant={isActive("/analytics") ? "default" : "ghost"}
                  size="sm"
                  className={`space-x-2 ${isActive("/analytics") ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white" : "hover:bg-violet-50"}`}
                >
                  <BarChart2 className="h-4 w-4" />
                  <span>Analytics</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.div
            custom={2}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link to="/dashboard/notifications">
              <Button
                variant={isActive("/notifications") ? "default" : "ghost"}
                size="icon"
                className={
                  isActive("/notifications")
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "hover:bg-violet-50"
                }
              >
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            custom={3}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link to="/dashboard/settings">
              <Button
                variant={isActive("/settings") ? "default" : "ghost"}
                size="icon"
                className={
                  isActive("/settings")
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    : "hover:bg-violet-50"
                }
              >
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            custom={4}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="border-violet-200 hover:bg-violet-50 text-violet-700"
            >
              Sign Out
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavigationBar;
