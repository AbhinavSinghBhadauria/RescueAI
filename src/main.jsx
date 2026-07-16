import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider } from './context/AppContext.jsx'
import { ModelProvider } from './context/ModelContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ModelProvider>
          <App />
          <ToastContainer
            position="top-right"
            theme="dark"
            toastClassName="glass !bg-white/10 !rounded-2xl !text-white font-body"
            autoClose={3200}
          />
        </ModelProvider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
