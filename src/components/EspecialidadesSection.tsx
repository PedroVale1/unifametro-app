import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { especialidades, instituicao } from '../data/dados'
import clinicaImg from '../assets/images/especialidades/clinica.webp'

export default function EspecialidadesSection() {
  const [selecionada, setSelecionada] = useState(especialidades[0].id)
  const navigate = useNavigate()

  return (
    <section id="especialidades" style={{ padding: '64px 80px', backgroundColor: '#ffffff' }}>
      <div className="mb-2" style={{ color: '#f97316', fontWeight: 600, fontSize: '13px', letterSpacing: '1px' }}>
        AGENDAMENTOS
      </div>
      <h2 style={{ color: '#1a4731', fontWeight: 700, fontSize: '2rem', marginBottom: '8px' }}>
        Especialidades disponíveis
      </h2>
      <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '40px', maxWidth: '600px' }}>
        Selecione a especialidade desejada para ver a localização da clínica e informações de atendimento
      </p>

      <div className="row g-4">
        {/* Lista de especialidades */}
        <div className="col-md-4">
          <div className="d-flex flex-column gap-2">
            {especialidades.map((esp) => (
              <button
                key={esp.id}
                onClick={() => setSelecionada(esp.id)}
                style={{
                  padding: '16px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: selecionada === esp.id ? '#1a4731' : '#f3f4f6',
                  color: selecionada === esp.id ? '#ffffff' : '#374151',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontWeight: selecionada === esp.id ? 600 : 400,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '14px' }}>{esp.nome}</div>
                <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '2px' }}>{esp.descricao}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Imagem + card */}
        <div className="col-md-8" style={{ position: 'relative' }}>
          <div className="especialidades-img-inner" style={{ borderRadius: '16px', overflow: 'hidden', height: '360px', position: 'relative' }}>
            <img
              src={clinicaImg}
              alt="Clínica Unifametro"
              style={{ width: '100%', height: '100%', minHeight: '400px', objectFit: 'cover', objectPosition: 'center' }}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                if (target.parentElement) {
                  target.parentElement.style.backgroundColor = '#2d6a4f'
                }
              }}
            />

            {/* Card sobreposto */}
            <div
              className="especialidades-card-info"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#1a4731', fontSize: '15px' }}>{instituicao.nome}</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  📍 {instituicao.endereco}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  🕐 {instituicao.horario}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  📞 {instituicao.telefone}
                </div>
              </div>
              <button
                className="btn btn-laranja"
                style={{ whiteSpace: 'nowrap', borderRadius: '8px', fontSize: '14px' }}
                onClick={() => navigate('/agendamento')}
              >
                Agendar atendimento
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
