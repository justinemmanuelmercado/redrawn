import { drawMarchingAnts } from '@/helpers/canvas-helpers';
import { useStore } from "@/store";
import { useRef, useCallback, useEffect } from "react";

let offset = 0;

export const OverlayCanvas = () => {
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const { mode, currentAISelection, canvasSettings } = useStore(
    (state) => state
  );

  useEffect(() => {
    const overlayCanvas = overlayCanvasRef.current;
    if (!overlayCanvas) return;

    const dpi = window.devicePixelRatio;
    overlayCanvas.width = canvasSettings.width * dpi;
    overlayCanvas.height = canvasSettings.height * dpi;
    overlayCanvas.style.width = canvasSettings.width + "px";
    overlayCanvas.style.height = canvasSettings.height + "px";

    const backgroundCtx = overlayCanvas.getContext("2d");
    if (!backgroundCtx) return;

    backgroundCtx.scale(dpi, dpi);
  }, [canvasSettings.height, canvasSettings.width]);

  useEffect(() => {
    const overlayCtx = overlayCanvasRef.current?.getContext("2d");
    if (!overlayCtx) return;

    overlayCtx.clearRect(
      0,
      0,
      overlayCtx.canvas.width,
      overlayCtx.canvas.height
    );
  }, [mode]);

  const drawSelectionBox = useCallback(() => {
    const overlayCtx = overlayCanvasRef.current?.getContext("2d");
  
    if (!overlayCtx) return;
  
    // Clear previous drawings
    overlayCtx.clearRect(
      0,
      0,
      overlayCtx.canvas.width,
      overlayCtx.canvas.height
    );
  
    if (mode !== "ai") return;
    const [topLeft, bottomRight] = currentAISelection;
  
    // Call the new drawMarchingAnts function
    drawMarchingAnts(
      overlayCtx,
      topLeft.x,
      topLeft.y,
      bottomRight.x,
      bottomRight.y,
      offset
    );
  
    // Increment the offset for the next frame
    offset -= 1;
  }, [currentAISelection, mode]);
  useEffect(() => {
    let animationFrameId: number;

    const loop = () => {
      drawSelectionBox();
      animationFrameId = requestAnimationFrame(loop);
    };

    // Start the loop
    if (mode === "ai") {
      loop();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [drawSelectionBox, mode]);
  return (
    <canvas
      ref={overlayCanvasRef}
      style={{
        transform: `translateX(-100%) scale(${canvasSettings.zoom / 100})`,
        transformOrigin: "top left",
      }}
    ></canvas>
  );
};
