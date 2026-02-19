'use client'

import { useState, useEffect } from 'react'

type EventType = {
  id: string
  title: string
  time?: string
  location?: string
  details?: string
}

export default function EventsPage() {
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

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const daysArray = []
  for (let i = 0; i < firstDay; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        Nenyo Association — Events Calendar
      </h1>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          ◀
        </button>

        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleString('default', { month: 'long' })} {year}
        </h2>

        <button
          onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          ▶
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3 bg-white p-4 rounded shadow">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}

        {daysArray.map((day, index) => {
          const dateKey =
            day !== null
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : ''

          return (
            <div
              key={index}
              className={`min-h-[100px] border rounded p-2 cursor-pointer ${
                selectedDate === dateKey ? 'bg-green-100' : ''
              }`}
              onClick={() => day && setSelectedDate(dateKey)}
            >
              {day && (
                <>
                  <div className="font-semibold">{day}</div>
                  {events[dateKey]?.map((event) => (
                    <div
                      key={event.id}
                      className="text-xs bg-green-200 mt-1 p-1 rounded"
                    >
                      {event.title}
                    </div>
                  ))}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Selected Date Events */}
      {selectedDate && (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-4">
            Events on {selectedDate}
          </h3>

          {events[selectedDate]?.length ? (
            events[selectedDate].map((event) => (
              <div key={event.id} className="mb-4 border-b pb-3">
                <h4 className="font-semibold">{event.title}</h4>
                {event.time && <p>Time: {event.time}</p>}
                {event.location && <p>Location: {event.location}</p>}
                {event.details && <p>{event.details}</p>}
              </div>
            ))
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      )}
    </div>
  )
}
