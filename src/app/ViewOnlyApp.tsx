import { useState, useMemo, useEffect } from "react";
import { MarketingEvent, Solution } from "../lib/types";
import { CalendarHeader } from "../components/CalendarHeader";
import { CalendarGrid } from "../components/CalendarGrid";
import { EventDetailModal } from "../components/EventDetailModal";
import { Toaster } from "../components/ui/sonner";

export default function ViewOnlyApp() {
  const isEditable = false;

  const [events, setEvents] = useState<MarketingEvent[]>([]);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "events.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load events.json: ${res.status}`);
        return res.json();
      })
      .then((data: unknown) => {
        setEvents(Array.isArray(data) ? (data as MarketingEvent[]) : []);
      })
      .catch((err) => {
        console.error(err);
        setEvents([]);
      });
  }, []);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [selectedSolutions, setSelectedSolutions] = useState<Solution[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MarketingEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const allEvents = events;

  const filteredEvents = useMemo(() => {
    if (selectedSolutions.length === 0) return allEvents;
    return allEvents.filter((event) => selectedSolutions.includes(event.solution));
  }, [allEvents, selectedSolutions]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToggleSolution = (solution: Solution) => {
    setSelectedSolutions((current) => {
      if (current.includes(solution)) return current.filter((s) => s !== solution);
      return [...current, solution];
    });
  };

  const handleEventClick = (event: MarketingEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEventDrop = () => {
    /* view-only: no-op */
  };

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
          onAddEvent={() => {}}
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
          setIsDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={() => {
          if (!isEditable) return;
        }}
      />

      <Toaster />
    </div>
  );
}
