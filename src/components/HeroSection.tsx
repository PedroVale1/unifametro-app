import heroImg from '../assets/images/hero/hero.webp'
import faviconIcon from '../assets/images/UNIFAMETRO-Favicon.webp'

export default function HeroSection() {
  return (
    <section className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="hero-inner">
        {/* Lado verde */}
        <div
          className="hero-left"
          style={{
            backgroundColor: '#1a4731',
            width: '55%',
            display: 'flex',
            alignItems: 'center',
            padding: '60px 60px 60px 80px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div>
            <h1
              style={{
                color: '#ffffff',
                fontSize: '2.5rem',
                fontWeight: 800,
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              Formando Profissionais,
              <br />
              Cuidando de Pessoas
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
              A Clínica Integrada de Saúde Unifametro oferece atendimentos
              <br />
              realizados por estudantes supervisionados por professores especialistas.
            </p>
          </div>

          {/* Círculo decorativo */}
          <div
            className="hero-circle"
            style={{
              position: 'absolute',
              right: '-80px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '220px',
              height: '220px',
              borderRadius: '50%',
              backgroundColor: '#2d6a4f',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              zIndex: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img src={faviconIcon} alt="Unifametro" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Lado imagem */}
        <div className="hero-right" style={{ width: '45%', position: 'relative', overflow: 'hidden' }}>
          <img
            src={heroImg}
            alt="Clínica Unifametro"
            style={{
              width: '100%',
              height: '100%',
              minHeight: '500px',
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.style.backgroundColor = '#2d6a4f'
              }
            }}
          />
        </div>
      </div>
    </section>
  )
}
