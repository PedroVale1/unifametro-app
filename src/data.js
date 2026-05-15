// ─── Dados fictícios (mock data) ──────────────────────────────────────────

export const SPECIALTIES = [
  { id: 1, label: 'ENFERMAGEM - Estomaterapia',                    short: 'Enfermagem'   },
  { id: 2, label: 'PSICOLOGIA - Psicoterapia individual',          short: 'Psicologia'   },
  { id: 3, label: 'NUTRIÇÃO - Atendimento nutricional',            short: 'Nutrição'     },
  { id: 4, label: 'FISIOTERAPIA - Fisioterapia em Neurofuncional', short: 'Fisioterapia' },
  { id: 5, label: 'FARMÁCIA - Acompanhamento farmacoterapêutico',  short: 'Farmácia'     },
]

// specialtyId vincula o médico à especialidade
export const DOCTORS = [
  // Enfermagem (1)
  { id: 1,  name: 'Dr. Carlos Lima',      specialty: 'Enfermeiro Estomaterapeuta', crm: 'COREN 11111', slots: 10, emoji: '👨‍⚕️', specialtyId: 1 },
  { id: 2,  name: 'Dra. Ana Ferreira',    specialty: 'Enfermeira Estomaterapeuta', crm: 'COREN 22222', slots: 8,  emoji: '👩‍⚕️', specialtyId: 1 },
  // Psicologia (2)
  { id: 3,  name: 'Dra. Beatriz Santos',  specialty: 'Psicóloga Clínica',          crm: 'CRP 33333',   slots: 9,  emoji: '👩‍⚕️', specialtyId: 2 },
  { id: 4,  name: 'Dr. Marcos Oliveira',  specialty: 'Psicólogo Clínico',          crm: 'CRP 44444',   slots: 11, emoji: '👨‍⚕️', specialtyId: 2 },
  // Nutrição (3)
  { id: 5,  name: 'Dr. Daniel Sousa',     specialty: 'Médico Nutrólogo',           crm: 'CRM 123456',  slots: 9,  emoji: '👨‍⚕️', specialtyId: 3 },
  { id: 6,  name: 'Dra. Luíza Castro',    specialty: 'Nutricionista',              crm: 'CRN 789012',  slots: 12, emoji: '👩‍⚕️', specialtyId: 3 },
  // Fisioterapia (4)
  { id: 7,  name: 'Dr. Rafael Costa',     specialty: 'Fisioterapeuta Neuro',       crm: 'CREFITO 55555', slots: 10, emoji: '👨‍⚕️', specialtyId: 4 },
  { id: 8,  name: 'Dra. Paula Mendes',    specialty: 'Fisioterapeuta',             crm: 'CREFITO 66666', slots: 8,  emoji: '👩‍⚕️', specialtyId: 4 },
  // Farmácia (5)
  { id: 9,  name: 'Dra. Carla Rocha',     specialty: 'Farmacêutica Clínica',      crm: 'CRF 77777',   slots: 7,  emoji: '👩‍⚕️', specialtyId: 5 },
  { id: 10, name: 'Dr. Bruno Alves',      specialty: 'Farmacêutico',              crm: 'CRF 88888',   slots: 9,  emoji: '👨‍⚕️', specialtyId: 5 },
]

export const TIMES = [
  '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30',
]

export const INITIAL_APPOINTMENTS = []
