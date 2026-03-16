import { createComment, likeComment, unlikeComment } from "../api/api";
import { updateNode } from "../utils/commentHelpers";
import type { CampaignComment } from "../types/campaign";

export function useCommentActions(
  setTree: React.Dispatch<React.SetStateAction<CampaignComment[]>>,
  campaignId: string,
  clerkId?: string,
  apiBaseUrl?: string
) {
  const toggleLike = async (id: string, isLiked: boolean) => {
    try {
      if (!apiBaseUrl || !clerkId) return;
      const resp = isLiked
        ? await unlikeComment(id, clerkId)
        : await likeComment(id, clerkId);

      setTree((prev) =>
        updateNode(prev, id, (n) => ({
          ...n,
          likes: resp.likes ?? n.likes,
          is_liked: resp.is_liked ?? !isLiked,
        }))
      );
    } catch (e) {
      console.error("toggleLike error", e);
    }
  };

  const postComment = async (content: string, parentId?: string) => {
    if (!apiBaseUrl) return;

    const fd = new FormData();
    fd.append(
      "data",
      JSON.stringify({ content: content.trim(), campaign_id: campaignId, parent_id: parentId ?? null })
    );

    const res = await createComment(fd, clerkId || "");
    const json = res as CampaignComment;

    if (parentId) {
      setTree((prev) =>
        updateNode(prev, parentId, (n) => {
          const kids = (n.children as CampaignComment[] | null | undefined) ?? [];
          return { ...n, children: [...kids, { ...json, children: [] }] };
        })
      );
    } else {
      setTree((prev) => [{ ...json, children: [] }, ...prev]);
    }
  };

  return { toggleLike, postComment };
}