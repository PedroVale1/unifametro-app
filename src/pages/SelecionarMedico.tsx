import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { medicos, especialidades, horariosDisponiveis, instituicao } from '../data/dados'
import { getSlotsOcupados } from '../services/api'

function getInitials(nome: string) {
  return nome
    .split(' ')
    .filter((n) => n.length > 2)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('')
}

export default function SelecionarMedico() {
  const navigate = useNavigate()
  const [especialidadeFiltro, setEspecialidadeFiltro] = useState('')
  const [slotsOcupados, setSlotsOcupados] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(true)

  useEffect(() => {
    const carregarSlots = async () => {
      try {
        const res = await getSlotsOcupados()
        const slots: string[] = Array.isArray(res.data)
          ? res.data.map((s: { slot_key: string } | string) =>
              typeof s === 'string' ? s : s.slot_key
            )
          : []
        setSlotsOcupados(slots)
      } catch {
        setSlotsOcupados([])
      } finally {
        setLoadingSlots(false)
      }
    }
    carregarSlots()
  }, [])

  const medicosFiltrados = especialidadeFiltro
    ? medicos.filter((m) => {
        const esp = especialidades.find((e) => e.nome === especialidadeFiltro)
        return esp ? m.especialidade_id === esp.id : true
      })
    : medicos

  const getHorariosDisponiveis = (medicoId: number) => {
    const hoje = new Date()
    const hojeStr = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`
    return horariosDisponiveis.filter(
      (h) => !slotsOcupados.includes(`${medicoId}_${hojeStr}_${h}`)
    ).length
  }

  const getProximaData = () => {
    const hoje = new Date()
    return `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar />

      {/* Header */}
      <div className="header-padded" style={{ backgroundColor: '#1a4731', padding: '48px 80px' }}>
        <h2 className="text-white fw-bold" style={{ fontSize: '2rem', marginBottom: '8px' }}>
          Selecionar Médico
        </h2>
        <p className="text-white" style={{ opacity: 0.8, fontSize: '15px', margin: 0 }}>
          Escolha o profissional ideal para seu atendimento em {instituicao.nome}
        </p>
      </div>

      <div className="container-fluid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>

        {/* Filtros */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold" style={{ color: '#374151', fontSize: '13px' }}>
              Instituição
            </label>
            <input
              type="text"
              className="form-control"
              value={instituicao.nome}
              readOnly
              style={{ backgroundColor: '#f3f4f6', borderRadius: '8px' }}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold" style={{ color: '#374151', fontSize: '13px' }}>
              Especialidade
            </label>
            <select
              className="form-select"
              value={especialidadeFiltro}
              onChange={(e) => setEspecialidadeFiltro(e.target.value)}
              style={{ borderRadius: '8px' }}
            >
              <option value="">Todas as especialidades</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.nome}>
                  {e.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de médicos */}
        {loadingSlots ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#1a4731' }} />
            <p className="mt-2" style={{ color: '#6b7280' }}>Carregando disponibilidade...</p>
          </div>
        ) : (
          <div className="row g-3">
            {medicosFiltrados.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p style={{ color: '#6b7280' }}>Nenhum médico encontrado para esta especialidade.</p>
              </div>
            ) : (
              medicosFiltrados.map((medico) => {
                const qtdHorarios = getHorariosDisponiveis(medico.id)
                const initials = getInitials(medico.nome)
                return (
                  <div className="col-md-6" key={medico.id}>
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #e5e7eb',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.12)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                      }}
                    >
                      <div className="d-flex gap-3 align-items-start">
                        {/* Avatar com inicial */}
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#1a4731',
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '18px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {initials}
                        </div>

                        <div className="flex-grow-1">
                          <div className="fw-bold" style={{ color: '#1f2937' }}>{medico.nome}</div>
                          <div style={{ fontSize: '13px', color: '#6b7280' }}>{medico.especialidade}</div>
                          <div style={{ fontSize: '12px', color: '#9ca3af' }}>{medico.crm}</div>
                          <div className="mt-2 d-flex gap-2 align-items-center flex-wrap">
                            <span
                              style={{
                                backgroundColor: '#d1fae5',
                                color: '#065f46',
                                padding: '3px 10px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              {getProximaData()}
                            </span>
                            <span
                              style={{
                                backgroundColor: qtdHorarios > 0 ? '#d1fae5' : '#fee2e2',
                                color: qtdHorarios > 0 ? '#065f46' : '#991b1b',
                                padding: '3px 10px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 600,
                              }}
                            >
                              {qtdHorarios} horários disponíveis
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-verde-escuro btn-sm flex-grow-1"
                          style={{ borderRadius: '8px' }}
                          onClick={() => navigate(`/agendamento/medico/${medico.id}`)}
                        >
                          Agendar
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm flex-grow-1"
                          style={{ borderRadius: '8px' }}
                          onClick={() => navigate(`/agendamento/medico/${medico.id}`)}
                        >
                          Escolher data
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}
