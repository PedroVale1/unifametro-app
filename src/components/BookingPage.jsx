import { useState } from 'react'
import { TIMES, DOCTORS } from '../data.js'
import Calendar2026 from './Calendar2026.jsx'

const MONTHS_PT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']

function formatDate(date) {
  if (!date) return ''
  return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`
}
function formatDateLabel(date) {
  if (!date) return ''
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  return `${days[date.getDay()]}, ${date.getDate()} de ${MONTHS_PT[date.getMonth()].charAt(0).toUpperCase()+MONTHS_PT[date.getMonth()].slice(1)}`
}

function BookingPage({ selectedDoctor, setPage, onAppointmentCreated, bookedSlots = {} }) {
  const doc = selectedDoctor || DOCTORS[0]

  const [selectedDate, setSelectedDate]   = useState(null)
  const [selectedTime, setSelectedTime]   = useState(null)
  const [consultType, setConsultType]     = useState('tele')
  const [obs, setObs]                     = useState('')
  const [showConfirm, setShowConfirm]     = useState(false)
  const [showSuccess, setShowSuccess]     = useState(false)

  function slotKey(time) {
    return `${doc.id}_${formatDate(selectedDate)}_${time}`
  }

  function isSlotBooked(time) {
    if (!selectedDate) return false
    return !!bookedSlots[slotKey(time)]
  }

  function handleSelectDate(date) {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  function handleAgendar() {
    if (!selectedDate || !selectedTime) return
    setShowConfirm(true)
  }

  function handleConfirm() {
    setShowConfirm(false)
    const key = slotKey(selectedTime)
    const newAppt = {
      id:        Date.now(),
      doctor:    doc.name,
      specialty: doc.specialty,
      date:      formatDate(selectedDate),
      time:      selectedTime,
      status:    'Agendada',
      emoji:     doc.emoji,
      slotKey:   key,
    }
    onAppointmentCreated(newAppt, key)
    setShowSuccess(true)
  }

  function handleClose() {
    setShowSuccess(false)
    setPage('myappointments')
  }

  const canSchedule = selectedDate && selectedTime

  return (
    <div className="booking-page">
      {/* ── Painel do médico ── */}
      <div className="doctor-side">
        <div className="doctor-side-card">
          <div className="doc-big-avatar">{doc.emoji}</div>
          <div className="doc-name">{doc.name}</div>
          <div className="doc-specialty">{doc.specialty}</div>
          <div className="doc-crm">{doc.crm}</div>
          <button className="doc-action-btn btn-phone">📞 Ver telefone</button>
          <button className="doc-action-btn btn-cancel-doc" onClick={() => setPage('myappointments')}>
            ❌ Cancelar Agendamento
          </button>
        </div>
      </div>

      {/* ── Formulário ── */}
      <div className="booking-main">
        <div className="booking-card">
          <h3 className="booking-title">Agendar consulta</h3>
          <p className="booking-sub">Escolha o tipo de consulta que deseja agendar</p>

          {/* Tipo */}
          <div className="type-toggle" style={{ marginBottom: '1.2rem' }}>
            <label className="radio-label">
              <input type="radio" checked={consultType === 'tele'} onChange={() => setConsultType('tele')} />
              Teleconsulta
            </label>
            <label className="radio-label">
              <input type="radio" checked={consultType === 'pres'} onChange={() => setConsultType('pres')} />
              Presencial
            </label>
          </div>

          {/* Layout: calendário à esquerda, horários à direita */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

            {/* Calendário */}
            <div style={{ flex: '1 1 260px', minWidth: 260 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.5rem' }}>
                Selecione a data
              </div>
              <Calendar2026 selectedDate={selectedDate} onSelectDate={handleSelectDate} />
            </div>

            {/* Horários */}
            <div style={{ flex: '1 1 220px', minWidth: 220 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.5rem' }}>
                {selectedDate ? `Horários — ${formatDateLabel(selectedDate)}` : 'Selecione uma data primeiro'}
              </div>

              {!selectedDate ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#bbb', fontSize: '.85rem' }}>
                  👆 Clique em um dia no calendário
                </div>
              ) : (
                <div className="time-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
                  {TIMES.map(t => {
                    const booked   = isSlotBooked(t)
                    const selected = selectedTime === t
                    return (
                      <div
                        key={t}
                        className={`time-slot${booked ? ' disabled' : selected ? ' selected' : ''}`}
                        onClick={() => !booked && setSelectedTime(t)}
                        title={booked ? 'Horário já agendado' : ''}
                      >
                        {t}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Resumo da seleção */}
          {selectedDate && selectedTime && (
            <div style={{
              background: '#e8f5ec', borderRadius: 8, padding: '.7rem 1rem',
              marginTop: '1rem', fontSize: '.85rem', color: '#1a3d2b', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '.5rem'
            }}>
              ✅ {formatDateLabel(selectedDate)} às {selectedTime} — {consultType === 'tele' ? 'Teleconsulta' : 'Presencial'}
            </div>
          )}

          {/* Observações */}
          <div className="obs-label">Observações</div>
          <textarea
            className="obs-input"
            placeholder="Descreva o motivo da consulta..."
            value={obs}
            onChange={e => setObs(e.target.value)}
          />

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '1.2rem', padding: '.75rem', fontSize: '.95rem' }}
            onClick={handleAgendar}
            disabled={!canSchedule}
          >
            Agendar Consulta
          </button>

          {!canSchedule && (
            <p className="hint">
              {!selectedDate ? 'Selecione uma data no calendário' : 'Selecione um horário para continuar'}
            </p>
          )}
        </div>
      </div>

      {/* Modal: Confirmar */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmar agendamento?</h3>
            <p>
              {doc.emoji} <strong>{doc.name}</strong><br />
              📅 {formatDate(selectedDate)} às {selectedTime}<br />
              {consultType === 'tele' ? '💻 Teleconsulta' : '🏥 Presencial'}
            </p>
            <div className="modal-btns">
              <button className="btn-cancel-modal" onClick={() => setShowConfirm(false)}>Cancelar</button>
              <button className="btn-confirm" onClick={handleConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Sucesso */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="success-icon">✅</div>
            <h3>Agendamento confirmado!</h3>
            <p>
              <strong>{doc.name}</strong><br />
              {formatDate(selectedDate)} às {selectedTime}
            </p>
            <button className="btn-confirm" style={{ width: '100%' }} onClick={handleClose}>
              Ver minhas consultas
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingPage
