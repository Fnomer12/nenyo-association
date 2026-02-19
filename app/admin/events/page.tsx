'use client'

import { useEffect, useMemo, useState } from 'react'

type EventType = {
  id: string
  title: string
  time?: string
  location?: string
  details?: string
}

type EventsByDate = Record<string, EventType[]>

const STORAGE_KEY = 'nenyo-events'

function uid() {
  // Simple unique id (fine for localStorage demo)
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export default function AdminEventsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = String(now.getMonth() + 1).padStart(2, '0')
    const d = String(now.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  })

  const [events, setEvents] = useState<EventsByDate>({})
  const [query, setQuery] = useState('')

  // form state
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [details, setDetails] = useState('')

  const [editing, setEditing] = useState<{ dateKey: string; eventId: string } | null>(null)

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setEvents(JSON.parse(saved))
    } catch {
      // ignore malformed storage
      setEvents({})
    }
  }, [])

  // Save to localStorage whenever events changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  }, [events])

  const selectedEvents = events[selectedDate] ?? []

  const filteredSelectedEvents = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return selectedEvents
    return selectedEvents.filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        (e.location ?? '').toLowerCase().includes(q) ||
        (e.details ?? '').toLowerCase().includes(q) ||
        (e.time ?? '').toLowerCase().includes(q)
      )
    })
  }, [query, selectedEvents])

  function resetForm() {
    setTitle('')
    setTime('')
    setLocation('')
    setDetails('')
    setEditing(null)
  }

  function startEdit(dateKey: string, event: EventType) {
    setSelectedDate(dateKey)
    setTitle(event.title)
    setTime(event.time ?? '')
    setLocation(event.location ?? '')
    setDetails(event.details ?? '')
    setEditing({ dateKey, eventId: event.id })
  }

  function upsertEvent() {
    const trimmed = title.trim()
    if (!trimmed) return

    // Edit existing
    if (editing) {
      setEvents((prev) => {
        const dateKey = editing.dateKey
        const list = prev[dateKey] ?? []
        const nextList = list.map((e) =>
          e.id === editing.eventId
            ? {
                ...e,
                title: trimmed,
                time: time.trim() || undefined,
                location: location.trim() || undefined,
                details: details.trim() || undefined,
              }
            : e
        )
        return { ...prev, [dateKey]: nextList }
      })
      resetForm()
      return
    }

    // Create new
    const newEvent: EventType = {
      id: uid(),
      title: trimmed,
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      details: details.trim() || undefined,
    }

    setEvents((prev) => {
      const list = prev[selectedDate] ?? []
      return { ...prev, [selectedDate]: [newEvent, ...list] }
    })

    resetForm()
  }

  function deleteEvent(dateKey: string, eventId: string) {
    setEvents((prev) => {
      const list = prev[dateKey] ?? []
      const nextList = list.filter((e) => e.id !== eventId)
      const next = { ...prev, [dateKey]: nextList }

      // clean empty date keys
      if (nextList.length === 0) {
        const { [dateKey]: _, ...rest } = next
        return rest
      }
      return next
    })

    // if deleting the one we're editing, reset form
    if (editing && editing.dateKey === dateKey && editing.eventId === eventId) {
      resetForm()
    }
  }

  function clearAll() {
    if (!confirm('Clear ALL events from localStorage?')) return
    setEvents({})
    resetForm()
  }

  const totalCount = useMemo(() => {
    return Object.values(events).reduce((acc, arr) => acc + arr.length, 0)
  }, [events])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin — Events</h1>
            <p className="text-sm text-gray-600 mt-1">
              Events saved to <span className="font-mono">{STORAGE_KEY}</span> and will show on the user calendar page.
            </p>
          </div>

          <button
            onClick={clearAll}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Clear All
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-500">Total events</div>
            <div className="text-2xl font-bold">{totalCount}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-500">Selected date</div>
            <div className="text-2xl font-bold">{selectedDate}</div>
          </div>
          <div className="bg-white rounded shadow p-4">
            <div className="text-sm text-gray-500">Events on date</div>
            <div className="text-2xl font-bold">{selectedEvents.length}</div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded shadow p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label className="text-sm font-semibold">Event Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-semibold">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nenyo General Meeting"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold">Time</label>
              <input
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 6:00 PM"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Accra"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-sm font-semibold">Search (selected date)</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter events..."
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold">Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Optional extra info..."
              className="mt-1 w-full border rounded px-3 py-2 min-h-[90px]"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={upsertEvent}
              className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            >
              {editing ? 'Update Event' : 'Add Event'}
            </button>

            {editing && (
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* List for selected date */}
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold">Events on {selectedDate}</h2>
            <div className="text-sm text-gray-600">
              Showing {filteredSelectedEvents.length} / {selectedEvents.length}
            </div>
          </div>

          {filteredSelectedEvents.length ? (
            <div className="space-y-3">
              {filteredSelectedEvents.map((event) => (
                <div key={event.id} className="border rounded p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-semibold text-lg truncate">{event.title}</div>
                    <div className="text-sm text-gray-700 mt-1 space-y-1">
                      {event.time && <div><span className="font-semibold">Time:</span> {event.time}</div>}
                      {event.location && <div><span className="font-semibold">Location:</span> {event.location}</div>}
                      {event.details && <div className="text-gray-600">{event.details}</div>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(selectedDate, event)}
                      className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteEvent(selectedDate, event.id)}
                      className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No events for this date.</p>
          )}
        </div>

        {/* Note */}
        <div className="text-sm text-gray-600">
          ⚠️ Note: localStorage is browser/device-specific. For real admins + real users, we should move this to a database
          (Supabase/Postgres) so everyone sees the same events.
        </div>
      </div>
    </div>
  )
}
