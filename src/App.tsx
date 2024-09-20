import { BrowserRouter, Routes, Route, useActionData } from "react-router-dom";
import { Home } from "./UserPages/Home";
import { NotFound } from "./components/NotFound";
import { Contact } from "./UserPages/Contact";
import { AdminLogin } from "./AdminPages/AdminLogin";
import { useState } from "react";


function App() {
  const [isAuthencticated , setIsAuthenticated] = useState<boolean>()
  
  const handleLogIn = () => {

  }
  return (
    <div>
      <BrowserRouter>
        <Routes>

          {/* User Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin onLogin={handleLogIn} />}/>

          <Route path='/*' element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
