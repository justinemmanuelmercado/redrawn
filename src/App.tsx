import "./App.css";
import { Canvas } from "./canvas/Canvas";
import { Layers } from "./layers/Layers";
import { ScribblePrompt } from "./prompt-tool/ScribblePrompt";
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
        <div className="col-span-8 bg-white flex flex-col items-center justify-center overflow-auto">
            <ScribblePrompt />
            <Canvas />
        </div>
        <div className="col-span-3 bg-slate-100 max-h-screen">
          <Layers />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
