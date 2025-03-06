import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Instagram, Unlink } from "lucide-react";
import { useToast } from "./ui/use-toast";
import {
  getInstagramAccounts,
  unlinkInstagramAccount,
  InstagramAccount,
} from "@/lib/instagram";

export default function InstagramAccountManager() {
  const { toast } = useToast();
  const [accounts, setAccounts] = React.useState<InstagramAccount[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const accounts = await getInstagramAccounts();
      setAccounts(accounts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load Instagram accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    const clientId = import.meta.env.VITE_INSTAGRAM_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;
    const scope = "instagram_basic,instagram_content_publish";

    window.location.href = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
  };

  const handleUnlink = async (accountId: string) => {
    try {
      await unlinkInstagramAccount(accountId);
      setAccounts(accounts.filter((account) => account.id !== accountId));
      toast({
        title: "Success",
        description: "Instagram account unlinked successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlink Instagram account",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Connected Instagram Accounts</h2>

      {accounts.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">No Instagram accounts connected</p>
          <Button onClick={handleConnect}>
            <Instagram className="w-4 h-4 mr-2" />
            Connect Instagram
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <Card key={account.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {account.profile_picture_url && (
                    <img
                      src={account.profile_picture_url}
                      alt={account.username}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium">{account.username}</p>
                    <p className="text-sm text-gray-500">
                      {account.followers_count} followers
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnlink(account.id)}
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Unlink
                </Button>
              </div>
            </Card>
          ))}
          {accounts.length < 5 && (
            <Button onClick={handleConnect} className="w-full">
              <Instagram className="w-4 h-4 mr-2" />
              Connect Another Account
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
