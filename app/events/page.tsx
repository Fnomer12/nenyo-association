'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'

type EventType = {
  id: string
  title: string
  time?: string
  location?: string
  details?: string
}

const MONTHS = [
  { value: 0, label: 'January' },
  { value: 1, label: 'February' },
  { value: 2, label: 'March' },
  { value: 3, label: 'April' },
  { value: 4, label: 'May' },
  { value: 5, label: 'June' },
  { value: 6, label: 'July' },
  { value: 7, label: 'August' },
  { value: 8, label: 'September' },
  { value: 9, label: 'October' },
  { value: 10, label: 'November' },
  { value: 11, label: 'December' },
]

function ymd(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function EventsPage() {
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [events, setEvents] = useState<Record<string, EventType[]>>({})

  // Load events from localStorage (temporary)
  useEffect(() => {
    const saved = localStorage.getItem('nenyo-events')
    if (saved) setEvents(JSON.parse(saved))
  }, [])

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()

  const todayKey = useMemo(() => ymd(new Date()), [])

  // Year list: auto-expands every new year (and includes any years found in saved events)
  const years = useMemo(() => {
    const y = new Set<number>()
    const nowY = new Date().getFullYear()

    for (let i = nowY - 5; i <= nowY + 10; i++) y.add(i)

    y.add(year)

    Object.keys(events).forEach((dateKey) => {
      const parsed = Number(dateKey.slice(0, 4))
      if (!Number.isNaN(parsed)) y.add(parsed)
    })

    return Array.from(y).sort((a, b) => a - b)
  }, [events, year])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const daysArray: Array<number | null> = []
  for (let i = 0; i < firstDay; i++) daysArray.push(null)
  for (let d = 1; d <= daysInMonth; d++) daysArray.push(d)

  function buildDateKey(day: number) {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  function setMonth(newMonth: number) {
    setCurrentDate(new Date(year, newMonth, 1))
    setSelectedDate(null)
  }

  function setYear(newYear: number) {
    setCurrentDate(new Date(newYear, month, 1))
    setSelectedDate(null)
  }

  function goPrevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDate(null)
  }

  function goNextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDate(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 sm:p-8 relative">
      {/* Back to Home */}
      <button
        onClick={() => router.push('/')}
        className="absolute left-4 top-4 sm:left-6 sm:top-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow hover:bg-gray-50 transition"
        aria-label="Back to Home"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Home</span>
      </button>

      <div className="mx-auto max-w-6xl pt-14 sm:pt-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Nenyo Association — Events Calendar
        </h1>

        {/* Month + Year Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 bg-white rounded-2xl shadow px-4 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={goPrevMonth}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Month dropdown */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-green-200"
              aria-label="Select month"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            {/* Year dropdown */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-green-200"
              aria-label="Select year"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={goNextMonth}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>

            {/* Jump to Today */}
            <button
              onClick={() => {
                const now = new Date()
                setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
                setSelectedDate(ymd(now))
              }}
              className="h-10 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Today
            </button>
          </div>

          
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-2xl shadow p-3 sm:p-4">
          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div
                key={d}
                className="text-center text-xs sm:text-sm font-bold text-gray-700"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {daysArray.map((day, idx) => {
              const dateKey = day !== null ? buildDateKey(day) : ''
              const isSelected = dateKey && selectedDate === dateKey
              const isToday = dateKey && dateKey === todayKey
              const hasEvents = dateKey && !!events[dateKey]?.length

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={day === null}
                  onClick={() => day && setSelectedDate(dateKey)}
                  className={[
                    'min-h-[86px] sm:min-h-[110px] rounded-xl border p-2 text-left transition relative',
                    day === null
                      ? 'bg-gray-50 border-transparent'
                      : 'bg-white hover:bg-gray-50',
                    isSelected
                      ? 'border-green-500 ring-2 ring-green-200 bg-green-50'
                      : 'border-gray-200',
                    // Today highlight (when viewing the month containing today)
                    isToday && !isSelected
                      ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                      : '',
                  ].join(' ')}
                >
                  {day !== null && (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-gray-900">{day}</div>

                          {/* Today badge */}
                          {isToday && (
                            <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                              Today
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] sm:text-xs text-gray-500">
                          {hasEvents ? `${events[dateKey].length} event(s)` : ''}
                        </div>
                      </div>

                      <div className="mt-2 space-y-1">
                        {events[dateKey]?.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className="text-[10px] sm:text-xs bg-green-100 text-green-900 px-2 py-1 rounded-lg border border-green-200 truncate"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}

                        {events[dateKey]?.length > 2 && (
                          <div className="text-[10px] sm:text-xs text-green-700 font-medium">
                            +{events[dateKey].length - 2} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <div className="mt-6 sm:mt-8 bg-white p-5 sm:p-6 rounded-2xl shadow">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Events on <span className="text-green-700">{selectedDate}</span>
            </h3>

            {events[selectedDate]?.length ? (
              <div className="space-y-4">
                {events[selectedDate].map((event) => (
                  <div key={event.id} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    {event.time && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Time:</span> {event.time}
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Location:</span> {event.location}
                      </p>
                    )}
                    {event.details && (
                      <p className="text-sm text-gray-600 mt-2">{event.details}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No events for this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}