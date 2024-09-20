import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Formation from './components/formation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
    
        <p>ta mere le code</p>
        <Formation/>
        </div>
    </>
  )
}

export default App
