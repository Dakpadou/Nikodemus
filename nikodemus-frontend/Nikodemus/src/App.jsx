import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import formation from './components/formation'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <formation/>
      </div>
    </>
  )
}

export default App
