import { Routes, Route, useNavigate } from "react-router-dom"
import { Home } from "./UserPages/Home"
import { NotFound } from "./components/NotFound"
import { Contact } from "./UserPages/Contact"
import { AdminLogin } from "./AdminPages/AdminLogin"
import { useState , useEffect } from "react"
import AdminHome from "./AdminPages/AdminHome"
import { AdminPrivateRoute } from "./AdminComponents/AdminPrivateRoute"
import { LandingPage } from "./UserPages/LandingPage"
import { SignIn } from "./UserPages/SignIn"
import UserSignUp from "./UserPages/UserSignUp"
import { UserPassword } from "./UserPages/UserPassword"
import FirstPage from "./UserPages/FirstPage"
import Products from "./UserPages/Products"
import ProductDetails from "./UserPages/ProductDetails"
import { AuthProvider } from "./components/UserAuthContext"
import Cart from "./UserPages/Cart"


const App: React.FC = () => {
  const [isAdminAuthencticated , setIsAdminAuthenticated] = useState<boolean>(
    sessionStorage.getItem('isAdminAuthenticated') === 'true'
  )
  const navigate = useNavigate()

  useEffect(() => {
    sessionStorage.setItem('isAdminAuthenticated', String(isAdminAuthencticated))
  }, [isAdminAuthencticated])

  const handleAdminLogIn = (authStatus: boolean) => {
    setIsAdminAuthenticated(authStatus)
    if (authStatus) {
      navigate('/adminHome')
    }
  }

  // Handler for admin logout
  const handleAdminLogOut = () => {
    setIsAdminAuthenticated(false)
    sessionStorage.removeItem('isAdminAuthenticated')
    navigate('/admin')
  }

  return (
    <AuthProvider>
      <div>
          <Routes>

            {/* User Routes */}
            <Route path='/' element={<FirstPage />} />
            <Route path='/home' element={<Home />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/user1' element={<LandingPage />}/>
            <Route path='/userSignIn' element={<SignIn />}/>
            <Route path='/userSignUp' element={<UserSignUp />}/>
            <Route path='/userPassword' element={<UserPassword />}/>
            <Route path='/products' element={<Products />}/>
            <Route path='/products/:id' element={<ProductDetails />}/>
            <Route path='/cart' element={<Cart />}/>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin onLogin={handleAdminLogIn} />}/>
            <Route path="/adminHome" element={
              <AdminPrivateRoute isAuthencticated={isAdminAuthencticated}>
                <AdminHome onLogOut={handleAdminLogOut} />
              </AdminPrivateRoute>
            }/>


            <Route path='/*' element={<NotFound />}/>
          </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
