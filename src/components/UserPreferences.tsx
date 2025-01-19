import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Layout, List } from "lucide-react";

export const UserPreferences = () => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [isSaving, setIsSaving] = useState(false);

  const updateViewMode = async (mode: "card" | "list") => {
    try {
      setIsSaving(true);
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        toast.error("Please sign in to update preferences");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          news_preferences: {
            view_mode: mode
          }
        })
        .eq("id", session.session.user.id);

      if (error) throw error;

      setViewMode(mode);
      toast.success("Preferences updated successfully");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>View Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {viewMode === "card" ? (
              <Layout className="h-5 w-5" />
            ) : (
              <List className="h-5 w-5" />
            )}
            <span>View Mode: {viewMode === "card" ? "Card" : "List"}</span>
          </div>
          <Switch
            checked={viewMode === "card"}
            onCheckedChange={(checked) => updateViewMode(checked ? "card" : "list")}
            disabled={isSaving}
          />
        </div>
      </CardContent>
    </Card>
  );
};