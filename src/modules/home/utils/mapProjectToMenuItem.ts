import { Project } from "../types/types";

export function mapProjectToMenuItem(p: Project) {
  return {
    image: p.coverImage || "", // fallback ได้
    link: `/project/${p.id}`,
    title: p.name,
    description: p.description,
    creator: p.creator
    ? {
        name: p.creator.name,
        avatar: p.creator.avatar,
      }
    : undefined,
    donatedAmount: p.donatedAmount,
    supporters: p.supporters,
    percent: p.percent,
    category: p.category,
  };
}
