import { useState, useEffect } from 'react'
import Navbar              from './components/Navbar.jsx'
import HomePage            from './components/HomePage.jsx'
import LoginPage           from './components/LoginPage.jsx'
import CadastroPage        from './components/CadastroPage.jsx'
import MyAppointments      from './components/MyAppointments.jsx'
import DoctorsList         from './components/DoctorsList.jsx'
import BookingPage         from './components/BookingPage.jsx'
import ExamesPage          from './components/ExamesPage.jsx'
import ExameBookingPage    from './components/ExameBookingPage.jsx'
import SpecialidadesPage   from './components/SpecialidadesPage.jsx'
import { DOCTORS } from './data.js'
import {
  logout as apiLogout,
  buscarAgendamentos,
  criarAgendamento,
  cancelarAgendamento,
  buscarSlotsOcupados,
} from './services/api.js'

function App() {
  const [page, setPage]                     = useState('home')
  const [pendingPage, setPendingPage]       = useState(null)
  const [selectedSpec, setSelectedSpec]     = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedExam, setSelectedExam]     = useState(null)
  const [loading, setLoading]               = useState(false)

  // Carrega sessão salva
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('unifametro_session')) || null }
    catch { return null }
  })

  const [appointments, setAppointments] = useState([])
  const [bookedSlots, setBookedSlots]   = useState({})

  // Quando o usuário loga, busca os agendamentos e slots da API
  useEffect(() => {
    if (user) {
      fetchAppointments()
      fetchSlots()
    } else {
      setAppointments([])
      setBookedSlots({})
    }
  }, [user])

  async function fetchAppointments() {
    try {
      const data = await buscarAgendamentos()
      // Mapeia o formato da API para o formato do front
      const mapped = data.agendamentos.map(a => ({
        id:        a.id,
        doctor:    a.titulo,
        specialty: a.especialidade || '',
        date:      a.data,
        time:      a.hora,
        status:    a.status,
        emoji:     a.emoji || '🩺',
        tipo:      a.tipo === 'exame' ? 'exame' : undefined,
        local:     a.local,
        slotKey:   a.slot_key,
      }))
      setAppointments(mapped)
    } catch (err) {
      console.error('Erro ao buscar agendamentos:', err)
    }
  }

  async function fetchSlots() {
    try {
      const data = await buscarSlotsOcupados()
      setBookedSlots(data.slots)
    } catch (err) {
      console.error('Erro ao buscar slots:', err)
    }
  }

  function navigate(destination) {
    const protectedPages = ['myappointments', 'doctors', 'booking', 'exambooking']
    if (protectedPages.includes(destination) && !user) {
      setPendingPage(destination)
      setPage('login')
    } else {
      setPage(destination)
    }
  }

  function handleLoginSuccess(userData) {
    setUser(userData)
    const dest = pendingPage || 'myappointments'
    setPendingPage(null)
    setPage(dest)
  }

  function handleLogout() {
    apiLogout()
    setUser(null)
    setPage('home')
  }

  async function handleAppointmentCreated(newAppt, slotKey) {
    setLoading(true)
    try {
      await criarAgendamento({
        tipo:         newAppt.tipo === 'exame' ? 'exame' : 'consulta',
        titulo:       newAppt.doctor,
        especialidade: newAppt.specialty,
        data:         newAppt.date,
        hora:         newAppt.time,
        emoji:        newAppt.emoji,
        local:        newAppt.local,
        slot_key:     slotKey,
      })
      // Recarrega da API para garantir consistência
      await fetchAppointments()
      await fetchSlots()
    } catch (err) {
      alert(err.message || 'Erro ao criar agendamento.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancelAppointment(id) {
    setLoading(true)
    try {
      await cancelarAgendamento(id)
      await fetchAppointments()
      await fetchSlots()
    } catch (err) {
      alert(err.message || 'Erro ao cancelar agendamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar page={page} setPage={navigate} user={user} onLogout={handleLogout} />

      {loading && (
        <div style={{
          position: 'fixed', top: 60, left: 0, right: 0,
          background: '#1a3d2b', color: '#fff', textAlign: 'center',
          padding: '.4rem', fontSize: '.83rem', zIndex: 999,
        }}>
          ⏳ Aguarde...
        </div>
      )}

      {page === 'home'           && <HomePage setPage={navigate} />}
      {page === 'especialidades' && <SpecialidadesPage setPage={navigate} setSelectedSpec={setSelectedSpec} />}
      {page === 'exames'         && <ExamesPage setPage={navigate} setSelectedExam={setSelectedExam} />}

      {(page === 'login' || page === 'schedule') && (
        <LoginPage onSuccess={handleLoginSuccess} setPage={navigate} />
      )}
      {page === 'cadastro' && (
        <CadastroPage setPage={navigate} onSuccess={handleLoginSuccess} />
      )}
      {page === 'myappointments' && (
        <MyAppointments
          appointments={appointments}
          doctors={DOCTORS}
          setPage={navigate}
          setSelectedDoctor={setSelectedDoctor}
          onCancel={handleCancelAppointment}
        />
      )}
      {page === 'doctors' && (
        <DoctorsList setPage={navigate} setSelectedDoctor={setSelectedDoctor} selectedSpec={selectedSpec} />
      )}
      {page === 'booking' && (
        <BookingPage
          selectedDoctor={selectedDoctor}
          setPage={navigate}
          onAppointmentCreated={handleAppointmentCreated}
          bookedSlots={bookedSlots}
        />
      )}
      {page === 'exambooking' && (
        <ExameBookingPage
          selectedExam={selectedExam}
          setPage={navigate}
          onAppointmentCreated={handleAppointmentCreated}
          bookedSlots={bookedSlots}
        />
      )}
    </div>
  )
}

export default App
