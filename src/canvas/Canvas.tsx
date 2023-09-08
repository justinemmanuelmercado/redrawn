import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import { drawCheckerBoard } from "@/helpers/canvas-helpers";

export interface Point {
  x: number;
  y: number;
}

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

  const { isDrawing, startDrawing, stopDrawing, updateCurrentLayer } = useStore(
    (state) => state
  );
  const layers = useStore((state) => state.layers);
  const currentLayer = useStore((state) => state.currentLayer);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

  useEffect(() => {
    const backgroundCanvas = bgCanvasRef.current;
    if (!backgroundCanvas) return;

    const dpi = window.devicePixelRatio;
    backgroundCanvas.width = 512 * dpi;
    backgroundCanvas.height = 512 * dpi;
    backgroundCanvas.style.width = "512px";
    backgroundCanvas.style.height = "512px";

    const backgroundCtx = backgroundCanvas.getContext("2d");
    if (!backgroundCtx) return;

    backgroundCtx.scale(dpi, dpi);

    drawCheckerBoard(
      backgroundCtx,
      10 * dpi,
      Math.ceil(backgroundCanvas.width / 20),
      Math.ceil(backgroundCanvas.height / 20)
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpi = window.devicePixelRatio;
    if (!ctx) {
      canvas.width = 512 * dpi;
      canvas.height = 512 * dpi;
      canvas.style.width = "512px";
      canvas.style.height = "512px";
      const temp = canvas.getContext("2d");
      if (!temp) return;
      temp.scale(dpi, dpi);
      setCtx(temp);
    }

    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    layers.forEach((layer) => {
      layer.drawToCanvas(ctx);
    });

    if (currentLayer) {
      currentLayer.drawToCanvas(ctx);
    }
  }, [currentLayer, layers, ctx]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    startDrawing({ x, y });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    stopDrawing({ x, y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      updateCurrentLayer({ x, y });
    }
  };
  return (
    <div className="flex items-center justify-center">
      <canvas
        className="absolute"
        ref={bgCanvasRef}
      ></canvas>
      <canvas
        className='z-10'
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={isDrawing ? handleMouseUp : undefined}
        onMouseMove={isDrawing ? handleMouseMove : undefined}
      ></canvas>
    </div>
  );
}
