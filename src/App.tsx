import "./App.css";
import { Canvas } from "./canvas/Canvas";
import { Layers } from "./layers/Layers";
import { ScribblePrompt } from './prompt-tool/ScribblePrompt';
import { Toolbar } from "./toolbar/Toolbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App grid grid-cols-12 h-screen">
        {/* Toolbar on the left */}
        <div className="col-span-1 bg-gray-200">
          <Toolbar />
        </div>

        {/* Canvas in the middle */}
        <div className="col-span-8 bg-white flex flex-col items-center">
          <ScribblePrompt />
          <Canvas />
        </div>

        {/* Layers on the right */}
        <div className="col-span-3 bg-gray-100">
          <Layers />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
