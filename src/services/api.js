// ─── Serviço de comunicação com a API ────────────────────────────────────────
// Centraliza todas as chamadas HTTP para o backend Node.js.
// Em desenvolvimento usa localhost:3001.
// Em produção usa a URL do Railway (definida em .env).

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// Recupera o token salvo no localStorage
function getToken() {
  return localStorage.getItem('unifametro_token')
}

// Monta os headers padrão (com token se existir)
function headers(autenticado = false) {
  const h = { 'Content-Type': 'application/json' }
  if (autenticado) {
    const token = getToken()
    if (token) h['Authorization'] = `Bearer ${token}`
  }
  return h
}

// Trata erros da API de forma uniforme
async function handleResponse(res) {
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erro desconhecido.')
  return data
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export async function cadastrar({ nome, tipo, credencial, senha }) {
  const res = await fetch(`${BASE_URL}/auth/cadastro`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ nome, tipo, credencial, senha }),
  })
  const data = await handleResponse(res)
  // Salva token e usuário no localStorage
  localStorage.setItem('unifametro_token', data.token)
  localStorage.setItem('unifametro_session', JSON.stringify(data.usuario))
  return data
}

export async function login({ tipo, credencial, senha }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ tipo, credencial, senha }),
  })
  const data = await handleResponse(res)
  localStorage.setItem('unifametro_token', data.token)
  localStorage.setItem('unifametro_session', JSON.stringify(data.usuario))
  return data
}

export function logout() {
  localStorage.removeItem('unifametro_token')
  localStorage.removeItem('unifametro_session')
}

// ─── AGENDAMENTOS ─────────────────────────────────────────────────────────────

export async function buscarAgendamentos() {
  const res = await fetch(`${BASE_URL}/agendamentos`, {
    headers: headers(true),
  })
  return handleResponse(res)
}

export async function criarAgendamento(dados) {
  const res = await fetch(`${BASE_URL}/agendamentos`, {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(dados),
  })
  return handleResponse(res)
}

export async function cancelarAgendamento(id) {
  const res = await fetch(`${BASE_URL}/agendamentos/${id}/cancelar`, {
    method: 'PATCH',
    headers: headers(true),
  })
  return handleResponse(res)
}

export async function buscarSlotsOcupados() {
  const res = await fetch(`${BASE_URL}/agendamentos/slots-ocupados`, {
    headers: headers(true),
  })
  return handleResponse(res)
}
