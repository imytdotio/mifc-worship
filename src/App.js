import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { CreateUser } from "./Pages/CreateUser";
import { Home } from "./Pages/Home";

function App() {
  return (
    <div className="App m-auto pt-8">
      <h1 className="md:text-4xl md:font-bold text-2xl font-bold">
        🌊 FlowChurch Worship
      </h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/createuser" element={<CreateUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
