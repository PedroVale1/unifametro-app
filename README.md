# 🏥 Clínica Integrada de Saúde Unifametro

Projeto React para apresentação acadêmica — sistema de agendamento de consultas.

---

## ▶️ Como rodar o projeto

### Passo 1 — Verificar se o Node.js está instalado

Abra o terminal (CMD ou PowerShell no Windows) e digite:

```
node -v
```

Se aparecer um número como `v18.0.0`, está ok. Se não, baixe em: https://nodejs.org

---

### Passo 2 — Entrar na pasta do projeto

```
cd unifametro-app
```

---

### Passo 3 — Instalar as dependências (só na primeira vez)

```
npm install
```

Aguarde alguns minutos enquanto baixa os pacotes.

---

### Passo 4 — Rodar o projeto

```
npm run dev
```

Vai aparecer algo como:

```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
```

Abra o navegador e acesse: **http://localhost:5173**

---

## 📱 Telas do sistema

| Tela               | Descrição                                  |
|--------------------|--------------------------------------------|
| Landing Page       | Página inicial com especialidades          |
| Login              | Identificação do aluno ou cliente          |
| Minhas Consultas   | Lista de consultas agendadas               |
| Lista de Médicos   | Médicos disponíveis por especialidade      |
| Agendar Consulta   | Calendário + seleção de horário            |
| Confirmação        | Modal confirmando o agendamento            |
| Sucesso            | Modal de agendamento realizado             |

---

## 🗂️ Estrutura de arquivos

```
unifametro-app/
├── index.html          ← Arquivo HTML principal
├── package.json        ← Configuração do projeto
├── vite.config.js      ← Configuração do Vite
└── src/
    ├── main.jsx        ← Ponto de entrada do React
    ├── App.jsx         ← Componente principal + navegação
    ├── App.css         ← Estilos globais
    ├── data.js         ← Dados fictícios (mock data)
    └── components/
        ├── Navbar.jsx          ← Barra de navegação
        ├── HomePage.jsx        ← Tela inicial
        ├── LoginPage.jsx       ← Tela de login
        ├── MyAppointments.jsx  ← Minhas consultas
        ├── DoctorsList.jsx     ← Lista de médicos
        └── BookingPage.jsx     ← Tela de agendamento
```

---

## 💡 Para a apresentação

- Use **qualquer CPF e senha** na tela de login
- Clique em "Agendar atendimento" na página inicial
- Selecione um médico → escolha data e horário → confirme
- O agendamento aparece em "Minhas Consultas"

---

Feito com ❤️ usando React + Vite
