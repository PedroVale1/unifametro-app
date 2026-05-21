import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Agendamento from './pages/Agendamento'
import SelecionarMedico from './pages/SelecionarMedico'
import AgendamentoMedico from './pages/AgendamentoMedico'
import MinhasConsultas from './pages/MinhasConsultas'
import SobreNos from './pages/SobreNos'
import Cadastro from './pages/Cadastro'
import Especialidades from './pages/Especialidades'

function RotaProtegida({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('unifametro_token')
  if (!token) return <Navigate to="/agendamento" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route
          path="/agendamento/medicos"
          element={
            <RotaProtegida>
              <SelecionarMedico />
            </RotaProtegida>
          }
        />
        <Route
          path="/agendamento/medico/:id"
          element={
            <RotaProtegida>
              <AgendamentoMedico />
            </RotaProtegida>
          }
        />
        <Route
          path="/minhas-consultas"
          element={
            <RotaProtegida>
              <MinhasConsultas />
            </RotaProtegida>
          }
        />
        <Route path="/sobre-nos" element={<SobreNos />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/especialidades" element={<Especialidades />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
