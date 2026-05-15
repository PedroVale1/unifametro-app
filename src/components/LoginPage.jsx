import { useState } from 'react'
import { login } from '../services/api.js'

function LoginPage({ onSuccess, setPage }) {
  const [type, setType]       = useState('aluno')
  const [credential, setCred] = useState('')
  const [senha, setSenha]     = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const isAluno = type === 'aluno'

  async function handleSubmit() {
    if (!credential || !senha) { setError(isAluno ? 'Preencha sua matrícula e senha.' : 'Preencha seu e-mail e senha.'); return }
    setError(''); setLoading(true)
    try {
      const data = await login({ tipo: type, credencial: credential, senha })
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
        <h2 className="login-title">Entrar na conta</h2>
        <p className="login-sub">Identifique-se para acessar o sistema de agendamento.</p>
        <div className="radio-group">
          <label className="radio-label"><input type="radio" checked={isAluno} onChange={() => { setType('aluno'); setCred(''); setError('') }} /> Sou aluno</label>
          <label className="radio-label"><input type="radio" checked={!isAluno} onChange={() => { setType('cliente'); setCred(''); setError('') }} /> Sou cliente</label>
        </div>
        <div className="form-group">
          <label>{isAluno ? 'Matrícula' : 'E-mail'}</label>
          <input type={isAluno ? 'text' : 'email'} placeholder={isAluno ? 'Ex: 2024001234' : 'seu@email.com'} value={credential} onChange={e => setCred(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input type="password" placeholder="••••••••" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>
        {error && <p style={{ color: '#e8612a', fontSize: '.82rem', marginBottom: '.7rem' }}>{error}</p>}
        <button className="btn-primary" style={{ width: '100%', padding: '.7rem', fontSize: '.9rem' }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p style={{ textAlign: 'center', fontSize: '.82rem', color: '#888', marginTop: '1rem' }}>
          Não tem conta?{' '}
          <span style={{ color: '#1a3d2b', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setPage('cadastro')}>Cadastre-se</span>
        </p>
      </div>
      <div className="login-img">👨‍⚕️👩‍⚕️</div>
    </div>
  )
}
export default LoginPage
