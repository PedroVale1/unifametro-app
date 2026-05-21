import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import logoUnifametro from '../assets/images/logo-unifametro.webp'
import clinicaImg from '../assets/images/especialidades/clinica.webp'

export default function Agendamento() {
  const navigate = useNavigate()
  const [tipo, setTipo] = useState<'aluno' | 'cliente'>('aluno')
  const [credencial, setCredencial] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const formatarCPF = (valor: string) =>
    valor.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').slice(0, 14)

  const formatarMatricula = (valor: string) => {
    const n = valor.replace(/\D/g, '').slice(0, 12)
    return n.length <= 1 ? n : n[0] + '-' + n.slice(1)
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const res = await login({ tipo, credencial, senha })
      const { token, usuario } = res.data
      localStorage.removeItem('unifametro_agendamentos')
      localStorage.removeItem('unifametro_usuario')
      localStorage.removeItem('unifametro_token')
      localStorage.setItem('unifametro_token', token)
      localStorage.setItem('unifametro_usuario', JSON.stringify(usuario))
      navigate('/minhas-consultas')
    } catch (err: unknown) {
      const error = err as { response?: { status?: number } }
      if (error.response?.status === 401) {
        setErro('Credenciais inválidas.')
      } else if (error.response?.status === 404) {
        setErro('Usuário não encontrado.')
      } else {
        setErro('Ocorreu um erro. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ position: 'relative', backgroundColor: '#0f2d1f', padding: '14px 40px', display: 'flex', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <img src={clinicaImg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.12, pointerEvents: 'none' }} />
        <img
          src={logoUnifametro}
          alt="Unifametro"
          style={{ height: '58px', objectFit: 'contain', display: 'block', cursor: 'pointer', position: 'relative', zIndex: 1 }}
          onClick={() => navigate('/')}
        />
      </div>

      {/* Conteúdo principal */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
        <div style={{ width: '100%', maxWidth: '960px' }}>
          <div className="row g-0" style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>

            {/* Painel esquerdo — verde */}
            <div
              className="col-md-5 d-none d-md-flex flex-column justify-content-center"
              style={{ backgroundColor: '#0f2d1f', padding: '48px 40px', color: '#ffffff' }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🗓️</div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px', color: '#ffffff' }}>
                Bem-vindo à Clínica Unifametro
              </h2>
              <p style={{ opacity: 0.8, fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
                Agende sua consulta de forma rápida e segura
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Atendimento supervisionado por especialistas',
                  'Diversas especialidades disponíveis',
                  'Agendamento 100% online',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px' }}>
                    <span style={{ flexShrink: 0, marginTop: '1px' }}>✅</span>
                    <span style={{ opacity: 0.9 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Painel direito — formulário */}
            <div className="col-12 col-md-7 form-panel" style={{ backgroundColor: '#ffffff' }}>
              <h2 style={{ color: '#0f2d1f', fontWeight: 700, fontSize: '1.75rem', marginBottom: '6px' }}>
                Agendamento virtual
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '28px', fontSize: '14px' }}>
                Para continuar, identifique-se abaixo:
              </p>

              <form onSubmit={handleSubmit}>
                {/* Radio tipo */}
                <div className="mb-4 d-flex gap-4">
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

                {/* Senha */}
                <div className="mb-4">
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

                {erro && (
                  <div className="alert alert-danger py-2 mb-3" style={{ fontSize: '14px' }}>
                    {erro}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-laranja w-100"
                  disabled={loading}
                  style={{ padding: '12px', borderRadius: '8px', fontSize: '15px', fontWeight: 600 }}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Aguarde...</>
                  ) : 'Confirmar'}
                </button>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
                  Não tem conta?{' '}
                  <span
                    style={{ color: '#f97316', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => navigate('/cadastro')}
                  >
                    Cadastre-se aqui
                  </span>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
