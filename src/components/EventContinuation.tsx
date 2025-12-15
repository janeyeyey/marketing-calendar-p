import { MarketingEvent } from '@/lib/types'
import { SOLUTION_COLORS } from '@/lib/constants'
import { ArrowRight } from '@phosphor-icons/react'

interface EventContinuationProps {
  event: MarketingEvent
  onClick: () => void
}

export function EventContinuation({ event, onClick }: EventContinuationProps) {
  const solutionColor = SOLUTION_COLORS[event.solution]
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded text-xs transition-all hover:scale-[1.02] hover:shadow-md group"
      style={{
        borderLeft: `3px solid ${solutionColor}`,
        backgroundColor: 'var(--card)',
        opacity: 0.85
      }}
    >
      <div className="flex items-center gap-2">
        <ArrowRight 
          size={12} 
          className="shrink-0 text-muted-foreground"
          weight="bold"
        />
        <div 
          className="font-medium text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors flex-1 italic"
        >
          {event.title}
        </div>
      </div>
      
      <div className="ml-5 mt-0.5 text-[9px] text-muted-foreground">
        계속됨
      </div>
    </button>
  )
}
