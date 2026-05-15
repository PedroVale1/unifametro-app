import { useState } from 'react'
import Calendar2026 from './Calendar2026.jsx'

const TIMES_EXAME = [
  '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
]

function formatDate(date) {
  if (!date) return ''
  return `${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}`
}
function formatDateLabel(date) {
  if (!date) return ''
  const days = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`
}

const LOCAIS = [
  'Laboratório — Bloco A, Sala 12',
  'Laboratório — Bloco B, Sala 03',
  'Radiologia — Bloco C, Sala 01',
]

function ExameBookingPage({ selectedExam, setPage, onAppointmentCreated, bookedSlots = {} }) {
  const exam = selectedExam || { id: 'ex1', nome: 'Exame', descricao: '', preparo: '', prazo: '' }

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedLocal, setLocal]       = useState(LOCAIS[0])
  const [obs, setObs]                   = useState('')
  const [showConfirm, setShowConfirm]   = useState(false)
  const [showSuccess, setShowSuccess]   = useState(false)

  function slotKey(time) {
    return `exam_${exam.id}_${formatDate(selectedDate)}_${time}`
  }
  function isSlotBooked(time) {
    if (!selectedDate) return false
    return !!bookedSlots[slotKey(time)]
  }

  function handleSelectDate(date) {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  function handleConfirm() {
    setShowConfirm(false)
    const key = slotKey(selectedTime)
    const newAppt = {
      id:        Date.now(),
      doctor:    exam.nome,
      specialty: 'Exame laboratorial',
      date:      formatDate(selectedDate),
      time:      selectedTime,
      status:    'Agendada',
      emoji:     '🩺',
      tipo:      'exame',
      local:     selectedLocal,
      slotKey:   key,
    }
    onAppointmentCreated(newAppt, key)
    setShowSuccess(true)
  }

  const canSchedule = selectedDate && selectedTime

  return (
    <div className="booking-page">

      {/* ── Painel do exame ── */}
      <div className="doctor-side">
        <div className="doctor-side-card">
          <div className="doc-big-avatar" style={{ fontSize: '2.2rem' }}>🩺</div>
          <div className="doc-name" style={{ fontSize: '.95rem' }}>{exam.nome}</div>
          <div className="doc-specialty">Exame de rotina</div>

          <div style={{ borderTop: '1px solid #e8e8e8', margin: '.8rem 0', paddingTop: '.8rem', textAlign: 'left' }}>
            {exam.preparo && (
              <div style={{ marginBottom: '.5rem' }}>
                <div style={{ fontSize: '.68rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>Preparo</div>
                <div style={{ fontSize: '.8rem', color: '#555', marginTop: '.15rem' }}>🕐 {exam.preparo}</div>
              </div>
            )}
            {exam.prazo && (
              <div>
                <div style={{ fontSize: '.68rem', color: '#aaa', fontWeight: 700, textTransform: 'uppercase' }}>Resultado</div>
                <div style={{ fontSize: '.8rem', color: '#555', marginTop: '.15rem' }}>📋 {exam.prazo}</div>
              </div>
            )}
          </div>

          {exam.descricao && (
            <div style={{ fontSize: '.78rem', color: '#888', textAlign: 'left', lineHeight: 1.4 }}>
              {exam.descricao}
            </div>
          )}

          <button
            className="doc-action-btn btn-cancel-doc"
            style={{ marginTop: '1rem' }}
            onClick={() => setPage('exames')}
          >
            ← Voltar aos exames
          </button>
        </div>
      </div>

      {/* ── Formulário ── */}
      <div className="booking-main">
        <div className="booking-card">
          <h3 className="booking-title">Agendar exame</h3>
          <p className="booking-sub">{exam.nome} — escolha data, horário e local</p>

          {/* Local */}
          <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.4rem' }}>
              Local de coleta
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {LOCAIS.map(loc => (
                <label key={loc} className="radio-label" style={{ fontSize: '.85rem' }}>
                  <input
                    type="radio"
                    checked={selectedLocal === loc}
                    onChange={() => setLocal(loc)}
                  />
                  {loc}
                </label>
              ))}
            </div>
          </div>

          {/* Calendário + Horários */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 260px', minWidth: 260 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.5rem' }}>
                Selecione a data
              </div>
              <Calendar2026 selectedDate={selectedDate} onSelectDate={handleSelectDate} />
            </div>

            <div style={{ flex: '1 1 200px', minWidth: 200 }}>
              <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '.5rem' }}>
                {selectedDate ? `Horários — ${formatDateLabel(selectedDate)}` : 'Selecione uma data'}
              </div>

              {!selectedDate ? (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#bbb', fontSize: '.85rem' }}>
                  👆 Clique em um dia no calendário
                </div>
              ) : (
                <div className="time-grid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
                  {TIMES_EXAME.map(t => {
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

          {/* Resumo */}
          {canSchedule && (
            <div style={{
              background: '#e8f5ec', borderRadius: 8, padding: '.7rem 1rem',
              marginTop: '1rem', fontSize: '.85rem', color: '#1a3d2b', fontWeight: 600
            }}>
              ✅ {formatDateLabel(selectedDate)} às {selectedTime} — {selectedLocal.split('—')[0].trim()}
            </div>
          )}

          {/* Observações */}
          <div className="obs-label">Observações</div>
          <textarea
            className="obs-input"
            placeholder="Informações adicionais ou dúvidas sobre o exame..."
            value={obs}
            onChange={e => setObs(e.target.value)}
          />

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '1.2rem', padding: '.75rem', fontSize: '.95rem' }}
            onClick={() => canSchedule && setShowConfirm(true)}
            disabled={!canSchedule}
          >
            Agendar Exame
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
              🩺 <strong>{exam.nome}</strong><br />
              📅 {formatDate(selectedDate)} às {selectedTime}<br />
              📍 {selectedLocal}
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
            <h3>Exame agendado!</h3>
            <p>
              <strong>{exam.nome}</strong><br />
              {formatDate(selectedDate)} às {selectedTime}<br />
              {selectedLocal}
            </p>
            <button className="btn-confirm" style={{ width: '100%' }} onClick={() => { setShowSuccess(false); setPage('myappointments') }}>
              Ver meus agendamentos
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExameBookingPage
