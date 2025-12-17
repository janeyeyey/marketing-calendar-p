import { useState, useMemo, useEffect } from 'react'
import { MarketingEvent, Solution } from './lib/types'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarGrid } from './components/CalendarGrid'
import { EventDetailModal } from './components/EventDetailModal'
import { AddEventModal } from './components/AddEventModal'
import { EditEventModal } from './components/EditEventModal'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'

function App() {
  // ✅ Pages(view-only)에서는 편집 기능 숨김
  const isEditable = import.meta.env.MODE !== 'production'

  // ✅ Spark(useKV) 대신: repo의 public/events.json을 읽어서 state로 관리
  const [events, setEvents] = useState<MarketingEvent[]>([])

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + 'events.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load events.json: ${res.status}`)
        return res.json()
      })
      .then((data: MarketingEvent[]) => setEvents(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error(err)
        setEvents([])
      })
  }, [])

  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())

  const [selectedSolutions, setSelectedSolutions] = useState<Solution[]>([])
  const [selectedEvent, setSelectedEvent] = useState<MarketingEvent | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<MarketingEvent | null>(null)

  const allEvents = events

  const filteredEvents = useMemo(() => {
    if (selectedSolutions.length === 0) return allEvents
    return allEvents.filter((event) => selectedSolutions.includes(event.solution))
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
    setSelectedSolutions((current) => {
      if (current.includes(solution)) return current.filter((s) => s !== solution)
      return [...current, solution]
    })
  }

  // ⚠️ view-only에서는 UI를 숨겨서 호출 자체가 거의 없지만, 안전하게 가드
  const handleAddEvent = (eventData: Omit<MarketingEvent, 'id'>) => {
    if (!isEditable) return

    const newEvent: MarketingEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    setEvents((current) => [...current, newEvent])
  }

  const handleEventClick = (event: MarketingEvent) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }

  const handleEditEvent = (event: MarketingEvent) => {
    if (!isEditable) return
    setEventToEdit(event)
    setIsEditModalOpen(true)
  }

  const handleUpdateEvent = (updatedEvent: MarketingEvent) => {
    if (!isEditable) return
    setEvents((current) => current.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const handleDeleteEvent = (eventId: string) => {
    if (!isEditable) return
    setEvents((current) => current.filter((event) => event.id !== eventId))
  }

  const handleEventDrop = (eventId: string, newDate: string) => {
    if (!isEditable) return

    const eventForToast = allEvents.find((e) => e.id === eventId)

    setEvents((current) => {
      const event = current.find((e) => e.id === eventId)
      if (!event) return current

      const oldStartDate = event.date
      const oldEndDate = event.endDate

      // 기간 이벤트면 duration 유지
      if (oldEndDate && oldEndDate !== oldStartDate) {
        const startDate = new Date(oldStartDate)
        const endDate = new Date(oldEndDate)
        const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

        const newStartDate = new Date(newDate)
        const newEndDate = new Date(newStartDate)
        newEndDate.setDate(newEndDate.getDate() + duration)

        const year = newEndDate.getFullYear()
        const month = String(newEndDate.getMonth() + 1).padStart(2, '0')
        const day = String(newEndDate.getDate()).padStart(2, '0')
        const newEndDateStr = `${year}-${month}-${day}`

        return current.map((e) => (e.id === eventId ? { ...e, date: newDate, endDate: newEndDateStr } : e))
      }

      return current.map((e) => (e.id === eventId ? { ...e, date: newDate } : e))
    })

    if (eventForToast) {
      const formattedDate = new Date(newDate).toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Seoul',
      })
      toast.success(`"${eventForToast.title}" 이벤트가 ${formattedDate}로 이동되었습니다`)
    }
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
          onAddEvent={() => {
            if (isEditable) setIsAddModalOpen(true)
          }}
        />

        <CalendarGrid
          year={currentYear}
          month={currentMonth}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onEventDrop={handleEventDrop}
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

      {isEditable && (
        <AddEventModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddEvent}
        />
      )}

      {isEditable && (
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
      )}

      <Toaster />
    </div>
  )
}

export default App
