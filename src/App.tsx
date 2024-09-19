import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./UserPages/Home";
import { NotFound } from "./components/NotFound";


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/*' element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
