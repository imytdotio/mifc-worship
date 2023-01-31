import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import { Account } from "./Pages/Account";
import { Nav } from "./Componenets/Nav";
import { CreateUser } from "./Pages/CreateUser";
import { EditUser } from "./Pages/EditUser";
import { Home } from "./Pages/Home";
import { Login } from "./Pages/Login";
import { Availability } from "./Pages/Availability";
import { Test } from "./Pages/Test";

function App() {
  return (
    <div className="App m-auto pt-8 px-8">
      <BrowserRouter>
        <Link to="/" className="md:text-4xl md:font-bold text-2xl font-bold">
          🌊 Flow Church Worship
        </Link>
        <Nav />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Logged In */}
          <Route path="/account" element={<Account />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/edituser" element={<EditUser />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
