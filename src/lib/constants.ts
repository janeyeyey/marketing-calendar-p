import { Solution } from './types'

export const SOLUTIONS: Solution[] = [
  'AI Business Solutions',
  'Cloud and AI Platforms',
  'Security',
  'All CSAs'
]

export const SOLUTION_COLORS: Record<Solution, string> = {
  'AI Business Solutions': 'var(--solution-ai)',
  'Cloud and AI Platforms': 'var(--solution-cloud)',
  'Security': 'var(--solution-security)',
  'All CSAs': 'var(--solution-csa)'
}

export const SOLUTION_COLOR_CLASSES: Record<Solution, string> = {
  'AI Business Solutions': 'bg-[var(--solution-ai)]',
  'Cloud and AI Platforms': 'bg-[var(--solution-cloud)]',
  'Security': 'bg-[var(--solution-security)]',
  'All CSAs': 'bg-[var(--solution-csa)]'
}

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const LOCATION_OPTIONS = [
  '마이크로소프트 13층',
  'Digital(한국어)',
  'Digital(영어, KUDO통역)',
  'Digital(영어, 한국어 자막)',
  'custom'
] as const
