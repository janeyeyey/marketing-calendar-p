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
    const newEvent: MarketingEvent = { id: makeId(), .
