import { Routes, Route, useNavigate } from "react-router-dom"
import { Home } from "./UserPages/Home"
import { NotFound } from "./components/NotFound"
import { Contact } from "./UserPages/Contact"
import { AdminLogin } from "./AdminPages/AdminLogin"
import { useState , useEffect } from "react"
import AdminHome from "./AdminPages/AdminHome"
import { AdminPrivateRoute } from "./AdminComponents/AdminPrivateRoute"
import { LandingPage } from "./UserPages/LandingPage"


const App: React.FC = () => {
  const [isAuthencticated , setIsAuthenticated] = useState<boolean>(
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  )
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.setItem('isAdminAuthenticated', String(isAuthencticated))
  }, [isAuthencticated])

  const handleAdminLogIn = (authStatus: boolean) => {
    setIsAuthenticated(authStatus)
    if (authStatus) {
      navigate('/adminHome')
    }
  }

  // Handler for admin logout
  const handleAdminLogOut = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('isAdminAuthenticated')
    navigate('/admin')
  }

  return (
    <div>
        <Routes>

          {/* User Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/shop' element={<LandingPage/>}/>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin onLogin={handleAdminLogIn} />}/>
          <Route path="/adminHome" element={
            <AdminPrivateRoute isAuthencticated={isAuthencticated}>
              <AdminHome onLogOut={handleAdminLogOut} />
            </AdminPrivateRoute>
          }/>


          <Route path='/*' element={<NotFound />}/>
        </Routes>
    </div>
  );
}

export default App;
