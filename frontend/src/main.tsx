import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { AuthProvider } from './context/AuthContext'
import './styles/global.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('Elemento #root não encontrado no documento.')
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)

