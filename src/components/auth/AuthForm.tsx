import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  const createProfile = async (user_id: string) => {
    const { error } = await supabase.from("profiles").upsert({
      id: user_id,
      username: email.split("@")[0],
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }

    // Also create profile settings
    const { error: settingsError } = await supabase
      .from("profile_settings")
      .upsert({
        user_id,
        name: email.split("@")[0],
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        default_tone: "casual",
        default_language: "en",
        preferred_hashtags: [],
        emoji_style: "moderate",
      });

    if (settingsError) {
      console.error("Error creating profile settings:", settingsError);
      throw settingsError;
    }
  };

  const [verificationSent, setVerificationSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        setVerificationSent(true);
        toast({
          title: "Verification Email Sent",
          description: "Please check your email to verify your account",
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email Not Verified",
              description:
                "Please check your email and verify your account before signing in",
              variant: "destructive",
            });
            return;
          }
          throw error;
        }

        // Create profile if it doesn't exist
        if (data.user) {
          try {
            await createProfile(data.user.id);
          } catch (profileError) {
            console.error("Error creating profile:", profileError);
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 w-full backdrop-blur-sm bg-white/80 border-violet-100/50 shadow-xl shadow-violet-100/50">
      {verificationSent ? (
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-violet-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-violet-900">
              Verification Email Sent
            </h3>
            <p className="text-sm text-violet-700 mt-2">
              Please check your email and click the verification link to
              complete signup.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full border-violet-200 hover:bg-violet-50 text-violet-700"
            onClick={() => setVerificationSent(false)}
          >
            Back to Sign In
          </Button>
        </motion.div>
      ) : (
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-violet-900">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-violet-900">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-violet-500" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/50 border-violet-100 focus:border-violet-300 focus:ring-violet-200"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-violet-200/50 hover:shadow-violet-300/50"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating Account..." : "Signing In..."}
              </>
            ) : isSignUp ? (
              "Sign Up"
            ) : (
              "Sign In"
            )}
          </Button>
          <p className="text-center text-sm text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="text-violet-600 hover:text-violet-500 font-medium"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      )}
    </Card>
  );
}
