import { drawCheckerBoard } from "@/helpers/canvas-helpers";
import { Layer } from "@/lib/layers/Layer";
import { useStore } from "@/store";
import { useEffect, useRef, useState } from "react";

export const Layers = () => {
  const layers = useStore((state) => state.layers);

  return (
    <div className="h-1/2 border-slate-400 border m-2 flex flex-col">
      <h1 className="text-lg font-bold w-full bg-slate-300 p-2 flex-shrink-0">Layers</h1>
      <div className="bg-gray-200 flex-grow overflow-scroll">
        <div className="p-2 flex flex-col gap-2">
          {layers.map((layer, i) => (
            <LayerComponent key={i} layer={layer} />
          ))}
        </div>
      </div>
    </div>
  );
};

const LayerComponent = ({ layer }: { layer: Layer }) => {
  const previewCanvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const previewSide = 50;

  useEffect(() => {
    if (!previewCanvas.current) return;
    const dpi = window.devicePixelRatio;
    const canvas = previewCanvas.current;
    canvas.width = previewSide * dpi;
    canvas.height = previewSide * dpi;
    canvas.style.width = previewSide + "px";
    canvas.style.height = previewSide + "px";
    const temp = canvas.getContext("2d");
    if (!temp) return;
    temp.scale(dpi, dpi);
    setCtx(temp);

    if (!ctx) return;

    ctx.clearRect(0, 0, previewSide, previewSide);
    const scale = previewSide / 512;
    const checkBoardSize = 2 * dpi;
    drawCheckerBoard(
      ctx,
      checkBoardSize,
      previewSide * checkBoardSize,
      previewSide * checkBoardSize
    );
    layer.drawToCanvas(ctx, scale);
  }, [layer, ctx]);

  return (
    <div className="bg-gray-100 border-gray-900 border p-2 flex items-center shadow-md gap-4">
      <div className="border border-slate-400">
        <canvas ref={previewCanvas}></canvas>
      </div>
      <p className="font-semibold">{layer.name}</p>
    </div>
  );
};
