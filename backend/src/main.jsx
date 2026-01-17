import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { logSystemInfo } from './lib/logger'

// Initialiser le système de logging
logSystemInfo()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
