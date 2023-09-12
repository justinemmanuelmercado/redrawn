import { MouseEventHandler, useRef } from "react";
import { DrawingCanvas } from "./DrawingCanvas";
import { CanvasSettings } from "./canvas-settings/CanvasSettings";
import { ScribblePrompt } from "./prompt-tool/ScribblePrompt";
import { useStore } from "@/store";
import { getPointsForAIFromCanvasRect } from "@/helpers/canvas-helpers";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    isMouseDown,
    startDrawing,
    stopDrawing,
    updateCurrentLayer,
    mode,
    currentAISelection,
    setCurrentAISelection,
    startAISelection,
    stopAISelection,
  } = useStore((state) => state);

  const handleGlobalMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isMouseDown) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (mode === "ai") {
        if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
          setCurrentAISelection(
            getPointsForAIFromCanvasRect(currentAISelection, x, y, rect)
          );
        }
      } else {
        updateCurrentLayer({ x, y });
      }
    }
  };

  const handleGlobalMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isMouseDown) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (mode === "ai") {
        stopAISelection();
        if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
          setCurrentAISelection(
            getPointsForAIFromCanvasRect(currentAISelection, x, y, rect)
          );
        }
      } else {
        stopDrawing({ x, y });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "ai") {
      startAISelection();
      if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
        setCurrentAISelection(
          getPointsForAIFromCanvasRect(currentAISelection, x, y, rect)
        );
      }
    } else {
      startDrawing({ x, y });
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col gap-2 items-center overflow-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
    >
      <ScribblePrompt></ScribblePrompt>
      <CanvasSettings></CanvasSettings>
      <DrawingCanvas canvasRef={canvasRef}></DrawingCanvas>
    </div>
  );
};
