import React, { useState, useEffect } from 'react'
import { providerService } from '../../services/providerService'
import { useToast } from '../../context/ToastContext'
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const AvailabilityPage = () => {
  const { showToast } = useToast()

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [availabilityMap, setAvailabilityMap] = useState({})
  const [loading, setLoading] = useState(true)

  const month = currentDate.getMonth() + 1
  const year = currentDate.getFullYear()

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const res = await providerService.getAvailability(month, year)
      const map = {}
      if (res.data) {
        res.data.forEach((item) => {
          map[item.date] = item
        })
      }
      setAvailabilityMap(map)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAvailability()
  }, [month, year])

  const changeMonth = (delta) => {
    setCurrentDate(new Date(year, month - 1 + delta, 1))
    setSelectedDay(null)
  }

  const goToday = () => {
    setCurrentDate(new Date())
    setSelectedDay(new Date().toISOString().split('T')[0])
  }

  const handleMark = async (status) => {
    if (!selectedDay) {
      showToast('Please select a date on the calendar first.')
      return
    }

    try {
      await providerService.setAvailability({
        date: selectedDay,
        status: status, // 'AVAILABLE' or 'BUSY'
      })
      showToast(`Date ${selectedDay} marked as ${status.toLowerCase()}.`)
      fetchAvailability()
    } catch (err) {
      showToast('Failed to update date availability.')
    }
  }

  // Calendar calculations
  const firstDayIndex = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const todayStr = new Date().toISOString().split('T')[0]

  const calendarDays = []
  // Padding for previous month days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push({ dayNumber: null, dateStr: null })
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const padD = String(d).padStart(2, '0')
    const padM = String(month).padStart(2, '0')
    const dateStr = `${year}-${padM}-${padD}`
    calendarDays.push({
      dayNumber: d,
      dateStr,
    })
  }

  // Summary counts
  let eventCount = 0
  let busyCount = 0
  let availableCount = 0

  Object.values(availabilityMap).forEach((item) => {
    if (item.status === 'BOOKED' || item.isBooked) eventCount++
    else if (item.status === 'BUSY') busyCount++
    else if (item.status === 'AVAILABLE') availableCount++
  })

  const selectedItem = selectedDay ? availabilityMap[selectedDay] : null

  return (
    <section id="calendar" className="screen active" style={{ display: 'block' }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Availability Calendar</h1>
          <p className="page-subtitle">Quickly view celebration bookings, blocked dates, and available slots.</p>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <button className="btn btn-secondary" onClick={goToday}>
            Today
          </button>
          <button className="btn btn-primary" onClick={() => showToast('Calendar synced with live bookings!')}>
            Save Availability
          </button>
        </div>
      </div>

      <div className="calendar-layout">
        {/* Main Calendar View */}
        <div className="card calendar-main">
          {/* Calendar Toolbar */}
          <div className="calendar-toolbar">
            <button className="btn btn-secondary calendar-nav" onClick={() => changeMonth(-1)}>
              <ChevronLeft size={18} />
            </button>
            <div className="calendar-month">
              {MONTHS[month - 1]} {year}
            </div>
            <button className="btn btn-secondary calendar-nav" onClick={() => changeMonth(1)}>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Calendar Summary */}
          <div className="calendar-summary">
            <div className="cal-summary-item">
              <span className="cal-dot event-dot"></span>
              <div>
                <b>{eventCount}</b>
                <small>Booked Events</small>
              </div>
            </div>
            <div className="cal-summary-item">
              <span className="cal-dot busy-dot"></span>
              <div>
                <b>{busyCount}</b>
                <small>Busy Days</small>
              </div>
            </div>
            <div className="cal-summary-item">
              <span className="cal-dot available-dot"></span>
              <div>
                <b>{availableCount || daysInMonth - eventCount - busyCount}</b>
                <small>Available</small>
              </div>
            </div>
          </div>

          {/* Calendar Day Header */}
          <div className="calendar-grid" style={{ marginBottom: 4 }}>
            {DAYS.map((day) => (
              <div key={day} className="calendar-day-head">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid */}
          <div className="calendar-grid">
            {calendarDays.map((cell, idx) => {
              if (!cell.dayNumber) {
                return <div key={`pad-${idx}`} className="calendar-day muted-day" />
              }

              const info = availabilityMap[cell.dateStr]
              const isToday = cell.dateStr === todayStr
              const isSelected = cell.dateStr === selectedDay
              const isBusy = info?.status === 'BUSY'
              const isBooked = info?.status === 'BOOKED' || info?.isBooked

              let classNames = 'calendar-day'
              if (isToday) classNames += ' today'
              if (isSelected) classNames += ' selected'
              if (isBusy) classNames += ' busy'
              if (isBooked) classNames += ' has-event'

              return (
                <div
                  key={cell.dateStr}
                  className={classNames}
                  onClick={() => setSelectedDay(cell.dateStr)}
                >
                  <div className="day-top">
                    <span className="day-number">{cell.dayNumber}</span>
                    {isToday && <span className="today-label">TODAY</span>}
                  </div>

                  {isBooked ? (
                    <div className="day-event">
                      {info.eventTitle || 'Confirmed Event'}
                      <small>{info.customerName || 'Booking'}</small>
                    </div>
                  ) : isBusy ? (
                    <div className="day-busy">Busy</div>
                  ) : (
                    <div className="day-free">Open</div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="calendar-legend">
            <span>
              <i className="legend-dot event-dot"></i> Confirmed Booking
            </span>
            <span>
              <i className="legend-dot busy-dot"></i> Marked Busy
            </span>
            <span>
              <i className="legend-dot available-dot"></i> Open / Available
            </span>
            <span>
              <i className="legend-dot today-dot"></i> Current Date
            </span>
          </div>
        </div>

        {/* Side Panel: Selected Date Details & Actions */}
        <div className="calendar-side">
          <div className="card selected-date-card">
            <div className="card-head">
              <h3 id="selectedDateTitle">
                {selectedDay ? `Date: ${selectedDay}` : 'Select a date'}
              </h3>
            </div>
            <div className="card-body">
              {!selectedDay ? (
                <div className="calendar-empty">
                  <div className="empty-calendar-icon">📅</div>
                  <b>Select a date</b>
                  <span>Click on any day on the calendar to manage its availability.</span>
                </div>
              ) : selectedItem ? (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
                    Status: <span style={{ color: selectedItem.status === 'BUSY' ? 'var(--danger)' : 'var(--primary)' }}>{selectedItem.status}</span>
                  </div>
                  {selectedItem.eventTitle && (
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                      Booking: <strong>{selectedItem.eventTitle}</strong>
                    </div>
                  )}
                  {selectedItem.customerName && (
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                      Host: <strong>{selectedItem.customerName}</strong>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                  This date currently has no confirmed bookings and is open for enquiries.
                </div>
              )}
            </div>
          </div>

          <div className="card quick-availability">
            <div className="card-head">
              <h3>Quick availability</h3>
            </div>
            <div className="card-body">
              <button
                className="availability-action available-action"
                onClick={() => handleMark('AVAILABLE')}
              >
                <span>🟢</span>
                <div>
                  <b>Mark Available</b>
                  <small>Accept new customer enquiries</small>
                </div>
              </button>

              <button
                className="availability-action busy-action"
                onClick={() => handleMark('BUSY')}
              >
                <span>🔴</span>
                <div>
                  <b>Mark Busy</b>
                  <small>Hide this date from new booking proposals</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
