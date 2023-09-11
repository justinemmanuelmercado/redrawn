import "./App.css";
import { Canvas } from "./canvas/Canvas";
import { LayerOptions } from "./layer-options/LayerOptions";
import { Layers } from "./layers/Layers";
import { Toolbar } from "./toolbar/Toolbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App grid grid-cols-12 h-screen">
        <div className="col-span-1">
          <Toolbar />
        </div>
        <div className="col-span-8 flex flex-col items-center justify-center overflow-auto">
          <Canvas />
        </div>
        <div className="col-span-3 max-h-screen">
          <Layers />
          <LayerOptions />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
