import { MarketingEvent } from '@/lib/types'
import { SOLUTION_COLORS } from '@/lib/constants'
import { MapPin, Link, CalendarBlank } from '@phosphor-icons/react'
import { parseDateKST } from '@/lib/calendar-utils'

interface EventCardProps {
  event: MarketingEvent
  onClick: () => void
}

export function EventCard({ event, onClick }: EventCardProps) {
  const solutionColor = SOLUTION_COLORS[event.solution]
  
  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  
  const isMultiDay = event.endDate && event.endDate !== event.date
  
  const getDurationText = () => {
    if (!isMultiDay) return null
    
    const startDate = parseDateKST(event.date)
    const endDate = parseDateKST(event.endDate!)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    
    return `${diffDays}일간`
  }
  
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-2 rounded text-xs transition-all hover:scale-[1.02] hover:shadow-md group"
      style={{
        borderLeft: `3px solid ${solutionColor}`,
        backgroundColor: 'var(--card)'
      }}
    >
      <div className="flex items-start justify-between gap-1 mb-1">
        <div 
          className="font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-1"
        >
          {event.title}
        </div>
        {isMultiDay && (
          <div className="flex items-center gap-0.5 text-[9px] bg-muted text-muted-foreground px-1 py-0.5 rounded shrink-0">
            <CalendarBlank size={9} />
            <span>{getDurationText()}</span>
          </div>
        )}
      </div>
      
      {event.location && (
        <div className="flex items-start gap-1 text-muted-foreground text-[10px] mb-1">
          <MapPin className="shrink-0 mt-0.5" size={10} />
          <span className="line-clamp-1">{event.location}</span>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {event.regPageUrl && (
          <button
            onClick={(e) => handleLinkClick(e, event.regPageUrl!)}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Link size={9} />
            <span>Reg</span>
          </button>
        )}
        
        {event.vivaEngageUrl && (
          <button
            onClick={(e) => handleLinkClick(e, event.vivaEngageUrl!)}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] bg-accent/30 text-accent-foreground hover:bg-accent/40 transition-colors"
          >
            <Link size={9} />
            <span>Viva</span>
          </button>
        )}
      </div>
    </button>
  )
}
