import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthHeader from './pages/Auth UI/AuthHeader'
import Register from './pages/Auth UI/Register'
import Login from './pages/Auth UI/Login'
import "./App.css"
import ResetPassword from './pages/Auth UI/ResetPassword'
import CreateNewPassword from './pages/Auth UI/CreateNewPassword'
import Verification from './pages/Auth UI/Verification'

import Home from './pages/Home/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={< AuthHeader />}>
          <Route path="register" element={< Register />} />
          <Route path="login" element={< Login />} />
          <Route path="reset-password" element={< ResetPassword />} />
          <Route path="create-new-password" element={< CreateNewPassword />} />
          <Route path="verify-code" element={< Verification />} />
        </Route>

        <Route path="/" element={< Home />}>

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
