import axios from 'axios'
import type { CadastroDados, LoginDados, AgendamentoDados } from '../types'

const api = axios.create({
  baseURL: 'https://unifametro-api-production.up.railway.app',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('unifametro_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('unifametro_token')
      localStorage.removeItem('unifametro_usuario')
      localStorage.removeItem('unifametro_agendamentos')
      window.location.href = '/agendamento'
    }
    return Promise.reject(error)
  }
)

export const cadastrar = (dados: CadastroDados) => api.post('/auth/cadastro', dados)
export const login = (dados: LoginDados) => api.post('/auth/login', dados)
export const getMe = () => api.get('/auth/me')

export const getAgendamentos = () => api.get('/agendamentos')
export const criarAgendamento = (dados: AgendamentoDados) => api.post('/agendamentos', dados)
export const cancelarAgendamento = (id: number) => api.patch(`/agendamentos/${id}/cancelar`)
export const getSlotsOcupados = () => api.get('/agendamentos/slots-ocupados')

export default api
