import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ModalConfirmacao from '../components/ModalConfirmacao'
import ModalSucesso from '../components/ModalSucesso'
import { medicos, horariosDisponiveis } from '../data/dados'
import { getSlotsOcupados, criarAgendamento, cancelarAgendamento, getAgendamentos } from '../services/api'
import type { Agendamento } from '../types'

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function getDiasSemana(offsetSemanas: number) {
  const hoje = new Date()
  const diasSemana: Date[] = []
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() + offsetSemanas * 7 - hoje.getDay() + 1)
  for (let i = 0; i < 4; i++) {
    const d = new Date(inicioSemana)
    d.setDate(inicioSemana.getDate() + i)
    diasSemana.push(d)
  }
  return diasSemana
}

function formatData(d: Date) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

export default function AgendamentoMedico() {
  const { id } = useParams<{ id: string }>()
  const medico = medicos.find((m) => m.id === Number(id))

  const [tipoConsulta, setTipoConsulta] = useState<'presencial' | 'tele'>('presencial')
  const [offsetSemanas, setOffsetSemanas] = useState(0)
  const [dataSelecionada, setDataSelecionada] = useState('')
  const [horaSelecionada, setHoraSelecionada] = useState('')
  const [slotsOcupados, setSlotsOcupados] = useState<string[]>([])
  const [agendamentoAtivo, setAgendamentoAtivo] = useState<Agendamento | null>(null)
  const [observacoes, setObservacoes] = useState('')
  const [mostrarTelefone, setMostrarTelefone] = useState(false)
  const [horariosMostrados, setHorariosMostrados] = useState<Record<string, number>>({})
  const [showModalConfirm, setShowModalConfirm] = useState(false)
  const [showModalSucesso, setShowModalSucesso] = useState(false)
  const [loadingAgendar, setLoadingAgendar] = useState(false)
  const [erroCriar, setErroCriar] = useState('')
  const [erroConsultaDia, setErroConsultaDia] = useState('')
  const [loadingCancelar, setLoadingCancelar] = useState(false)

  const verificarConsultaNoDia = (data: string): boolean => {
    const usuarioSalvo = localStorage.getItem('unifametro_usuario')
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null
    const salvo = localStorage.getItem('unifametro_agendamentos')
    const todos: Agendamento[] = salvo ? JSON.parse(salvo) : []
    return todos.some((a) => a.usuario_id === usuario?.id && a.data === data && a.status === 'Agendada')
  }

  const dias = getDiasSemana(offsetSemanas)

  useEffect(() => {
    const carregar = async () => {
      try {
        const [slotsRes, agRes] = await Promise.all([getSlotsOcupados(), getAgendamentos()])
        const slots: string[] = Array.isArray(slotsRes.data)
          ? slotsRes.data.map((s: { slot_key: string } | string) =>
              typeof s === 'string' ? s : s.slot_key
            )
          : []
        setSlotsOcupados(slots)

        const agendamentos: Agendamento[] = Array.isArray(agRes.data) ? agRes.data : []
        const ativo = agendamentos.find(
          (a) => a.titulo === medico?.nome && a.status === 'Agendada'
        )
        setAgendamentoAtivo(ativo ?? null)
      } catch {
        // silencioso
      }
    }
    carregar()
  }, [medico?.nome])

  if (!medico) {
    return (
      <div>
        <Navbar />
        <div className="container py-5 text-center">
          <p style={{ color: '#6b7280' }}>Médico não encontrado.</p>
        </div>
      </div>
    )
  }

  const isSlotOcupado = (data: string, hora: string) =>
    slotsOcupados.includes(`${medico.id}_${data}_${hora}`)

  const getLimiteMostrado = (dataStr: string) => horariosMostrados[dataStr] ?? 6

  const handleAgendar = async () => {
    if (!dataSelecionada || !horaSelecionada) return
    setErroCriar('')
    setLoadingAgendar(true)
    try {
      const res = await criarAgendamento({
        tipo: 'consulta',
        titulo: medico.nome,
        especialidade: medico.especialidade,
        data: dataSelecionada,
        hora: horaSelecionada,
        emoji: '🩺',
        local: tipoConsulta === 'presencial' ? 'Rua Liberato Barroso, 1503' : null,
        slot_key: `${medico.id}_${dataSelecionada}_${horaSelecionada}`,
      })
      const novoAg: Agendamento = res.data?.agendamento ?? res.data ?? {
        id: Date.now(),
        usuario_id: 0,
        tipo: 'consulta',
        titulo: medico.nome,
        especialidade: medico.especialidade,
        data: dataSelecionada,
        hora: horaSelecionada,
        status: 'Agendada',
        emoji: '🩺',
        local: tipoConsulta === 'presencial' ? 'Rua Liberato Barroso, 1503' : null,
        slot_key: `${medico.id}_${dataSelecionada}_${horaSelecionada}`,
        created_at: new Date().toISOString(),
      }
      const stored = localStorage.getItem('unifametro_agendamentos')
      const lista: Agendamento[] = stored ? JSON.parse(stored) : []
      lista.unshift(novoAg)
      localStorage.setItem('unifametro_agendamentos', JSON.stringify(lista))
      setShowModalConfirm(false)
      setShowModalSucesso(true)
    } catch {
      setErroCriar('Erro ao criar agendamento. Tente novamente.')
    } finally {
      setLoadingAgendar(false)
    }
  }

  const handleCancelar = async () => {
    if (!agendamentoAtivo) return
    if (!confirm('Deseja realmente cancelar este agendamento?')) return
    setLoadingCancelar(true)
    try {
      await cancelarAgendamento(agendamentoAtivo.id)
      setAgendamentoAtivo(null)
    } catch {
      alert('Erro ao cancelar. Tente novamente.')
    } finally {
      setLoadingCancelar(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />

      <div className="container-fluid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="row g-4">
          {/* Coluna esquerda */}
          <div className="col-md-4">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div className="text-center mb-3">
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: '#e5e7eb',
                    margin: '0 auto 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#9ca3af">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </div>
                <div className="fw-bold" style={{ fontSize: '17px', color: '#1f2937' }}>{medico.nome}</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{medico.especialidade}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{medico.crm}</div>
              </div>

              <button
                className="btn btn-outline-secondary btn-sm w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setMostrarTelefone(!mostrarTelefone)}
                style={{ borderRadius: '8px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
                </svg>
                {mostrarTelefone ? medico.telefone : 'Ver telefone'}
              </button>

              {agendamentoAtivo && (
                <button
                  className="btn btn-sm w-100 mb-3"
                  style={{ backgroundColor: '#dc2626', color: '#ffffff', borderRadius: '8px' }}
                  onClick={handleCancelar}
                  disabled={loadingCancelar}
                >
                  {loadingCancelar ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : null}
                  Cancelar Agendamento Ativo
                </button>
              )}

              <label className="form-label fw-semibold" style={{ fontSize: '13px', color: '#374151' }}>
                Observações:
              </label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Descreva seus sintomas ou observações..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                style={{ borderRadius: '8px', fontSize: '13px', resize: 'none' }}
              />
            </div>
          </div>

          {/* Coluna direita */}
          <div className="col-md-8">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb',
              }}
            >
              <div className="fw-bold mb-3" style={{ color: '#1f2937' }}>Agendar consulta</div>

              {/* Tipo */}
              <div className="d-flex gap-4 mb-4">
                {(['tele', 'presencial'] as const).map((t) => (
                  <label key={t} className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="tipoConsulta"
                      checked={tipoConsulta === t}
                      onChange={() => setTipoConsulta(t)}
                      style={{ accentColor: '#1a4731' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {t === 'tele' ? 'Tele-consulta' : 'Presencial'}
                    </span>
                  </label>
                ))}
              </div>

              {/* Navegação semana */}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setOffsetSemanas((o) => o - 1)}
                  disabled={offsetSemanas <= 0}
                  style={{ borderRadius: '8px' }}
                >
                  ◄
                </button>
                <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                  {DIAS_SEMANA[dias[0].getDay()]} {dias[0].getDate()} {MESES[dias[0].getMonth()]} —{' '}
                  {DIAS_SEMANA[dias[3].getDay()]} {dias[3].getDate()} {MESES[dias[3].getMonth()]} {dias[3].getFullYear()}
                </span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setOffsetSemanas((o) => o + 1)}
                  style={{ borderRadius: '8px' }}
                >
                  ►
                </button>
              </div>

              {/* Grid de dias/horários */}
              <div className="semana-header">
                {dias.map((dia) => {
                  const dataStr = formatData(dia)
                  const limite = getLimiteMostrado(dataStr)
                  const horariosParaMostrar = horariosDisponiveis.slice(0, limite)

                  return (
                    <div key={dataStr} className="dia-col">
                      <div className="dia-header">
                        {DIAS_SEMANA[dia.getDay()]} {String(dia.getDate()).padStart(2, '0')}/{String(dia.getMonth() + 1).padStart(2, '0')}
                      </div>

                      {horariosParaMostrar.map((hora) => {
                        const ocupado = isSlotOcupado(dataStr, hora)
                        const selecionado = dataSelecionada === dataStr && horaSelecionada === hora
                        return (
                          <button
                            key={hora}
                            className={`horario-btn${selecionado ? ' selecionado' : ''}`}
                            disabled={ocupado}
                            onClick={() => {
                              setDataSelecionada(dataStr)
                              setHoraSelecionada(hora)
                            }}
                          >
                            {hora}
                          </button>
                        )
                      })}

                      {limite < horariosDisponiveis.length && (
                        <button
                          className="btn btn-link btn-sm p-0"
                          style={{ fontSize: '12px', color: '#6b7280' }}
                          onClick={() =>
                            setHorariosMostrados((prev) => ({
                              ...prev,
                              [dataStr]: horariosDisponiveis.length,
                            }))
                          }
                        >
                          Mais...
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Botão agendar */}
              <div className="mt-4">
                <button
                  className="btn btn-laranja"
                  style={{ borderRadius: '8px', padding: '10px 24px' }}
                  disabled={!dataSelecionada || !horaSelecionada}
                  onClick={() => {
                    setErroCriar('')
                    setErroConsultaDia('')
                    if (verificarConsultaNoDia(dataSelecionada)) {
                      setErroConsultaDia('Você já possui uma consulta agendada para este dia. Escolha outra data.')
                      return
                    }
                    setShowModalConfirm(true)
                  }}
                >
                  Agendar Consulta
                </button>

                {dataSelecionada && horaSelecionada && (
                  <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '12px' }}>
                    {dataSelecionada} às {horaSelecionada}
                  </span>
                )}

                {erroConsultaDia && (
                  <div className="alert alert-warning py-2 mt-3 mb-0" style={{ fontSize: '13px' }}>
                    {erroConsultaDia}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalConfirmacao
        show={showModalConfirm}
        onClose={() => setShowModalConfirm(false)}
        onConfirmar={handleAgendar}
        nomeMedico={medico.nome}
        data={dataSelecionada}
        hora={horaSelecionada}
        loading={loadingAgendar}
        erro={erroCriar}
      />

      <ModalSucesso
        show={showModalSucesso}
        onClose={() => setShowModalSucesso(false)}
      />
    </div>
  )
}
