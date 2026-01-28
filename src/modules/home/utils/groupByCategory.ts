import { PostSummary } from "@/modules/post/types/post"

export type GroupedProjects = {
  category: string
  projects: PostSummary[]
}

export function groupByCategory(projects: PostSummary[]) {
  const map: Record<string, PostSummary[]> = {}

  projects.forEach((p) => {
    const key = p.category
    if (!map[key]) map[key] = []
    map[key].push(p)
  })

  return Object.entries(map).map(([category, projects]) => ({
    category,
    projects,
  }))
}