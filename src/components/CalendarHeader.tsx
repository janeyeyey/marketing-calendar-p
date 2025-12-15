import { Solution } from '@/lib/types'
import { SOLUTIONS, SOLUTION_COLORS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, CaretLeft, CaretRight, Funnel } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface CalendarHeaderProps {
  year: number
  month: number
  onPrevMonth: () => void
  onNextMonth: () => void
  selectedSolutions: Solution[]
  onToggleSolution: (solution: Solution) => void
  onAddEvent: () => void
}

export function CalendarHeader({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  selectedSolutions,
  onToggleSolution,
  onAddEvent,
}: CalendarHeaderProps) {
  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  
  const isAllSelected = selectedSolutions.length === 0
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight">{monthName}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onPrevMonth}
              className="h-9 w-9"
            >
              <CaretLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onNextMonth}
              className="h-9 w-9"
            >
              <CaretRight size={20} />
            </Button>
          </div>
        </div>
        
        <Button
          onClick={onAddEvent}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus size={20} weight="bold" />
          Add Event
        </Button>
      </div>
      
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Funnel size={16} />
          <span className="font-medium">Filter:</span>
        </div>
        
        <button
          onClick={() => onToggleSolution('AI Business Solutions')}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:scale-105",
            isAllSelected || selectedSolutions.includes('AI Business Solutions')
              ? "text-white shadow-md"
              : "bg-secondary text-secondary-foreground border border-border"
          )}
          style={{
            backgroundColor: (isAllSelected || selectedSolutions.includes('AI Business Solutions'))
              ? SOLUTION_COLORS['AI Business Solutions']
              : undefined
          }}
        >
          AI Business Solutions
        </button>
        
        <button
          onClick={() => onToggleSolution('Cloud and AI Platforms')}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:scale-105",
            isAllSelected || selectedSolutions.includes('Cloud and AI Platforms')
              ? "text-white shadow-md"
              : "bg-secondary text-secondary-foreground border border-border"
          )}
          style={{
            backgroundColor: (isAllSelected || selectedSolutions.includes('Cloud and AI Platforms'))
              ? SOLUTION_COLORS['Cloud and AI Platforms']
              : undefined
          }}
        >
          Cloud and AI Platforms
        </button>
        
        <button
          onClick={() => onToggleSolution('Security')}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:scale-105",
            isAllSelected || selectedSolutions.includes('Security')
              ? "text-white shadow-md"
              : "bg-secondary text-secondary-foreground border border-border"
          )}
          style={{
            backgroundColor: (isAllSelected || selectedSolutions.includes('Security'))
              ? SOLUTION_COLORS['Security']
              : undefined
          }}
        >
          Security
        </button>
        
        <button
          onClick={() => onToggleSolution('All CSAs')}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all hover:scale-105",
            isAllSelected || selectedSolutions.includes('All CSAs')
              ? "shadow-md"
              : "bg-secondary text-secondary-foreground border border-border"
          )}
          style={{
            backgroundColor: (isAllSelected || selectedSolutions.includes('All CSAs'))
              ? SOLUTION_COLORS['All CSAs']
              : undefined,
            color: (isAllSelected || selectedSolutions.includes('All CSAs'))
              ? 'var(--foreground)'
              : undefined
          }}
        >
          All CSAs
        </button>
        
        {!isAllSelected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              SOLUTIONS.forEach(sol => {
                if (selectedSolutions.includes(sol)) {
                  onToggleSolution(sol)
                }
              })
            }}
            className="text-xs h-8"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  )
}
