import { MarketingEvent } from './types'

export function getMonthDays(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  const days: Date[] = []
  
  for (let i = 0; i < startDay; i++) {
    const prevMonthDay = new Date(year, month, -startDay + i + 1)
    days.push(prevMonthDay)
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i))
  }
  
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i))
  }
  
  return days
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKST(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function getEventsForDay(events: MarketingEvent[], date: Date): MarketingEvent[] {
  const dateStr = formatDate(date)
  const dayEvents = events.filter(event => {
    const eventStartDate = parseDateKST(event.date)
    const eventEndDate = event.endDate ? parseDateKST(event.endDate) : eventStartDate
    
    return date >= eventStartDate && date <= eventEndDate
  })
  
  return dayEvents.sort((a, b) => {
    const aStart = parseDateKST(a.date)
    const bStart = parseDateKST(b.date)
    return aStart.getTime() - bStart.getTime()
  })
}

export function isEventStartDay(event: MarketingEvent, date: Date): boolean {
  const eventStartDate = parseDateKST(event.date)
  return isSameDay(date, eventStartDate)
}

export function isEventEndDay(event: MarketingEvent, date: Date): boolean {
  const eventEndDate = event.endDate ? parseDateKST(event.endDate) : parseDateKST(event.date)
  return isSameDay(date, eventEndDate)
}

export function isEventContinuation(event: MarketingEvent, date: Date): boolean {
  return !isEventStartDay(event, date) && !isEventEndDay(event, date)
}

export function isCurrentMonth(date: Date, currentMonth: number): boolean {
  return date.getMonth() === currentMonth
}

export function formatDateDisplay(dateStr: string): string {
  const date = parseDateKST(dateStr)
  return date.toLocaleDateString('ko-KR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    timeZone: 'Asia/Seoul'
  })
}
