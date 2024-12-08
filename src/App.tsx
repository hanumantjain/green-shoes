import { Routes, Route, useNavigate } from "react-router-dom"
import { Home } from "./UserPages/Home"
import { NotFound } from "./components/NotFound"
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
import Cart from "./UserPages/Cart"
import Profile from "./UserPages/Profile"
import AddAdmin from "./AdminComponents/AddAdmin"
import AddProducts from "./AdminPages/AddProducts"
import About from "./UserPages/About"
import Cateorgy from "./AdminPages/Cateorgy"
import Contact from "./UserPages/Contact"
import Address from "./UserComponents/Address"
import Orders from "./UserComponents/Orders"
import Payment from "./UserComponents/Payment"
import AddressList from "./UserComponents/AddressList"
import Checkout from "./UserPages/Checkout"


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
      <div>
          <Routes>
            {/* User Routes */}
            <Route path='/' element={<FirstPage />} />
            <Route path='/home' element={<Home />} />
            <Route path='/user1' element={<LandingPage />}/>
            <Route path='/userSignIn' element={<SignIn />}/>
            <Route path='/userSignUp' element={<UserSignUp />}/>
            <Route path='/userPassword' element={<UserPassword />}/>
            <Route path='/products' element={<Products />}/>
            <Route path='/products/:id' element={<ProductDetails />}/>
            <Route path='/cart' element={<Cart />}/>
            <Route path='/about' element={<About />}/>
            <Route path='/contact' element={<Contact />} />
            <Route path='/checkout' element={<Checkout />} />
            <Route path='/profile' element={<Profile />}>
              <Route path='address' element={<Address />}/>
              <Route path='orders' element={<Orders />}/>
              <Route path='payment' element={<Payment />}/>
              <Route path='add' element={<AddressList />}/>
            </Route>


            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin onLogin={handleAdminLogIn} />}/>
            <Route path="/adminHome" element={
              <AdminPrivateRoute isAuthencticated={isAdminAuthencticated}>
                <AdminHome onLogOut={handleAdminLogOut} />
              </AdminPrivateRoute>
            }/>
            <Route path="/addAdmin" element={
              <AdminPrivateRoute isAuthencticated={isAdminAuthencticated}>
                <AddAdmin />
              </AdminPrivateRoute>
            }/>
            <Route path="/addProducts" element={
              <AdminPrivateRoute isAuthencticated={isAdminAuthencticated}>
                <AddProducts onLogOut={handleAdminLogOut}/>
              </AdminPrivateRoute>
            }/>
            <Route path="/category" element={
              <AdminPrivateRoute isAuthencticated={isAdminAuthencticated}>
                <Cateorgy onLogOut={handleAdminLogOut}/>
              </AdminPrivateRoute>
            }/>

            
            <Route path='/*' element={<NotFound />}/>
          </Routes>
      </div>
  )
}

export default App
