function HomePage({ setPage }) {
  return (
    <div>
      {/* HERO fullscreen */}
      <div className="hero">

        {/* Lado esquerdo — texto */}
        <div className="hero-text">
          <div className="hero-badge">Clínica Integrada de Saúde</div>
          <h1>Formando Profissionais,<br />Cuidando de Pessoas</h1>
          <p>
            Na nossa Clínica Escola, unimos ensino de excelência e atendimento
            de qualidade para garantir o seu bem-estar.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setPage('schedule')}>
              Agendar atendimento
            </button>
            <button className="btn-outline" onClick={() => setPage('especialidades')}>
              Visualizar especialidades
            </button>
          </div>
        </div>

        {/* Lado direito — foto de fundo com overlay e logo */}
        <div className="hero-right-panel">
          {/* Foto de fundo */}
          <img
            src="/hero-bg.png"
            alt="Clínica"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
            }}
          />
          {/* Overlay escuro para legibilidade */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, #1a3d2b 0%, rgba(26,61,43,0.55) 100%)',
          }} />

          {/* Logo sobre a foto */}
          <div className="hero-logo-wrap">
            <img src="/logo.png" alt="Unifametro" style={{ width: 90, height: 90, borderRadius: 16, objectFit: 'cover' }} />
            <div className="hero-logo-name">Unifametro</div>
            <div className="hero-logo-slogan">Formar para Transformar</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default HomePage
