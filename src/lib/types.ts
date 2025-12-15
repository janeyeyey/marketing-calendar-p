export type Solution = 'AI Business Solutions' | 'Cloud and AI Platforms' | 'Security' | 'All CSAs'

export interface MarketingEvent {
  id: string
  title: string
  solution: Solution
  date: string
  endDate?: string
  time?: string
  location: string
  regPageUrl?: string
  vivaEngageUrl?: string
}
