import { useState } from 'react'

const EXAMES = [
  {
    categoria: 'Sangue', emoji: '🩸',
    itens: [
      { id: 'ex1', nome: 'Hemograma completo',        descricao: 'Avalia glóbulos vermelhos, brancos e plaquetas.', preparo: 'Jejum de 4h',       prazo: '1 dia útil'   },
      { id: 'ex2', nome: 'Glicemia em jejum',          descricao: 'Mede o nível de açúcar no sangue.',               preparo: 'Jejum de 8h',       prazo: '1 dia útil'   },
      { id: 'ex3', nome: 'Colesterol total e frações', descricao: 'Avalia HDL, LDL e colesterol total.',             preparo: 'Jejum de 12h',      prazo: '1 dia útil'   },
      { id: 'ex4', nome: 'Triglicerídeos',             descricao: 'Mede gordura no sangue.',                         preparo: 'Jejum de 12h',      prazo: '1 dia útil'   },
      { id: 'ex5', nome: 'Glicemia pós-prandial',      descricao: 'Glicose 2h após refeição.',                       preparo: 'Refeição normal',   prazo: '1 dia útil'   },
    ],
  },
  {
    categoria: 'Tireoide', emoji: '🔬',
    itens: [
      { id: 'ex6', nome: 'TSH',      descricao: 'Avalia o funcionamento da tireoide.',   preparo: 'Sem jejum', prazo: '2 dias úteis' },
      { id: 'ex7', nome: 'T4 Livre', descricao: 'Hormônio tireoideano ativo no sangue.', preparo: 'Sem jejum', prazo: '2 dias úteis' },
      { id: 'ex8', nome: 'T3 Total', descricao: 'Complemento ao TSH e T4.',              preparo: 'Sem jejum', prazo: '2 dias úteis' },
    ],
  },
  {
    categoria: 'Fígado e Rins', emoji: '🫀',
    itens: [
      { id: 'ex9',  nome: 'TGO / TGP (Transaminases)', descricao: 'Avalia saúde do fígado.',          preparo: 'Jejum de 4h', prazo: '1 dia útil' },
      { id: 'ex10', nome: 'Creatinina',                 descricao: 'Avalia o funcionamento dos rins.', preparo: 'Jejum de 4h', prazo: '1 dia útil' },
      { id: 'ex11', nome: 'Ureia',                      descricao: 'Complementar à creatinina.',       preparo: 'Jejum de 4h', prazo: '1 dia útil' },
      { id: 'ex12', nome: 'Ácido úrico',                descricao: 'Relacionado a gota e rins.',       preparo: 'Jejum de 4h', prazo: '1 dia útil' },
    ],
  },
  {
    categoria: 'Urina e Fezes', emoji: '🧪',
    itens: [
      { id: 'ex13', nome: 'EAS — Urina tipo I',        descricao: 'Análise geral da urina.',       preparo: '1ª urina da manhã', prazo: '1 dia útil'   },
      { id: 'ex14', nome: 'Urocultura',                 descricao: 'Detecta infecção urinária.',    preparo: '1ª urina da manhã', prazo: '3 dias úteis' },
      { id: 'ex15', nome: 'Parasitológico de fezes',   descricao: 'Detecta parasitas intestinais.',preparo: '3 amostras',        prazo: '3 dias úteis' },
    ],
  },
  {
    categoria: 'Imagem', emoji: '🩻',
    itens: [
      { id: 'ex16', nome: 'Raio-X de tórax',            descricao: 'Avalia pulmões e coração.',          preparo: 'Sem preparo', prazo: 'No ato' },
      { id: 'ex17', nome: 'Ultrassonografia abdominal', descricao: 'Avalia órgãos abdominais.',          preparo: 'Jejum de 6h', prazo: 'No ato' },
      { id: 'ex18', nome: 'Eletrocardiograma (ECG)',    descricao: 'Avalia a atividade do coração.',     preparo: 'Sem preparo', prazo: 'No ato' },
    ],
  },
]

export { EXAMES }

function ExamesPage({ setPage, setSelectedExam }) {
  const [catAtiva, setCatAtiva]     = useState(null)
  const [exameAberto, setExame]     = useState(null)

  function handleAgendar(e, exam) {
    e.stopPropagation()
    setSelectedExam(exam)
    setPage('exambooking')
  }

  const cats = catAtiva ? [EXAMES.find(c => c.categoria === catAtiva)] : EXAMES

  return (
    <div style={{ maxWidth: 860, margin: '2rem auto', padding: '0 1.5rem' }}>

      {/* Header */}
      <div style={{
        background: '#1a3d2b', borderRadius: 14, padding: '1.5rem 2rem',
        color: '#fff', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Exames disponíveis</h2>
          <p style={{ fontSize: '.83rem', color: '#a8d5b8', marginTop: '.25rem' }}>
            Selecione um exame e clique em Agendar para marcar seu horário
          </p>
        </div>
      </div>

      {/* Filtros por categoria */}
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        <div className={`tab${catAtiva === null ? ' active' : ''}`} onClick={() => setCatAtiva(null)}>
          Todos
        </div>
        {EXAMES.map(c => (
          <div key={c.categoria} className={`tab${catAtiva === c.categoria ? ' active' : ''}`}
            onClick={() => setCatAtiva(c.categoria)}>
            {c.emoji} {c.categoria}
          </div>
        ))}
      </div>

      {/* Lista */}
      {cats.map(cat => (
        <div key={cat.categoria} style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '.75rem', fontWeight: 700, color: '#1a3d2b',
            textTransform: 'uppercase', letterSpacing: '.5px',
            marginBottom: '.6rem', display: 'flex', alignItems: 'center', gap: '.4rem'
          }}>
            {cat.emoji} {cat.categoria}
          </div>

          {cat.itens.map(ex => (
            <div key={ex.id}
              onClick={() => setExame(exameAberto?.id === ex.id ? null : ex)}
              style={{
                border: '1px solid',
                borderColor: exameAberto?.id === ex.id ? '#1a3d2b' : '#e0e0e0',
                borderRadius: 10, padding: '1rem 1.2rem',
                marginBottom: '.5rem', background: '#fff',
                cursor: 'pointer', transition: 'all .2s',
              }}
            >
              {/* Linha principal */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#1a3d2b', fontSize: '.95rem' }}>{ex.nome}</div>
                  <div style={{ fontSize: '.8rem', color: '#888', marginTop: '.1rem' }}>{ex.descricao}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem', marginLeft: '1rem' }}>
                  <button
                    className="btn-primary"
                    style={{ padding: '.35rem .9rem', fontSize: '.8rem', whiteSpace: 'nowrap' }}
                    onClick={e => handleAgendar(e, ex)}
                  >
                    Agendar
                  </button>
                  <span style={{ fontSize: '.85rem', color: '#aaa' }}>
                    {exameAberto?.id === ex.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Detalhes expandidos */}
              {exameAberto?.id === ex.id && (
                <div style={{
                  marginTop: '.8rem', paddingTop: '.8rem',
                  borderTop: '1px solid #e8f5ec',
                  display: 'flex', gap: '2rem', flexWrap: 'wrap'
                }}>
                  <div>
                    <div style={{ fontSize: '.72rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Preparo</div>
                    <div style={{ fontSize: '.85rem', color: '#333', marginTop: '.2rem' }}>🕐 {ex.preparo}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '.72rem', color: '#888', fontWeight: 600, textTransform: 'uppercase' }}>Resultado</div>
                    <div style={{ fontSize: '.85rem', color: '#333', marginTop: '.2rem' }}>📋 {ex.prazo}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      <div style={{
        background: '#e8f5ec', borderRadius: 10, padding: '1rem 1.2rem',
        fontSize: '.83rem', color: '#1a3d2b', marginTop: '.5rem'
      }}>
        ℹ️ Clique em <strong>Agendar</strong> no exame desejado para escolher a data e horário.
      </div>
    </div>
  )
}

export default ExamesPage
