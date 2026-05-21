import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cadastrar } from '../services/api'
import logoUnifametro from '../assets/images/logo-unifametro.webp'
import agendamentoImg from '../assets/images/agendamento/agendamento.webp'

const formatarCPF = (valor: string) =>
  valor.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14)

const formatarMatricula = (valor: string) => {
  const n = valor.replace(/\D/g, '').slice(0, 12)
  return n.length <= 1 ? n : n[0] + '-' + n.slice(1)
}

export default function Cadastro() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'aluno' | 'cliente'>('aluno')
  const [credencial, setCredencial] = useState('')
  const [nome, setNome] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setErro('')

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const res = await cadastrar({ nome, tipo, credencial, senha })
      const { token, usuario } = res.data
      localStorage.removeItem('unifametro_agendamentos')
      localStorage.removeItem('unifametro_usuario')
      localStorage.removeItem('unifametro_token')
      localStorage.setItem('unifametro_token', token)
      localStorage.setItem('unifametro_usuario', JSON.stringify(usuario))
      setSucesso(true)
      setTimeout(() => navigate('/minhas-consultas'), 1500)
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error.response?.status === 409) {
        setErro('Este CPF/matrícula já está cadastrado.')
      } else {
        setErro('Erro ao cadastrar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ backgroundColor: '#0f2d1f', padding: '14px 40px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <img
          src={logoUnifametro}
          alt="Unifametro"
          style={{ height: '58px', objectFit: 'contain', display: 'block', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        />
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px' }}>
          <div className="row g-0" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>

            {/* Coluna esquerda — formulário */}
            <div className="col-12 col-md-7 form-panel" style={{ backgroundColor: '#ffffff', order: 1 }}>
              <h2 style={{ color: '#0f2d1f', fontWeight: 700, fontSize: '1.75rem', marginBottom: '6px' }}>
                Criar conta
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>
                Preencha os dados abaixo para se cadastrar
              </p>

              {sucesso && (
                <div className="alert py-2 mb-3" style={{ backgroundColor: '#d1fae5', color: '#065f46', fontSize: '14px', border: '1px solid #a7f3d0' }}>
                  ✅ Conta criada com sucesso! Redirecionando...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Tipo */}
                <div className="mb-3 d-flex gap-4">
                  {(['aluno', 'cliente'] as const).map((t) => (
                    <label key={t} className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="tipo"
                        value={t}
                        checked={tipo === t}
                        onChange={() => { setTipo(t); setCredencial('') }}
                        style={{ accentColor: '#0f2d1f', width: '18px', height: '18px' }}
                      />
                      <span style={{ fontWeight: 500, color: '#374151', fontSize: '14px' }}>
                        {t === 'aluno' ? 'Sou aluno' : 'Sou cliente'}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Credencial */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#374151', fontSize: '13px' }}>
                    {tipo === 'aluno' ? 'Matrícula' : 'CPF'}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={tipo === 'aluno' ? '0-00000000000' : '000.000.000-00'}
                    value={credencial}
                    onChange={(e) => setCredencial(tipo === 'cliente' ? formatarCPF(e.target.value) : formatarMatricula(e.target.value))}
                    required
                    style={{ padding: '12px 16px', borderRadius: '8px', borderColor: '#d1d5db' }}
                  />
                </div>

                {/* Nome */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#374151', fontSize: '13px' }}>
                    Nome completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    style={{ padding: '12px 16px', borderRadius: '8px', borderColor: '#d1d5db' }}
                  />
                </div>

                {/* Senha */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#374151', fontSize: '13px' }}>
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    style={{ padding: '12px 16px', borderRadius: '8px', borderColor: '#d1d5db' }}
                  />
                </div>

                {/* Confirmar senha */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#374151', fontSize: '13px' }}>
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      borderColor: confirmarSenha && senha !== confirmarSenha ? '#dc2626' : '#d1d5db',
                    }}
                  />
                  {confirmarSenha && senha !== confirmarSenha && (
                    <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                      As senhas não coincidem.
                    </div>
                  )}
                </div>

                {erro && (
                  <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '14px' }}>
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-laranja w-100"
                  disabled={loading || sucesso}
                  style={{ padding: '12px', borderRadius: '50px', fontSize: '15px', fontWeight: 600 }}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Aguarde...</>
                  ) : 'Cadastrar'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
                  Já tem conta?{' '}
                  <span
                    style={{ color: '#f97316', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => navigate('/agendamento')}
                  >
                    Faça login
                  </span>
                </p>
              </form>
            </div>

            {/* Coluna direita — imagem */}
            <div
              className="col-md-5 d-none d-md-block"
              style={{
                backgroundImage: `url(${agendamentoImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100%',
                height: '100vh',
                borderRadius: '0 16px 16px 0',
                position: 'relative',
                overflow: 'hidden',
                order: 2,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(15,45,31,0.75) 0%, rgba(45,106,79,0.60) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: '64px' }}>🏥</span>
                <h3 style={{ fontWeight: 700, marginTop: '16px' }}>
                  Clínica Integrada de Saúde Unifametro
                </h3>
                <p style={{ opacity: 0.85, marginTop: '8px' }}>
                  Crie sua conta e tenha acesso a consultas com profissionais supervisionados, de forma totalmente online.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
