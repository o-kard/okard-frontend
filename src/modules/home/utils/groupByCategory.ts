import { HomeCampaign } from "../types/types"

export type GroupedProjects = {
  category: string
  projects: HomeCampaign[]
}

export function groupByCategory(projects: HomeCampaign[]) {
  const map: Record<string, HomeCampaign[]> = {}

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