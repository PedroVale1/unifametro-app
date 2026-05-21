import { Modal, Button } from 'react-bootstrap'

interface Props {
  show: boolean
  onClose: () => void
  onConfirmar: () => void
  nomeMedico: string
  data: string
  hora: string
  loading?: boolean
  erro?: string
}

export default function ModalConfirmacao({
  show,
  onClose,
  onConfirmar,
  nomeMedico,
  data,
  hora,
  loading = false,
  erro,
}: Props) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header style={{ backgroundColor: '#1a4731' }} closeButton>
        <Modal.Title className="text-white fw-bold">Confirmar</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <p className="fw-semibold mb-3" style={{ color: '#374151' }}>
          Confirmar seu agendamento?
        </p>

        <div
          className="d-flex align-items-center gap-2 p-3 rounded mb-3"
          style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}
        >
          <input type="checkbox" checked readOnly style={{ accentColor: '#1a4731' }} />
          <div>
            <div className="fw-semibold" style={{ color: '#1a4731' }}>{nomeMedico}</div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {data} às {hora}
            </div>
          </div>
        </div>

        {erro && (
          <div className="alert alert-danger py-2 mb-0" style={{ fontSize: '13px' }}>
            {erro}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-danger"
          onClick={onClose}
          disabled={loading}
          className="fw-semibold"
        >
          CANCELAR
        </Button>
        <Button
          onClick={onConfirmar}
          disabled={loading}
          style={{ backgroundColor: '#1a4731', borderColor: '#1a4731' }}
          className="fw-semibold"
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Aguarde...
            </>
          ) : (
            'CONFIRMAR'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
