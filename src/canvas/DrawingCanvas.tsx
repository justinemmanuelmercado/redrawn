import { RefObject, useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import { drawCheckerBoard } from "@/helpers/canvas-helpers";

export interface Point {
  x: number;
  y: number;
}

export function DrawingCanvas({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  const { canvasSettings, endPoint } = useStore((state) => state);
  const layers = useStore((state) => state.layers);
  const currentLayer = useStore((state) => state.currentLayer);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  // Drawing the checkerboard background
  useEffect(() => {
    const backgroundCanvas = bgCanvasRef.current;
    if (!backgroundCanvas) return;

    const dpi = window.devicePixelRatio;
    backgroundCanvas.width = canvasSettings.width * dpi;
    backgroundCanvas.height = canvasSettings.height * dpi;
    backgroundCanvas.style.width = canvasSettings.width + "px";
    backgroundCanvas.style.height = canvasSettings.height + "px";

    const backgroundCtx = backgroundCanvas.getContext("2d");
    if (!backgroundCtx) return;

    backgroundCtx.scale(dpi, dpi);

    drawCheckerBoard(
      backgroundCtx,
      10 * dpi,
      Math.ceil(backgroundCanvas.width / 20),
      Math.ceil(backgroundCanvas.height / 20)
    );
  }, [canvasSettings.height, canvasSettings.width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpi = window.devicePixelRatio;
    if (
      !ctx ||
      canvas.height !== canvasSettings.height * dpi ||
      canvas.width !== canvasSettings.width * dpi
    ) {
      canvas.height = canvasSettings.height * dpi;
      canvas.width = canvasSettings.width * dpi;
      canvas.style.width = canvasSettings.width + "px";
      canvas.style.height = canvasSettings.height + "px";
      const temp = canvas.getContext("2d");
      if (!temp) return;
      temp.scale(dpi, dpi);
      setCtx(temp);
    }

    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach((layer) => {
      layer.drawToCanvas(ctx);
    });

    if (currentLayer) {
      currentLayer.drawToCanvas(ctx);
    } 
  }, [
    currentLayer,
    layers,
    ctx,
    canvasSettings.height,
    canvasSettings.width,
    endPoint,
    canvasRef,
  ]);

  return (
    <div className="flex items-center justify-center p-10">
      <canvas
        className="top-0"
        style={{
          transform: `translateX(50%) scale(${canvasSettings.zoom / 100})`,
          transformOrigin: 'top left',
        }}
        ref={bgCanvasRef}
      ></canvas>
      <canvas
        className="top-0 z-10 border border-black"
        style={{
          transform: `translateX(-50%) scale(${canvasSettings.zoom / 100})`,
          transformOrigin: 'top left',
        }}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}
