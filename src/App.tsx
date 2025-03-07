import { Suspense, useEffect } from "react";
import InstagramCallback from "./components/InstagramCallback";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import SchedulePage from "./pages/SchedulePage";
import TemplatesPage from "./pages/TemplatesPage";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ProfileSettings from "./pages/settings/ProfileSettings";
import BrandSettings from "./pages/settings/BrandSettings";
import SocialAccounts from "./pages/settings/SocialAccounts";
import NotificationSettings from "./pages/settings/NotificationSettings";
import routes from "tempo-routes";
import { useAuthStore } from "./lib/auth";
import { Toaster } from "./components/ui/toaster";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { initialize, user, loading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <LoadingSpinner fullScreen size="lg" text="Loading CapCraft AI..." />
    );
  }

  return (
    <Suspense
      fallback={
        <LoadingSpinner fullScreen size="lg" text="Loading CapCraft AI..." />
      }
    >
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Landing />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" /> : <Auth />}
        />
        <Route
          path="/dashboard"
          element={user ? <Home /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard/analytics"
          element={user ? <Analytics /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard/notifications"
          element={user ? <Notifications /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard/templates"
          element={user ? <TemplatesPage /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard/schedule"
          element={user ? <SchedulePage /> : <Navigate to="/auth" />}
        />

        {/* Settings Routes */}
        <Route
          path="/dashboard/settings/profile"
          element={user ? <ProfileSettings /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard/settings/brand"
          element={user ? <BrandSettings /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard/settings/social"
          element={user ? <SocialAccounts /> : <Navigate to="/auth" />}
        />
        <Route
          path="/dashboard/settings/notifications"
          element={user ? <NotificationSettings /> : <Navigate to="/auth" />}
        />

        <Route
          path="/auth/instagram/callback"
          element={<InstagramCallback />}
        />
        {import.meta.env.VITE_TEMPO === "true" && (
          <Route path="/tempobook/*" element={null} />
        )}
      </Routes>
      <Toaster />
    </Suspense>
  );
}

export default App;
