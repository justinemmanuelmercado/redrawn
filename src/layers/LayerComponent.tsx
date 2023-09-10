import { drawCheckerBoard } from "@/helpers/canvas-helpers";
import { Layer } from "@/lib/layers/Layer";
import { useStore } from "@/store";
import { useRef, useState, useEffect } from "react";

export const LayerComponent = ({
  layer,
  layerKey,
}: {
  layer: Layer;
  layerKey: string;
}) => {
  const previewCanvas = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const previewSide = 50;
  const toggleLayer = useStore((state) => state.toggleLayer);
  const selectedLayers = useStore((state) => state.selectedLayers);
  const canvasDimensions = useStore((state) => state.canvasDimensions);
  const isSelected = selectedLayers.includes(layerKey);
  const deleteLayer = useStore((state) => state.deleteLayer);

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
    const scale = previewSide / canvasDimensions.width;
    const checkBoardSize = 2 * dpi;
    drawCheckerBoard(
      ctx,
      checkBoardSize,
      previewSide * checkBoardSize,
      previewSide * checkBoardSize
    );
    layer.drawToCanvas(ctx, scale);
  }, [layer, ctx, canvasDimensions.width]);

  const handleClick = () => {
    toggleLayer(layerKey);
  };

  const handleDelete = () => {
    deleteLayer(layerKey);
  }

  return (
    <button
      onClick={() => handleClick()}
      className={`${
        isSelected ? "bg-gray-200" : "bg-gray-100"
      } flex items-center gap-2 border border-gray-300 shadow-sm`}
    >
      <div className='flex-shrink-0'>
        <canvas ref={previewCanvas}></canvas>
      </div>
      <div className='flex justify-between flex-grow items-center text-gray-600'>
        <p>{layer.name}</p>
        <button className="p-2 flex justify-center items-center gap-2" onClick={() => handleDelete()}>
          <img className="w-4" src="/icons/trash.svg" alt="Trash icon" />
        </button>
      </div>
    </button>
  );
};
