import { MarketingEvent } from '@/lib/types'
import { DAYS_OF_WEEK } from '@/lib/constants'
import { getMonthDays, getEventsForDay, isCurrentMonth, isEventStartDay } from '@/lib/calendar-utils'
import { EventCard } from './EventCard'
import { cn } from '@/lib/utils'

interface CalendarGridProps {
  year: number
  month: number
  events: MarketingEvent[]
  onEventClick: (event: MarketingEvent) => void
}

export function CalendarGrid({ year, month, events, onEventClick }: CalendarGridProps) {
  const days = getMonthDays(year, month)
  
  const weeks: Date[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  
  const maxEventsPerDay = Math.max(
    ...days.map(day => getEventsForDay(events, day).length),
    1
  )
  
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
              const eventsToShow = dayEvents.filter(event => isEventStartDay(event, day))
              const isCurrentMonthDay = isCurrentMonth(day, month)
              const minHeight = Math.max(eventsToShow.length * 60 + 40, 100)
              
              return (
                <div
                  key={dayIdx}
                  className={cn(
                    "p-2 transition-colors",
                    !isCurrentMonthDay && "bg-muted/30"
                  )}
                  style={{ minHeight: `${minHeight}px` }}
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
                    {eventsToShow.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => onEventClick(event)}
                      />
                    ))}
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
