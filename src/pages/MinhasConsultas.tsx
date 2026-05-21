import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import Navbar from '../components/Navbar'
import { getAgendamentos, cancelarAgendamento } from '../services/api'
import { instituicao } from '../data/dados'
import type { Agendamento } from '../types'
import clinica2Img from '../assets/images/medicos/clinica2.webp'

type FiltroStatus = 'Próximas' | 'Finalizadas' | 'Canceladas'

export default function MinhasConsultas() {
  const navigate = useNavigate()
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<FiltroStatus>('Próximas')
  const [selecionado, setSelecionado] = useState<Agendamento | null>(null)
  const [cancelando, setCancelando] = useState<number | null>(null)
  const [cancelErro, setCancelErro] = useState('')
  const [modalCancelar, setModalCancelar] = useState<{ show: boolean; id: number | null }>({ show: false, id: null })

  useEffect(() => {
    carregarAgendamentos()
  }, [])

  const lerDoLocalStorage = (): Agendamento[] => {
    const usuarioSalvo = localStorage.getItem('unifametro_usuario')
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null
    const salvo = localStorage.getItem('unifametro_agendamentos')
    const todos: Agendamento[] = salvo ? JSON.parse(salvo) : []
    return usuario ? todos.filter((a) => a.usuario_id === usuario.id) : todos
  }

  const carregarAgendamentos = async () => {
    setLoading(true)
    try {
      const res = await getAgendamentos()
      const lista: Agendamento[] = Array.isArray(res.data) ? res.data : []
      if (lista.length > 0) {
        setAgendamentos(lista)
        setSelecionado(lista[0])
        localStorage.setItem('unifametro_agendamentos', JSON.stringify(lista))
      } else {
        const meus = lerDoLocalStorage()
        setAgendamentos(meus)
        if (meus.length > 0) setSelecionado(meus[0])
      }
    } catch {
      const meus = lerDoLocalStorage()
      setAgendamentos(meus)
      if (meus.length > 0) setSelecionado(meus[0])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setModalCancelar({ show: true, id })
  }

  const confirmarCancelamento = async () => {
    const id = modalCancelar.id
    if (!id) return
    setCancelando(id)
    setCancelErro('')
    try {
      await cancelarAgendamento(id)
      setAgendamentos((prev) => {
        const atualizados = prev.map((a) => a.id === id ? { ...a, status: 'Cancelada' } : a)
        localStorage.setItem('unifametro_agendamentos', JSON.stringify(atualizados))
        return atualizados
      })
      setSelecionado((prev) => prev?.id === id ? { ...prev, status: 'Cancelada' } : prev)
      setModalCancelar({ show: false, id: null })
    } catch {
      setCancelErro('Erro ao cancelar o agendamento. Tente novamente.')
    } finally {
      setCancelando(null)
    }
  }

  const filtrados = agendamentos.filter((a) => {
    if (filtro === 'Próximas') return a.status === 'Agendada'
    if (filtro === 'Canceladas') return a.status === 'Cancelada'
    if (filtro === 'Finalizadas') return a.status === 'Finalizada'
    return true
  })

  const getBadgeColor = (status: string) => {
    if (status === 'Agendada') return { bg: '#d1fae5', color: '#065f46' }
    if (status === 'Cancelada') return { bg: '#fee2e2', color: '#991b1b' }
    return { bg: '#e5e7eb', color: '#374151' }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar />

      {/* Header com imagem de fundo */}
      <div
        className="header-padded"
        style={{
          position: 'relative',
          padding: '56px 80px',
          overflow: 'hidden',
          minHeight: '180px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <img
          src={clinica2Img}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            backgroundSize: 'cover',
          }}
          onError={(e) => {
            const t = e.target as HTMLImageElement
            t.style.display = 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(26,71,49,0.82)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 className="text-white fw-bold" style={{ fontSize: '2rem', marginBottom: '8px' }}>
            Minhas consultas
          </h2>
          <p className="text-white" style={{ opacity: 0.85, fontSize: '15px', marginBottom: '20px' }}>
            Acompanhe e gerencie todas as suas consultas em um só lugar.
          </p>
          <button
            className="btn btn-laranja"
            style={{ borderRadius: '8px' }}
            onClick={() => navigate('/agendamento/medicos')}
          >
            + Nova consulta
          </button>
        </div>
      </div>

      <div className="container-fluid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Filtros */}
        <div className="d-flex gap-2 mb-4 flex-wrap align-items-center">
          {(['Próximas', 'Finalizadas', 'Canceladas'] as FiltroStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: filtro === f ? 'none' : '1px solid #d1d5db',
                backgroundColor: filtro === f ? '#1a4731' : '#ffffff',
                color: filtro === f ? '#ffffff' : '#374151',
                fontWeight: filtro === f ? 600 : 400,
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          ))}
          <button
            className="btn btn-laranja btn-sm"
            style={{ borderRadius: '8px' }}
            onClick={carregarAgendamentos}
          >
            Atualizar
          </button>
        </div>

        {cancelErro && (
          <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '14px' }}>
            {cancelErro}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: '#1a4731' }} />
            <p className="mt-2" style={{ color: '#6b7280' }}>Carregando consultas...</p>
          </div>
        ) : (
          <div className="row g-4">
            {/* Lista */}
            <div className="col-md-5 col-no-border-mobile" style={{ borderRight: '1px solid #e5e7eb' }}>
              <div className="scroll-lista d-flex flex-column gap-2 pe-2">
                {agendamentos.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '60px 20px',
                      color: '#6b7280',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div style={{ fontSize: '3.5rem', marginBottom: '16px', opacity: 0.4 }}>📅</div>
                    <p className="fw-semibold" style={{ color: '#374151', marginBottom: '8px' }}>
                      Você ainda não possui consultas agendadas.
                    </p>
                    <p style={{ fontSize: '13px', marginBottom: '20px' }}>
                      Agende sua primeira consulta com um de nossos profissionais.
                    </p>
                    <button
                      className="btn btn-laranja"
                      style={{ borderRadius: '8px' }}
                      onClick={() => navigate('/agendamento/medicos')}
                    >
                      + Nova consulta
                    </button>
                  </div>
                ) : filtrados.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 20px',
                      color: '#6b7280',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    }}
                  >
                    Nenhuma consulta encontrada.
                  </div>
                ) : (
                  filtrados.map((ag) => {
                    const badge = getBadgeColor(ag.status)
                    return (
                      <div
                        key={ag.id}
                        className={`consulta-item${selecionado?.id === ag.id ? ' ativo' : ''}`}
                        onClick={() => setSelecionado(ag)}
                        style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                      >
                        <div className="d-flex gap-3 align-items-start">
                          <div
                            style={{
                              width: '44px',
                              height: '44px',
                              borderRadius: '50%',
                              backgroundColor: '#1a4731',
                              flexShrink: 0,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                            }}
                          >
                            {ag.emoji || '🩺'}
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-semibold" style={{ fontSize: '14px', color: '#1f2937' }}>
                              {ag.titulo}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{ag.especialidade}</div>
                            <div className="mt-1 d-flex gap-2 align-items-center flex-wrap">
                              <span
                                style={{
                                  backgroundColor: badge.bg,
                                  color: badge.color,
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  padding: '3px 10px',
                                  borderRadius: '12px',
                                }}
                              >
                                {ag.status}
                              </span>
                              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                {ag.data} às {ag.hora}
                              </span>
                            </div>
                          </div>
                          {ag.status === 'Agendada' && (
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: '#fee2e2',
                                color: '#dc2626',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '11px',
                                padding: '4px 10px',
                                flexShrink: 0,
                              }}
                              onClick={(e) => handleCancelar(ag.id, e)}
                              disabled={cancelando === ag.id}
                            >
                              {cancelando === ag.id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                'cancelar'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Detalhe */}
            <div className="col-md-7">
              {selecionado ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '28px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <div className="d-flex gap-3 align-items-start mb-4">
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        backgroundColor: '#1a4731',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                      }}
                    >
                      {selecionado.emoji || '🩺'}
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize: '18px', color: '#1f2937' }}>
                        {selecionado.titulo}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>{selecionado.especialidade}</div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Data</div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{selecionado.data}</div>
                    </div>
                    <div className="col-6">
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Horário</div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>{selecionado.hora}</div>
                    </div>
                    <div className="col-12">
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Local</div>
                      <div style={{ fontWeight: 600, color: '#1f2937' }}>
                        {selecionado.local ?? instituicao.endereco}
                      </div>
                    </div>
                    <div className="col-12">
                      <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>Status</div>
                      <span
                        style={{
                          backgroundColor: getBadgeColor(selecionado.status).bg,
                          color: getBadgeColor(selecionado.status).color,
                          padding: '5px 16px',
                          borderRadius: '12px',
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        {selecionado.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  Selecione uma consulta para ver os detalhes.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal de cancelamento */}
      <Modal show={modalCancelar.show} onHide={() => setModalCancelar({ show: false, id: null })} centered>
        <Modal.Header style={{ backgroundColor: '#dc2626', padding: '16px 24px' }}>
          <Modal.Title className="text-white fw-bold" style={{ fontSize: '16px' }}>
            ⚠️ Cancelar Agendamento
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="fw-semibold mb-1" style={{ color: '#1f2937' }}>
            Tem certeza que deseja cancelar este agendamento?
          </p>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
            Esta ação não pode ser desfeita.
          </p>
          {cancelErro && (
            <div className="alert alert-danger py-2 mt-3 mb-0" style={{ fontSize: '13px' }}>
              {cancelErro}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => { setModalCancelar({ show: false, id: null }); setCancelErro('') }}
            disabled={!!cancelando}
          >
            Voltar
          </Button>
          <Button
            style={{ backgroundColor: '#dc2626', borderColor: '#dc2626' }}
            onClick={confirmarCancelamento}
            disabled={!!cancelando}
          >
            {cancelando ? (
              <><span className="spinner-border spinner-border-sm me-2" />Cancelando...</>
            ) : 'Confirmar Cancelamento'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
