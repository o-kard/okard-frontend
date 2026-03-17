import { CampaignSummary } from "@/modules/campaign/types/campaign"

export type GroupedProjects = {
  category: string
  projects: CampaignSummary[]
}

export function groupByCategory(projects: CampaignSummary[]) {
  const map: Record<string, CampaignSummary[]> = {}

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