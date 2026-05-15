import { useState } from 'react'
import { SPECIALTIES, DOCTORS } from '../data.js'

function DoctorsList({ setPage, setSelectedDoctor, selectedSpec }) {
  const [selectedSpecId, setSelectedSpecId] = useState(
    selectedSpec?.id || null
  )

  const filtered = selectedSpecId
    ? DOCTORS.filter(d => d.specialtyId === selectedSpecId)
    : DOCTORS

  return (
    <div className="container">
      {/* Filtros */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Instituição</label>
          <select className="filter-select">
            <option>📍 Clínica Integrada de Saúde Unifametro</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Especialidade</label>
          <select
            className="filter-select"
            value={selectedSpecId || ''}
            onChange={e => setSelectedSpecId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todas as especialidades</option>
            {SPECIALTIES.map(s => (
              <option key={s.id} value={s.id}>{s.short}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Contagem */}
      <p style={{ fontSize: '.82rem', color: '#888', marginBottom: '.8rem' }}>
        {filtered.length} médico{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Lista de médicos */}
      {filtered.map(doc => (
        <div key={doc.id} className="doctor-card">
          <div className="doctor-avatar">{doc.emoji}</div>

          <div className="doctor-info">
            <h4>{doc.name}</h4>
            <p>{doc.specialty}</p>
            <p style={{ fontSize: '.75rem', color: '#aaa' }}>{doc.crm}</p>
          </div>

          <div className="doctor-actions">
            <div className="slots-date">
              {new Date().toLocaleDateString('pt-BR')}
            </div>
            <div className="slots-count">
              {doc.slots} horários<br />disponíveis
            </div>
            <button
              className="btn-primary"
              style={{ padding: '.35rem .9rem', fontSize: '.8rem', marginTop: '.4rem' }}
              onClick={() => { setSelectedDoctor(doc); setPage('booking') }}
            >
              Agendar
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DoctorsList
