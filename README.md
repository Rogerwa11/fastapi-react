# fastapi-react

Aplicação full-stack mono-repo desenvolvida como projeto pessoal de estudos, combinando **FastAPI** no backend e **React + Vite** no frontend. O objetivo é praticar autenticação JWT, boas práticas de organização em camadas e um fluxo moderno de interface com Tailwind CSS e validação com Zod.

## ✨ Funcionalidades

- Registro e login de usuários com **JWT** e expiração configurável.
- Persistência simplificada em arquivo JSON para facilitar testes locais.
- Hash de senhas seguro com **passlib** (`bcrypt_sha256`).
- Fluxo de autenticação completo com proteção de rotas e estado global no frontend.
- Formulários com validação reativa usando **Zod**.
- Estilização responsiva com **Tailwind CSS**.

## 🧱 Tecnologias & Técnicas

### Backend
- **FastAPI** com roteamento modular e `APIRouter`.
- **pydantic-settings** para centralizar configurações.
- **python-jose** para criação/validação de tokens JWT.
- **passlib** (`CryptContext`) para hashing de senhas.
- Serviços e camadas (`database`, `models`, `schemas`, `services`, `routes`) separadas para manter o domínio organizado.
- Cobertura de testes com **pytest** e `TestClient`.

### Frontend
- **React 18** com **TypeScript** e bundler **Vite**.
- **React Router v7** para rotas públicas e protegidas.
- **Tailwind CSS** como base de estilos utilitários.
- **Zod** + hooks customizados para validação e feedbacks de formulário.
- **Axios** configurado com interceptors para manipular tokens JWT.
- Context API (`AuthContext`) para controle de sessão, login automático e refresh.

### Outras práticas
- Scripts unificados via **concurrently** para subir backend e frontend com um único comando.
- Estrutura de diretórios espelhada (`backend/` e `frontend/`) para facilitar manutenção.

## 📁 Estrutura resumida

```
.
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   └── tests/
│       └── test_auth.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── validation/
│   └── tailwind.config.js
└── package.json (scripts para rodar os dois lados)
```

## 🚀 Como executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- `pip`, `npm`

### 1. Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Rodar tudo com um único comando
Na raiz do projeto há um `package.json` com um script que utiliza **concurrently**:
```bash
npm install      # instala apenas o concurrently listado na raiz
npm run dev      # executa uvicorn e o Vite em paralelo
```

## 🔐 Variáveis de ambiente

### Backend (`backend/.env`)
```
SECRET_KEY=chave-super-secreta
```

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://127.0.0.1:8000
```

## 🧪 Testes

- Backend (pytest):
  ```bash
  cd backend
  pytest
  ```
- O frontend pode ser testado manualmente acessando `http://localhost:5173` após `npm run dev`.

## 🗺️ Rotas principais

- `POST /auth/register` – cria usuário.
- `POST /auth/login` – retorna token JWT (JSON).
- `GET /auth/me` – informações do usuário autenticado.
- Frontend:
  - `/login` – entrada de usuário.
  - `/register` – cadastro.
  - `/dashboard` – rota protegida, exibe dados do perfil.

## 📌 Observações

- Persistência atual é baseada em arquivo JSON para simplificar o aprendizado; em produção, substituir por um banco real.
- O código foi organizado para facilitar substituições futuras (por exemplo, adicionar refresh tokens ou integrações com bancos).
- Sinta-se à vontade para forkar e experimentar novas features.

---

Projeto criado para aprendizado pessoal. Feedbacks e sugestões são sempre bem-vindos!
