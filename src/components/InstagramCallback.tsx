import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveInstagramToken } from "@/lib/instagram-auth";
import { useToast } from "./ui/use-toast";

export default function InstagramCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        toast({
          title: "Error",
          description: "Failed to connect Instagram account",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      if (!code) {
        toast({
          title: "Error",
          description: "No authorization code received",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      try {
        await saveInstagramToken(code);
        toast({
          title: "Success",
          description: "Instagram account connected successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to connect Instagram account",
          variant: "destructive",
        });
      }
      navigate("/dashboard");
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">
          Connecting Instagram Account
        </h2>
        <p className="text-gray-600">
          Please wait while we connect your account...
        </p>
      </div>
    </div>
  );
}
