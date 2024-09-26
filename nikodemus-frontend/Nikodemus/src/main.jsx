import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Header from './components/header'
import Footer from './components/footer'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

   
    <Header />
    <App />
    <Footer />
    </BrowserRouter>
  </StrictMode>,
)
