import { useState, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import { MarketingEvent, Solution } from './lib/types'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarGrid } from './components/CalendarGrid'
import { EventDetailModal } from './components/EventDetailModal'
import { AddEventModal } from './components/AddEventModal'
import { EditEventModal } from './components/EditEventModal'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const isEditable = typeof window !== 'undefined' && window.location.hostname !== 'janeyeyey.github.io'

  // ✅ Spark KV 저장소 (네가 저장해둔 이벤트들이 여기 있음)
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
    if (selectedSolutions.length === 0) return allEvents
    return allEvents.filter((event) => selectedSolutions.includes(event.solution))
  }, [allEvents, selectedSolutions])

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleToggleSolution = (solution: Solution) => {
    setSelectedSolutions((current) => {
      if (current.includes(solution)) return current.filter((s) => s !== solution)
      return [...current, solution]
    })
  }

  const handleAddEvent = (eventData: Omit<MarketingEvent, 'id'>) => {
    if (!isEditable) return

    const newEvent: MarketingEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    setEvents((current) => [...(current || []), newEvent])
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
    setEvents((current) => (current || []).map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
  }

  const handleDeleteEvent = (eventId: string) => {
    if (!isEditable) return
    setEvents((current) => (current || []).filter((e) => e.id !== eventId))
  }

  const handleEventDrop = (eventId: string, newDate: string) => {
    if (!isEditable) return

    const eventForToast = allEvents.find((e) => e.id === eventId)

    setEvents((current) => {
      const list = current || []
      const event = list.find((e) => e.id === eventId)
      if (!event) return list

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

        return list.map((e) => (e.id === eventId ? { ...e, date: newDate, endDate: newEndDateStr } : e))
      }

      return list.map((e) => (e.id === eventId ? { ...e, date: newDate } : e))
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

  // ✅ “연동처럼” 만들기: events.json을 클립보드에 복사 + GitHub 편집 페이지 열기
  const publishToPages = async () => {
    if (!isEditable) return

    const json = JSON.stringify(allEvents, null, 2)

    try {
      await navigator.clipboard.writeText(json)
      toast.success('events.json이 클립보드에 복사됐어요. GitHub에서 붙여넣고 Commit 해주세요.')

      window.open(
        'https://github.com/janeyeyey/marketing-calendar-p/edit/main/public/events.json',
        '_blank'
      )
    } catch (e) {
      console.error(e)
      toast.error('클립보드 복사에 실패했어요. 브라우저 권한을 확인해 주세요.')
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* ✅ 편집자용 Publish 버튼 */}
        {isEditable && (
          <div className="flex justify-end">
            <button
              onClick={publishToPages}
              className="px-3 py-2 rounded-md border text-sm hover:bg-muted"
              type="button"
            >
              Publish to View-only (copy + open GitHub)
            </button>
          </div>
        )}

        <div className="space-y-6">
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
        <AddEventModal open={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddEvent} />
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
