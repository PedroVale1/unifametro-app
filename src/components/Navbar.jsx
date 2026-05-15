function Navbar({ page, setPage, user, onLogout }) {
  return (
    <nav className="nav">
      {/* Logo */}
      <div className="nav-logo" onClick={() => setPage('home')} style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        <img src="/logo.png" alt="Unifametro" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
        <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', letterSpacing: '.5px' }}>Unifametro</span>
      </div>

      {/* Links */}
      <span className="nav-link" onClick={() => setPage('especialidades')}>Especialidades</span>
      <span className="nav-link" onClick={() => setPage('exames')}>Exames</span>
      {page !== 'home' && (
        <span className="nav-link" onClick={() => setPage('home')}>Início</span>
      )}
      {user && (
        <span className="nav-link" onClick={() => setPage('myappointments')}>Minhas Consultas</span>
      )}

      {/* Direita: logado ou não */}
      <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
        {user ? (
          /* ── LOGADO ── */
          <>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '.5rem',
              background: 'rgba(255,255,255,0.1)', borderRadius: 20,
              padding: '.3rem .9rem',
            }}>
              <span style={{ fontSize: '1.1rem' }}>👤</span>
              <span style={{ color: '#fff', fontSize: '.83rem', fontWeight: 600 }}>
                {user.nome}
              </span>
              <span style={{
                background: user.type === 'aluno' ? '#2d8a50' : '#e8612a',
                color: '#fff', fontSize: '.65rem', fontWeight: 700,
                padding: '.15rem .5rem', borderRadius: 10, letterSpacing: '.3px'
              }}>
                {user.type === 'aluno' ? 'ALUNO' : 'CLIENTE'}
              </span>
            </div>
            <button
              className="nav-btn"
              style={{ borderColor: '#ff9999', color: '#ff9999' }}
              onClick={onLogout}
            >
              Sair
            </button>
          </>
        ) : (
          /* ── NÃO LOGADO ── */
          <>
            <button className="nav-btn" onClick={() => setPage('cadastro')}>
              Cadastrar
            </button>
            <button
              className="nav-btn"
              style={{ background: 'rgba(255,255,255,0.12)' }}
              onClick={() => setPage('login')}
            >
              Entrar 👤
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
