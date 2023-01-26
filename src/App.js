import "./App.css";
import { Auth } from "./Componenets/Auth";

function App() {
  return (
    <div className="App m-auto pt-8">
      <h1 className="md:text-4xl md:font-bold text-2xl font-bold">
        🌊 FlowChurch Worship
      </h1>
      <Auth />
    </div>
  );
}

export default App;
