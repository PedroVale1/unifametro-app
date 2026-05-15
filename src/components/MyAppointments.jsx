import { useState } from 'react'

function MyAppointments({ appointments, setPage, setSelectedDoctor, doctors, onCancel }) {
  const [tab, setTab]             = useState('Consultas')
  const [confirmCancel, setConf]  = useState(null)
  const tabs = ['Consultas', 'Exames', 'Cancelados']

  const filtered = appointments.filter(a => {
    const isExam = a.tipo === 'exame'
    if (tab === 'Consultas')  return !isExam && a.status !== 'Cancelada'
    if (tab === 'Exames')     return isExam  && a.status !== 'Cancelada'
    return a.status === 'Cancelada'
  })

  function handleClickAppt(appt) {
    if (appt.tipo === 'exame') return // exames não têm página de booking reutilizável
    const doc = doctors.find(d => d.name === appt.doctor) || doctors[0]
    setSelectedDoctor(doc)
    setPage('booking')
  }

  function handleConfirmCancel() {
    onCancel(confirmCancel)
    setConf(null)
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="consult-header">
        <div>
          <h2>Meus agendamentos</h2>
          <p>Acompanhe e gerencie suas consultas e exames.</p>
        </div>
        <div style={{ display: 'flex', gap: '.6rem' }}>
          <button className="btn-primary" onClick={() => setPage('doctors')}>
            + Nova consulta
          </button>
          <button
            style={{ background: '#fff', color: '#1a3d2b', border: '1px solid #a8d5b8', borderRadius: 8, padding: '.5rem 1rem', fontSize: '.85rem', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setPage('exames')}
          >
            🩺 Novo exame
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      {/* Lista */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span>{tab === 'Cancelados' ? '🚫' : tab === 'Exames' ? '🩺' : '📭'}</span>
          {tab === 'Consultas' && 'Nenhuma consulta agendada. Clique em "+ Nova consulta" para começar!'}
          {tab === 'Exames'    && 'Nenhum exame agendado. Clique em "🩺 Novo exame" para agendar!'}
          {tab === 'Cancelados'&& 'Nenhum agendamento cancelado.'}
        </div>
      ) : (
        filtered.map(a => (
          <div key={a.id} className="appt-card">
            <div className="appt-avatar"
              style={{ cursor: a.tipo !== 'exame' ? 'pointer' : 'default' }}
              onClick={() => handleClickAppt(a)}
            >
              {a.emoji}
            </div>

            <div className="appt-info" style={{ cursor: a.tipo !== 'exame' ? 'pointer' : 'default', flex: 1 }}
              onClick={() => handleClickAppt(a)}
            >
              <h4>{a.doctor}</h4>
              <p>{a.specialty}</p>
              {a.local && <p style={{ fontSize: '.75rem', color: '#aaa', marginTop: '.1rem' }}>📍 {a.local}</p>}
              <div style={{ display: 'flex', gap: '.4rem', marginTop: '.3rem', alignItems: 'center' }}>
                <span className={`badge ${
                  a.status === 'Agendada'  ? 'badge-green'  :
                  a.status === 'Cancelada' ? 'badge-gray'   : 'badge-orange'
                }`}>{a.status}</span>
                {a.tipo === 'exame' && (
                  <span style={{ background: '#e8f0fe', color: '#3b5bdb', fontSize: '.7rem', fontWeight: 700, padding: '.15rem .5rem', borderRadius: 8 }}>
                    EXAME
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '.5rem' }}>
              <div className="appt-meta">
                <div className="date">{a.date}</div>
                <div className="time">{a.time}</div>
              </div>
              {a.status === 'Agendada' && (
                <button onClick={() => setConf(a.id)} style={{
                  background: '#fff0e8', color: '#e8612a',
                  border: '1px solid #f5c9b3', borderRadius: 6,
                  padding: '.25rem .7rem', fontSize: '.75rem',
                  cursor: 'pointer', fontWeight: 600,
                }}>✕ Cancelar</button>
              )}
            </div>
          </div>
        ))
      )}

      {/* Modal cancelar */}
      {confirmCancel && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cancelar agendamento?</h3>
            <p>Tem certeza que deseja cancelar? Esta ação não pode ser desfeita.</p>
            <div className="modal-btns">
              <button className="btn-cancel-modal" onClick={() => setConf(null)}>Voltar</button>
              <button
                style={{ background: '#e8612a', color: '#fff', border: 'none', padding: '.55rem 1.4rem', borderRadius: 8, cursor: 'pointer', fontSize: '.88rem', fontWeight: 600 }}
                onClick={handleConfirmCancel}
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyAppointments
