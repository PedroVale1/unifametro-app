import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import clinica2Img from '../assets/images/medicos/clinica2.webp'
import enfermagemImg from '../assets/images/especialidades/enfermagem.webp'
import psicologiaImg from '../assets/images/especialidades/psicologia.webp'
import nutricaoImg from '../assets/images/especialidades/nutricao.webp'
import fisioterapiaImg from '../assets/images/especialidades/fisioterapia.webp'
import farmaciaImg from '../assets/images/especialidades/farmacia.webp'

const cards = [
  {
    imagem: enfermagemImg,
    objectPosition: 'center 20%',
    cor: '#e0f2fe',
    badge: 'ENFERMAGEM',
    titulo: 'Enfermagem — Estomaterapia',
    descricao:
      'Nossa equipe de enfermagem especializada em estomaterapia oferece cuidados avançados para pacientes com feridas, ostomias e incontinências. Atendimento supervisionado por professores especialistas certificados.',
  },
  {
    imagem: psicologiaImg,
    objectPosition: 'center center',
    cor: '#f3e8ff',
    badge: 'PSICOLOGIA',
    titulo: 'Psicologia — Psicoterapia Individual',
    descricao:
      'Atendimento psicológico individual com abordagem humanizada. Nossos estagiários supervisionados oferecem suporte emocional, acompanhamento terapêutico e promoção da saúde mental para toda a comunidade.',
  },
  {
    imagem: nutricaoImg,
    objectPosition: 'center center',
    cor: '#dcfce7',
    badge: 'NUTRIÇÃO',
    titulo: 'Nutrição — Atendimento Nutricional',
    descricao:
      'Consultas nutricionais completas com avaliação antropométrica, elaboração de planos alimentares personalizados e acompanhamento contínuo. Foco em alimentação saudável e qualidade de vida.',
  },
  {
    imagem: fisioterapiaImg,
    objectPosition: 'center 30%',
    cor: '#fff7ed',
    badge: 'FISIOTERAPIA',
    titulo: 'Fisioterapia — Neurofuncional',
    descricao:
      'Fisioterapia especializada em reabilitação neurofuncional para pacientes com alterações neurológicas. Tratamento individualizado com técnicas modernas e equipamentos de ponta.',
  },
  {
    imagem: farmaciaImg,
    objectPosition: 'center center',
    cor: '#fefce8',
    badge: 'FARMÁCIA',
    titulo: 'Farmácia — Acompanhamento Farmacoterapêutico',
    descricao:
      'Serviço de acompanhamento farmacoterapêutico para otimização do uso de medicamentos. Orientação sobre posologia, interações medicamentosas e promoção do uso racional de medicamentos.',
  },
]

export default function Especialidades() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navbar />

      {/* Header */}
      <div className="header-padded" style={{ position: 'relative', backgroundColor: '#0f2d1f', padding: '64px 80px', overflow: 'hidden', minHeight: '350px', display: 'flex', alignItems: 'center' }}>
        <img
          src={clinica2Img}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.15, pointerEvents: 'none' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 className="text-white fw-bold" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
            Nossas Especialidades
          </h1>
          <p className="text-white" style={{ opacity: 0.8, fontSize: '16px', maxWidth: '560px', margin: 0 }}>
            Conheça todas as áreas de atendimento da nossa clínica
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="container-fluid" style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 20px' }}>
        <div className="row g-4">
          {cards.map((card) => (
            <div className="col-md-6" key={card.badge}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  border: '1px solid #e5e7eb',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)'
                }}
              >
                {/* Ilustração */}
                <div
                  style={{
                    backgroundColor: card.cor,
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={card.imagem}
                    alt={card.badge}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: card.objectPosition,
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '16px',
                      backgroundColor: '#0f2d1f',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {card.badge}
                  </span>
                </div>

                {/* Conteúdo */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ color: '#0f2d1f', fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>
                    {card.titulo}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.7, flex: 1 }}>
                    {card.descricao}
                  </p>
                  <button
                    className="btn btn-laranja btn-sm mt-3"
                    style={{ borderRadius: '8px', alignSelf: 'flex-start', padding: '8px 20px' }}
                    onClick={() => navigate('/agendamento')}
                  >
                    Agendar consulta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: '#0f2d1f', padding: '64px 20px', textAlign: 'center' }}>
        <h2 className="text-white fw-bold" style={{ fontSize: '2rem', marginBottom: '12px' }}>
          Pronto para agendar sua consulta?
        </h2>
        <p className="text-white" style={{ opacity: 0.8, fontSize: '16px', marginBottom: '28px' }}>
          Escolha a especialidade e agende agora mesmo
        </p>
        <button
          className="btn btn-laranja"
          style={{ borderRadius: '8px', padding: '12px 36px', fontSize: '16px', fontWeight: 600 }}
          onClick={() => navigate('/agendamento')}
        >
          Agendar agora
        </button>
      </div>
    </div>
  )
}
