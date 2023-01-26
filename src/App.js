import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import { Account } from "./Componenets/Account";
import { Nav } from "./Componenets/Nav";
import { AuthContext, AuthProvider } from "./Context/AuthContext";
import { CreateUser } from "./Pages/CreateUser";
import { Home } from "./Pages/Home";

function App() {
  return (
    <div className="App m-auto pt-8 px-8">
      <BrowserRouter>
        <Link to="/" className="md:text-4xl md:font-bold text-2xl font-bold">
          🌊
        </Link>
        <Nav />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
