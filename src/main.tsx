import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'flowbite/dist/flowbite.min.js'
import 'react-toastify/dist/ReactToastify.css';
import "./i18n";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
