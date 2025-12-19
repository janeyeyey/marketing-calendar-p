import { useEffect, useMemo, useState } from "react";
import { MarketingEvent, Solution } from "../lib/types";
import { CalendarHeader } from "../components/CalendarHeader";
import { CalendarGrid } from "../components/CalendarGrid";
import { EventDetailModal } from "../components/EventDetailModal";
import { Toaster } from "../components/ui/sonner";

import { AddEventModal } from "../components/AddEventModal";
import { EditEventModal } from "../components/EditEventModal";

const GITHUB_EDIT_URL =
  "https://github.com/janeyeyey/marketing-calendar-p/edit/main/public/events.json";

function downloadJson(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// 간단한 id 생성 (DB 없으니 충돌만 안 나면 됨)
function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ev_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function AdminApp() {
  const [events, setEvents] = useState<MarketingEvent[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "events.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load events.json: ${res.status}`);
        return res.json();
      })
      .then((data: unknown) => {
        setEvents(Array.isArray(data) ? (data as MarketingEvent[]) : []);
        setLoadError(null);
      })
      .catch((err) => {
        console.error(err);
        setEvents([]);
        setLoadError(String(err?.message ?? err));
      });
  }, []);

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const [selectedSolutions, setSelectedSolutions] = useState<Solution[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MarketingEvent | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    if (selectedSolutions.length === 0) return events;
    return events.filter((event) => selectedSolutions.includes(event.solution));
  }, [events, selectedSolutions]);

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

  // 드래그 안 함: CalendarGrid가 호출해도 무시
  const handleEventDrop = () => {
    /* no-op */
  };

  const handleExport = async () => {
    const json = JSON.stringify(events, null, 2);

    // 1) clipboard
    try {
      await navigator.clipboard.writeText(json);
    } catch {
      // ignore
    }

    // 2) download (권한 실패 대비)
    downloadJson("events.json", json);
  };

  const openGitHubEditor = () => {
    window.open(GITHUB_EDIT_URL, "_blank", "noopener,noreferrer");
  };

  // ===== CRUD (로컬 상태만) =====
  const addEvent = (eventWithoutId: Omit<MarketingEvent, "id">) => {
    const newEvent: MarketingEvent = { id: makeId(), ...eventWithoutId };
    setEvents((prev) => [...prev, newEvent]);
  };

  const editEvent = (updated: MarketingEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setSelectedEvent(updated);
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setIsEditOpen(false);
    setIsDetailModalOpen(false);
    setSelectedEvent(null);
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
          onAddEvent={() => setIsAddOpen(true)}
        />

        {/* Admin 전용 버튼 */}
        <div className="flex flex-wrap gap-2 items-center">
          <button
            type="button"
            className="px-3 py-2 rounded-md border bg-background hover:opacity-90"
            onClick={handleExport}
          >
            Export events.json (copy + download)
          </button>

          <button
            type="button"
            className="px-3 py-2 rounded-md border bg-background hover:opacity-90"
            onClick={openGitHubEditor}
          >
            Open GitHub events.json editor
          </button>

          {loadError && (
            <div className="text-sm opacity-80">
              events.json 로드 실패로 빈 목록에서 시작: {loadError}
            </div>
          )}
        </div>

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
          if (!selectedEvent) return;
          setIsEditOpen(true);
        }}
      />

      {/* Add / Edit 모달 - 네 props 시그니처에 정확히 맞춤 */}
      <AddEventModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={(ev) => addEvent(ev)}
      />

      <EditEventModal
        open={isEditOpen}
        event={selectedEvent}
        onClose={() => setIsEditOpen(false)}
        onEdit={(ev) => editEvent(ev)}
        onDelete={(id) => deleteEvent(id)}
      />

      <Toaster />
    </div>
  );
}
