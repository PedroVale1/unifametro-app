import { useState } from 'react'

const MONTHS = [
  'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
]
const DAY_NAMES = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

// today = May 15, 2026 (system date)
const TODAY = new Date(2026, 4, 15)

function Calendar2026({ selectedDate, onSelectDate }) {
  const [viewMonth, setViewMonth] = useState(TODAY.getMonth()) // 0-indexed
  const [viewYear]                = useState(2026)

  const daysInMonth  = getDaysInMonth(viewYear, viewMonth)
  const firstWeekDay = getFirstDayOfWeek(viewYear, viewMonth)

  function prevMonth() {
    if (viewMonth > 0) setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth < 11) setViewMonth(m => m + 1)
  }

  function isWeekend(day) {
    const dow = new Date(viewYear, viewMonth, day).getDay()
    return dow === 0 || dow === 6
  }
  function isPast(day) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0,0,0,0)
    const t = new Date(TODAY); t.setHours(0,0,0,0)
    return d < t
  }
  function isSelected(day) {
    if (!selectedDate) return false
    const d = new Date(viewYear, viewMonth, day)
    return selectedDate.toDateString() === d.toDateString()
  }
  function isToday(day) {
    const d = new Date(viewYear, viewMonth, day)
    return TODAY.toDateString() === d.toDateString()
  }

  // Build calendar grid
  const cells = []
  for (let i = 0; i < firstWeekDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  function handleDayClick(day) {
    if (!day || isWeekend(day) || isPast(day)) return
    onSelectDate(new Date(viewYear, viewMonth, day))
  }

  return (
    <div style={{ userSelect: 'none' }}>
      {/* Cabeçalho do mês */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.8rem' }}>
        <button
          className="cal-arrow"
          onClick={prevMonth}
          disabled={viewMonth === 0}
          style={{ opacity: viewMonth === 0 ? .3 : 1 }}
        >◀</button>
        <span style={{ fontWeight: 700, color: '#1a3d2b', fontSize: '1rem' }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          className="cal-arrow"
          onClick={nextMonth}
          disabled={viewMonth === 11}
          style={{ opacity: viewMonth === 11 ? .3 : 1 }}
        >▶</button>
      </div>

      {/* Nomes dos dias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', marginBottom: '4px' }}>
        {DAY_NAMES.map(d => (
          <div key={d} style={{
            textAlign: 'center', fontSize: '.68rem', fontWeight: 700,
            color: d === 'Dom' || d === 'Sáb' ? '#ccc' : '#1a3d2b',
            padding: '4px 0', textTransform: 'uppercase',
          }}>{d}</div>
        ))}
      </div>

      {/* Grade de dias */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '3px' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e${idx}`} />

          const weekend  = isWeekend(day)
          const past     = isPast(day)
          const selected = isSelected(day)
          const today    = isToday(day)
          const disabled = weekend || past

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              style={{
                textAlign: 'center',
                padding: '7px 2px',
                borderRadius: 8,
                fontSize: '.82rem',
                fontWeight: selected ? 700 : today ? 600 : 400,
                cursor: disabled ? 'default' : 'pointer',
                background: selected
                  ? '#2d8a50'
                  : today
                  ? '#e8f5ec'
                  : 'transparent',
                color: selected
                  ? '#fff'
                  : disabled
                  ? '#ddd'
                  : today
                  ? '#1a3d2b'
                  : '#333',
                border: today && !selected ? '1.5px solid #2d8a50' : '1.5px solid transparent',
                transition: 'all .15s',
              }}
              onMouseEnter={e => {
                if (!disabled && !selected) e.currentTarget.style.background = '#f0f9f3'
              }}
              onMouseLeave={e => {
                if (!disabled && !selected) e.currentTarget.style.background = 'transparent'
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '.8rem', fontSize: '.72rem', color: '#888' }}>
        <span><span style={{ color: '#2d8a50', fontWeight: 700 }}>■</span> Selecionado</span>
        <span><span style={{ color: '#1a3d2b' }}>■</span> Hoje</span>
        <span><span style={{ color: '#ddd' }}>■</span> Indisponível</span>
      </div>
    </div>
  )
}

export default Calendar2026
