import { MarketingEvent } from '@/lib/types'
import { SOLUTION_COLORS } from '@/lib/constants'

interface EventCardProps {
  event: MarketingEvent
  onClick: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const solutionColor = SOLUTION_COLORS[event.solution]
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded text-xs transition-all hover:scale-[1.02] hover:shadow-md group"
      style={{
        borderLeft: `3px solid ${solutionColor}`,
        backgroundColor: 'var(--card)'
      }}
    >
      <div 
        className="font-semibold text-foreground leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors"
      >
        {event.title}
      </div>
      <div className="text-muted-foreground text-[10px]">
        {event.time}
      </div>
    </button>
  )
}
