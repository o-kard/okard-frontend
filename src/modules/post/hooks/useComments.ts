import { useCallback, useEffect, useState } from "react";
import { PostComment } from "../types/post";
import { fetchComments } from "../api/api";

export function useComments(postId: string, clerkId?: string | null) {
  const [tree, setTree] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComments(postId, clerkId ?? null);
      setTree(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [postId, clerkId]);

  useEffect(() => {
    load();
  }, [load]);

  return { tree, setTree, loading, error, reload: load };
}