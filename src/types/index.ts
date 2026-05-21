export interface Usuario {
  id: number
  nome: string
  tipo: 'aluno' | 'cliente'
  credencial: string
  created_at?: string
}

export interface Agendamento {
  id: number
  usuario_id: number
  tipo: 'consulta' | 'exame'
  titulo: string
  especialidade: string
  data: string
  hora: string
  status: string
  emoji: string
  local: string | null
  slot_key: string
  created_at: string
}

export interface CadastroDados {
  nome: string
  tipo: 'aluno' | 'cliente'
  credencial: string
  senha: string
}

export interface LoginDados {
  tipo: 'aluno' | 'cliente'
  credencial: string
  senha: string
}

export interface AgendamentoDados {
  tipo: 'consulta' | 'exame'
  titulo: string
  especialidade: string
  data: string
  hora: string
  emoji: string
  local: string | null
  slot_key: string
}

export interface SlotOcupado {
  slot_key: string
}
