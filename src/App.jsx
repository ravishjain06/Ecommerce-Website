import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthHeader from './pages/Auth UI/AuthHeader'
import Register from './pages/Auth UI/Register'
import Login from './pages/Auth UI/Login'
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={< AuthHeader/>}>
          <Route path="register" element={< Register/>} />
          <Route path="login" element={< Login/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
