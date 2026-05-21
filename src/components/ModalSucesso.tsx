import { Modal, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

interface Props {
  show: boolean
  onClose: () => void
}

export default function ModalSucesso({ show, onClose }: Props) {
  const navigate = useNavigate()

  const handleFechar = () => {
    onClose()
    navigate('/minhas-consultas')
  }

  return (
    <Modal show={show} onHide={handleFechar} centered>
      <Modal.Header style={{ backgroundColor: '#1a4731' }}>
        <Modal.Title className="text-white fw-bold">Sucesso</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 text-center">
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
        <p className="fw-semibold" style={{ color: '#374151', fontSize: '16px' }}>
          Seu agendamento foi realizado com sucesso!
        </p>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Você pode acompanhar e gerenciar suas consultas em "Minhas Consultas".
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button
          onClick={handleFechar}
          style={{ backgroundColor: '#1a4731', borderColor: '#1a4731' }}
          className="fw-semibold px-4"
        >
          <span className="me-2">✕</span>
          Fechar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
