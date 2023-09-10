import { useStore } from "@/store";
import { LayerComponent } from "./LayerComponent";

export const Layers = () => {
  const layers = useStore((state) => state.layers);

  return (
    <div className="h-1/2 border-slate-400 border m-2 flex flex-col z-40 bg-gray-100">
      <div className='w-full flex-shrink-0 flex justify-between items-center p-2'>
        <h1 className="text-lg text-gray-500">
          Layers
        </h1>
      </div>
      <div className="flex-grow overflow-scroll">
        <div className="flex flex-col gap-1 p-2">
          {layers.size === 0 && (
            <p className="text-center text-gray-500 p-8">No layers</p>
          )}
          {Array.from(layers.entries()).map(([key, layer]) => (
            <LayerComponent key={key} layer={layer} layerKey={key} />
          ))}
        </div>
      </div>
    </div>
  );
};
