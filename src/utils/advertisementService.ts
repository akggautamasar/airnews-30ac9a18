
import { supabase } from "@/integrations/supabase/client";
import { Advertisement } from "@/types/advertisement";

export async function fetchActiveAdvertisements(): Promise<Advertisement[]> {
  const { data, error } = await supabase
    .from("advertisements")
    .select("*")
    .eq("active", true);

  if (error) {
    console.error("Error fetching advertisements:", error);
    throw new Error(error.message);
  }

  return data || [];
}
