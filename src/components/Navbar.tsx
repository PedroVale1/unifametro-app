import { useState } from 'react'
import { Navbar as BsNavbar, Nav, Container, Dropdown } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import type { Usuario } from '../types'
import logoUnifametro from '../assets/images/logo-unifametro.webp'

export default function Navbar() {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)

  const usuarioStr = localStorage.getItem('unifametro_usuario')
  const usuario: Usuario | null = usuarioStr ? JSON.parse(usuarioStr) : null

  const handleLogout = () => {
    localStorage.removeItem('unifametro_token')
    localStorage.removeItem('unifametro_usuario')
    localStorage.removeItem('unifametro_agendamentos')
    navigate('/')
  }

  return (
    <BsNavbar
      expand="lg"
      style={{ backgroundColor: '#0f2d1f', minHeight: '90px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      variant="dark"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container fluid className="px-4">
        <BsNavbar.Brand as={Link} to="/" style={{ padding: 0, margin: 0 }}>
          <img src={logoUnifametro} alt="Unifametro" className="navbar-logo" />
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="navbar-nav" />

        <BsNavbar.Collapse id="navbar-nav">
          <Nav className="mx-auto gap-3">
            {usuario ? (
              <Nav.Link as={Link} to="/minhas-consultas" className="text-white fw-medium">
                Minhas Consultas
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/agendamento" className="text-white fw-medium">
                Agendamento
              </Nav.Link>
            )}
            <Nav.Link href="#sobre" onClick={() => navigate('/sobre-nos')} className="text-white fw-medium">
              Sobre nós
            </Nav.Link>
            <Nav.Link as={Link} to="/especialidades" className="text-white fw-medium">
              Especialidades
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {usuario ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="outline-light"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                  {usuario.nome.split(' ')[0]}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/minhas-consultas">
                    Minhas Consultas
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    Sair
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <button
                className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                onClick={() => navigate('/agendamento')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                Acesse sua conta
              </button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
