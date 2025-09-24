import { PostComment } from "../types/post";

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      //   timeZoneName: "short",
    }).format(d);
  } catch {
    return dateStr;
  }
};

export const truncate = (s: string, len: number) =>
  s.length <= len ? s : s.slice(0, len - 1) + "…";

export function updateNode(
  nodes: PostComment[],
  id: string,
  update: (n: PostComment) => PostComment
): PostComment[] {
  return nodes.map((n) => {
    if (String(n.id) === String(id)) return update(n);

    const kids: PostComment[] = Array.isArray(n.children) ? n.children : [];
    return kids.length ? { ...n, children: updateNode(kids, id, update) } : n;
  });
}