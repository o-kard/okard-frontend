import { useCallback, useEffect, useState } from "react";
import { CampaignComment } from "../types/campaign";
import { fetchCommentsByCampaignId } from "../api/api";

export function useComments(campaignId: string, clerkId?: string | null) {
  const [tree, setTree] = useState<CampaignComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCommentsByCampaignId(campaignId, clerkId ?? null);
      setTree(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [campaignId, clerkId]);

  useEffect(() => {
    load();
  }, [load]);

  return { tree, setTree, loading, error, reload: load };
}