import { MarketingEvent } from '@/lib/types'
import { DAYS_OF_WEEK } from '@/lib/constants'
import { getMonthDays, getEventsForDay, isCurrentMonth, isEventStartDay, formatDate } from '@/lib/calendar-utils'
import { EventCard } from './EventCard'
import { EventContinuation } from './EventContinuation'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface CalendarGridProps {
  year: number
  month: number
  events: MarketingEvent[]
  onEventClick: (event: MarketingEvent) => void
  onEventDrop?: (eventId: string, newDate: string) => void
}

export function CalendarGrid({ year, month, events, onEventClick, onEventDrop }: CalendarGridProps) {
  const days = getMonthDays(year, month)
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null)
  const [dragOverDay, setDragOverDay] = useState<string | null>(null)
  
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  
  const maxEventsPerDay = Math.max(
    ...days.map(day => getEventsForDay(events, day).length),
    1
  )
  
  const handleDragStart = (event: MarketingEvent) => {
    setDraggedEventId(event.id)
  }
  
  const handleDragOver = (e: React.DragEvent, day: Date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const dayStr = formatDate(day)
    setDragOverDay(dayStr)
  }
  
  const handleDragLeave = () => {
    setDragOverDay(null)
  }
  
  const handleDrop = (e: React.DragEvent, day: Date) => {
    e.preventDefault()
    setDragOverDay(null)
    
    if (draggedEventId && onEventDrop) {
      const newDateStr = formatDate(day)
      const draggedEvent = events.find(ev => ev.id === draggedEventId)
      
      if (draggedEvent && draggedEvent.date !== newDateStr) {
        onEventDrop(draggedEventId, newDateStr)
      }
    }
    
    setDraggedEventId(null)
  }
  
  const handleDragEnd = () => {
    setDraggedEventId(null)
    setDragOverDay(null)
  }
  
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="p-3 text-center font-semibold text-sm text-muted-foreground bg-muted"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="divide-y divide-border">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 divide-x divide-border">
            {week.map((day, dayIdx) => {
              const dayEvents = getEventsForDay(events, day)
              const isCurrentMonthDay = isCurrentMonth(day, month)
              const totalEvents = dayEvents.length
              const minHeight = Math.max(totalEvents * 60 + 40, 100)
              const dayStr = formatDate(day)
              const isDragOver = dragOverDay === dayStr
              
              return (
                <div
                  key={dayIdx}
                  className={cn(
                    "p-2 transition-colors relative",
                    !isCurrentMonthDay && "bg-muted/30",
                    isDragOver && "bg-primary/10 ring-2 ring-primary ring-inset"
                  )}
                  style={{ minHeight: `${minHeight}px` }}
                  onDragOver={(e) => handleDragOver(e, day)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day)}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      isCurrentMonthDay ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.map((event) => {
                      const isStart = isEventStartDay(event, day)
                      
                      return isStart ? (
                        <EventCard
                          key={event.id}
                          event={event}
                          onClick={() => onEventClick(event)}
                          onDragStart={onEventDrop ? handleDragStart : undefined}
                        />
                      ) : (
                        <EventContinuation
                          key={`continuation-${event.id}`}
                          event={event}
                          onClick={() => onEventClick(event)}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
