import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toggleBookmark } from "../api/api";

export function useBookmark(campaignId: string, initialStatus: boolean = false) {
  const { getToken } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleBookmark = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        console.warn("User not authenticated to bookmark");
        setIsLoading(false);
        return;
      }

      const response = await toggleBookmark(campaignId, token);
      setIsBookmarked(response.bookmarked);
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
      // Optional: rollback state or show toast
    } finally {
      setIsLoading(false);
    }
  };

  return { isBookmarked, isLoading, handleToggleBookmark, setIsBookmarked };
}
