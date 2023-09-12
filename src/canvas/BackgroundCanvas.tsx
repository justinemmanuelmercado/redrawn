import { drawCheckerBoard } from "@/helpers/canvas-helpers";
import { useStore } from "@/store";
import { useEffect, useRef } from "react";

export const BackgroundCanvas = () => {
  const { canvasSettings } = useStore((state) => state);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <canvas
      style={{
        transform: `translateX(100%) scale(${canvasSettings.zoom / 100})`,
        transformOrigin: "top left",
      }}
      ref={bgCanvasRef}
    ></canvas>
  );
};
