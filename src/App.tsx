import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { MarketingEvent, Solution } from './lib/types'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarGrid } from './components/CalendarGrid'
import { EventDetailModal } from './components/EventDetailModal'
import { AddEventModal } from './components/AddEventModal'
import { EditEventModal } from './components/EditEventModal'
import { Toaster } from './components/ui/sonner'

function App() {
  const [events, setEvents] = useKV<MarketingEvent[]>('marketing-events', [])
  
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  
  const [selectedSolutions, setSelectedSolutions] = useState<Solution[]>([])
  const [selectedEvent, setSelectedEvent] = useState<MarketingEvent | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<MarketingEvent | null>(null)
  
  const allEvents = events || []
  
  const filteredEvents = useMemo(() => {
    if (selectedSolutions.length === 0) {
      return allEvents
    }
    return allEvents.filter(event => selectedSolutions.includes(event.solution))
  }, [allEvents, selectedSolutions])
  
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }
  
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }
  
  const handleToggleSolution = (solution: Solution) => {
    setSelectedSolutions(current => {
      if (current.includes(solution)) {
        return current.filter(s => s !== solution)
      } else {
        return [...current, solution]
      }
    })
  }
  
  const handleAddEvent = (eventData: Omit<MarketingEvent, 'id'>) => {
    const newEvent: MarketingEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    setEvents(current => [...(current || []), newEvent])
  }
  
  const handleEventClick = (event: MarketingEvent) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }
  
  const handleEditEvent = (event: MarketingEvent) => {
    setEventToEdit(event)
    setIsEditModalOpen(true)
  }
  
  const handleUpdateEvent = (updatedEvent: MarketingEvent) => {
    setEvents(current => 
      (current || []).map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    )
  }
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(current => 
      (current || []).filter(event => event.id !== eventId)
    )
  }
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <CalendarHeader
          year={currentYear}
          month={currentMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          selectedSolutions={selectedSolutions}
          onToggleSolution={handleToggleSolution}
          onAddEvent={() => setIsAddModalOpen(true)}
        />
        
        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          events={filteredEvents}
          onEventClick={handleEventClick}
        />
      </div>
      
      <EventDetailModal
        event={selectedEvent}
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedEvent(null)
        }}
        onEdit={handleEditEvent}
      />
      
      <AddEventModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEvent}
      />
      
      <EditEventModal
        event={eventToEdit}
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEventToEdit(null)
        }}
        onEdit={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />
      
      <Toaster />
    </div>
  )
}

export default App