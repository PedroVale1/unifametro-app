import { useState } from 'react'
import { SPECIALTIES } from '../data.js'

function SpecialidadesPage({ setPage, setSelectedSpec }) {
  const [activeSpec, setActiveSpec] = useState(SPECIALTIES[0])

  function handleAgendar() {
    setSelectedSpec(activeSpec)
    setPage('schedule')
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1.5rem' }}>

      {/* Header */}
      <div style={{
        background: '#1a3d2b', borderRadius: 14, padding: '1.5rem 2rem',
        color: '#fff', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Especialidades disponíveis</h2>
          <p style={{ fontSize: '.83rem', color: '#a8d5b8', marginTop: '.25rem' }}>
            Selecione a especialidade desejada e veja as informações de atendimento
          </p>
        </div>
        <button className="btn-primary" onClick={handleAgendar}>
          Agendar atendimento
        </button>
      </div>

      <div className="spec-layout">
        {/* Lista de especialidades */}
        <div className="spec-list">
          {SPECIALTIES.map(spec => (
            <div
              key={spec.id}
              className={`spec-item${activeSpec.id === spec.id ? ' active' : ''}`}
              onClick={() => setActiveSpec(spec)}
            >
              {spec.label}
            </div>
          ))}
        </div>

        {/* Card de detalhes */}
        <div className="spec-card" style={{ borderRadius: 14 }}>
          <div>
            <div style={{ fontSize: '.72rem', color: '#7dbf96', marginBottom: '.4rem' }}>
              📍 Clínica Integrada de Saúde Unifametro
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{activeSpec.short}</h3>
            <p style={{ fontSize: '.85rem', color: '#a8d5b8', marginTop: '.4rem' }}>
              {activeSpec.label}
            </p>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1rem' }}>
            <div className="spec-card-info">📍 Rua Liberato Barroso, 1924 — Fortaleza, CE</div>
            <div className="spec-card-info">🕐 Segunda a sexta-feira, 07h às 20h</div>
            <div className="spec-card-info">📞 (85) 3206-0433</div>
          </div>

          <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={handleAgendar}>
              Agendar atendimento
            </button>
            <button
              className="btn-outline"
              style={{ border: '1px solid #a8d5b8', color: '#a8d5b8' }}
              onClick={() => setPage('doctors')}
            >
              Ver médicos disponíveis
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecialidadesPage
