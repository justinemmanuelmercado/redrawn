import "./App.css";
import { Canvas } from "./canvas/Canvas";
import { Layers } from './layers/Layers';
import { Toolbar } from './toolbar/Toolbar';

function App() {
  return (
    <>
      <div className="App grid grid-cols-12 h-screen">
        {/* Toolbar on the left */}
        <div className="col-span-1 bg-gray-200">
          <Toolbar />
        </div>

        {/* Canvas in the middle */}
        <div className="col-span-8 bg-white flex justify-center items-center">
          <Canvas />
        </div>

        {/* Layers on the right */}
        <div className="col-span-3 bg-gray-100">
          <Layers />
        </div>
      </div>
    </>
  );
}

export default App;
