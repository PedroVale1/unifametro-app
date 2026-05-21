import Navbar from '../components/Navbar'
import { instituicao } from '../data/dados'

export default function SobreNos() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navbar />

      {/* Header */}
      <div
        className="header-padded"
        style={{
          backgroundColor: '#1a4731',
          padding: '64px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="text-white fw-bold" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
            Sobre nós
          </h1>
          <p className="text-white" style={{ opacity: 0.8, fontSize: '16px', maxWidth: '560px' }}>
            Conheça a Clínica Integrada de Saúde Unifametro e nossa missão de cuidar das pessoas.
          </p>
        </div>
        <div
          style={{
            position: 'absolute',
            right: '-60px',
            top: '-60px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />
      </div>

      <div className="container-fluid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 20px' }}>

        {/* História */}
        <div className="row g-5 align-items-center mb-5">
          <div className="col-md-7">
            <p style={{ color: '#f97316', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', marginBottom: '8px' }}>
              NOSSA HISTÓRIA
            </p>
            <h2 style={{ color: '#1a4731', fontSize: '2rem', marginBottom: '20px' }}>
              Clínica Integrada de Saúde Unifametro
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '16px' }}>
              A Clínica Integrada de Saúde Unifametro é um espaço de aprendizado prático e
              atendimento humanizado. Somos uma clínica escola vinculada ao Centro Universitário
              Fametro, onde estudantes supervisionados por professores especialistas oferecem
              serviços de saúde de qualidade à comunidade de Fortaleza.
            </p>
          </div>
          <div className="col-md-5">
            <div
              style={{
                backgroundColor: '#1a4731',
                borderRadius: '16px',
                padding: '36px',
                color: '#ffffff',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏥</div>
              <div className="fw-bold" style={{ fontSize: '18px', marginBottom: '8px' }}>
                {instituicao.nome}
              </div>
              <div style={{ opacity: 0.8, fontSize: '14px', lineHeight: 1.6 }}>
                <div>📍 {instituicao.endereco}</div>
                <div className="mt-2">🕐 {instituicao.horario}</div>
                <div className="mt-2">📞 {instituicao.telefone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Diferenciais */}
        <div className="mb-5">
          <p style={{ color: '#f97316', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', marginBottom: '8px' }}>
            NOSSOS DIFERENCIAIS
          </p>
          <h2 style={{ color: '#1a4731', fontSize: '1.75rem', marginBottom: '32px' }}>
            Por que escolher a Unifametro?
          </h2>
          <div className="row g-4">
            {[
              {
                emoji: '🎓',
                titulo: 'Ensino de Excelência',
                descricao: 'Atendimentos realizados por estudantes supervisionados por professores especialistas com ampla experiência clínica.',
              },
              {
                emoji: '🏥',
                titulo: 'Atendimento Humanizado',
                descricao: 'Cuidado integral com foco no bem-estar do paciente, respeitando sua individualidade e promovendo saúde de qualidade.',
              },
              {
                emoji: '📍',
                titulo: 'Fácil Acesso',
                descricao: 'Localizada no Centro de Fortaleza, de segunda a sexta-feira, com horários flexíveis para melhor atender a comunidade.',
              },
            ].map((card) => (
              <div className="col-md-4" key={card.titulo}>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '28px',
                    height: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e5e7eb',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{card.emoji}</div>
                  <div className="fw-bold" style={{ color: '#1a4731', fontSize: '17px', marginBottom: '10px' }}>
                    {card.titulo}
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                    {card.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contato */}
        <div
          style={{
            backgroundColor: '#f0fdf4',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid #bbf7d0',
          }}
        >
          <p style={{ color: '#f97316', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', marginBottom: '8px' }}>
            CONTATO
          </p>
          <h2 style={{ color: '#1a4731', fontSize: '1.75rem', marginBottom: '24px' }}>
            Como nos encontrar
          </h2>
          <div className="row g-4">
            <div className="col-md-4 d-flex gap-3">
              <div style={{ fontSize: '1.5rem' }}>📍</div>
              <div>
                <div className="fw-semibold" style={{ color: '#1a4731', marginBottom: '4px' }}>Endereço</div>
                <div style={{ color: '#4b5563', fontSize: '14px' }}>{instituicao.endereco}</div>
              </div>
            </div>
            <div className="col-md-4 d-flex gap-3">
              <div style={{ fontSize: '1.5rem' }}>🕐</div>
              <div>
                <div className="fw-semibold" style={{ color: '#1a4731', marginBottom: '4px' }}>Horário</div>
                <div style={{ color: '#4b5563', fontSize: '14px' }}>{instituicao.horario}</div>
              </div>
            </div>
            <div className="col-md-4 d-flex gap-3">
              <div style={{ fontSize: '1.5rem' }}>📞</div>
              <div>
                <div className="fw-semibold" style={{ color: '#1a4731', marginBottom: '4px' }}>Telefone</div>
                <div style={{ color: '#4b5563', fontSize: '14px' }}>{instituicao.telefone}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
