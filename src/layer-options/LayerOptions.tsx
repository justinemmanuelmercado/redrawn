import { useStore } from "@/store";

export const LayerOptions = () => {
  const currentLayer = useStore((state) => state.currentLayer);

  return (
    <div className="h-1/2 p-2">
      <div className="h-full border-slate-400 border flex flex-col z-40 bg-gray-100 rounded-md">
        <div className="w-full flex-shrink-0 flex justify-between items-center p-2">
          <h1 className="text-lg text-gray-500">Layer Options</h1>
        </div>

        <div className="flex-grow overflow-scroll">
          <div className="flex flex-col gap-1 p-2">
            {currentLayer === null && (
              <p className="text-center text-gray-500 p-8">Select a layer...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
