import { useState } from 'react'
import { cadastrar } from '../services/api.js'

function CadastroPage({ onSuccess, setPage }) {
  const [type, setType]         = useState('aluno')
  const [nome, setNome]         = useState('')
  const [credential, setCred]   = useState('')
  const [senha, setSenha]       = useState('')
  const [confirma, setConfirma] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const isAluno = type === 'aluno'

  async function handleCadastrar() {
    if (!nome || !credential || !senha || !confirma) { setError('Preencha todos os campos.'); return }
    if (senha !== confirma) { setError('As senhas não coincidem.'); return }
    if (senha.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return }
    setError(''); setLoading(true)
    try {
      const data = await cadastrar({ nome, tipo: type, credencial: credential, senha })
      onSuccess(data.usuario)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-form card">
        <h2 className="login-title">Criar conta</h2>
        <p className="login-sub">Preencha os dados abaixo para se cadastrar no sistema.</p>
        <div className="radio-group">
          <label className="radio-label"><input type="radio" checked={isAluno} onChange={() => { setType('aluno'); setCred(''); setError('') }} /> Sou aluno</label>
          <label className="radio-label"><input type="radio" checked={!isAluno} onChange={() => { setType('cliente'); setCred(''); setError('') }} /> Sou cliente</label>
        </div>
        <div className="form-group">
          <label>Nome completo</label>
          <input placeholder="Seu nome completo" value={nome} onChange={e => setNome(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{isAluno ? 'Matrícula' : 'E-mail'}</label>
          <input type={isAluno ? 'text' : 'email'} placeholder={isAluno ? 'Ex: 2024001234' : 'seu@email.com'} value={credential} onChange={e => setCred(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input type="password" placeholder="Mínimo 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Confirmar senha</label>
          <input type="password" placeholder="Repita a senha" value={confirma} onChange={e => setConfirma(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCadastrar()} />
        </div>
        {error && <p style={{ color: '#e8612a', fontSize: '.82rem', marginBottom: '.7rem' }}>{error}</p>}
        <button className="btn-primary" style={{ width: '100%', padding: '.7rem', fontSize: '.9rem', marginTop: '.3rem' }} onClick={handleCadastrar} disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '.82rem', color: '#888', marginTop: '1rem' }}>
          Já tem uma conta?{' '}
          <span style={{ color: '#1a3d2b', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setPage('login')}>Entrar</span>
        </p>
      </div>
      <div className="login-img" style={{ flexDirection: 'column', gap: '0.5rem' }}>
        <span style={{ fontSize: '4rem' }}>👨‍⚕️👩‍⚕️</span>
        <div style={{ textAlign: 'center', padding: '0 1.5rem' }}>
          <p style={{ fontWeight: 700, color: '#1a3d2b', fontSize: '1rem' }}>Bem-vindo à Unifametro</p>
          <p style={{ color: '#666', fontSize: '.82rem', marginTop: '.3rem', lineHeight: 1.5 }}>Cadastre-se para agendar consultas e acompanhar seu histórico.</p>
        </div>
      </div>
    </div>
  )
}
export default CadastroPage
