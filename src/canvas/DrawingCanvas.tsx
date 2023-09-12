import { RefObject, useEffect, useState } from "react";
import { useStore } from "@/store";
import { OverlayCanvas } from "./OverlayCanvas";
import { BackgroundCanvas } from "./BackgroundCanvas";

export interface Point {
  x: number;
  y: number;
}

export function DrawingCanvas({
  canvasRef,
}: {
  canvasRef: RefObject<HTMLCanvasElement>;
}) {
  const { canvasSettings, endPoint } = useStore((state) => state);
  const layers = useStore((state) => state.layers);
  const currentLayer = useStore((state) => state.currentLayer);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();

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
      <BackgroundCanvas></BackgroundCanvas>
      <canvas
        className="border border-black"
        style={{
          transform: `scale(${canvasSettings.zoom / 100})`,
          transformOrigin: "top left",
        }}
        ref={canvasRef}
      ></canvas>
      <OverlayCanvas></OverlayCanvas>
    </div>
  );
}
