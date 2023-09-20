import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { DrawingCanvas } from "./DrawingCanvas";
import { CanvasSettings } from "./canvas-settings/CanvasSettings";
import { ScribblePrompt } from "./prompt-tool/ScribblePrompt";
import { useStore } from "@/store";
import {
  calculateNewDragPosition,
  getPointsForAIFromCanvasRect,
} from "@/helpers/canvas-helpers";
import { modeCursorMap, modes } from "@/lib/tools/tools";

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
    toggleIsMouseDown,
    canvasSettings,
    updateCanvasSettings,
    setStartPoint,
    startPoint,
    setCurrentSelectedLayerForReposition,
    repositionLayer,
  } = useStore((state) => state);
  const [cursor, setCursor] = useState<string>("default");

  const handleGlobalMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isMouseDown) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      // This is for the canvas only
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // This is for the whole background of the canvas
      const newStarting = {
        x: e.clientX - canvasSettings.offsetX,
        y: e.clientY - canvasSettings.offsetY,
      };
      switch (mode) {
        case modes.ai:
          if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
            console.log(x, y)
            setCurrentAISelection(
              getPointsForAIFromCanvasRect(currentAISelection, x, y, rect)
            );
          }
          break;
        case modes.drag:
          updateCanvasSettings(
            calculateNewDragPosition(
              startPoint ?? newStarting,
              e.clientX,
              e.clientY
            )
          );
          break;
        case modes.cursor:
          repositionLayer({ x, y });
          break;
        default:
          updateCurrentLayer({ x, y });
          break;
      }
    }
  };

  const handleGlobalMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isMouseDown) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      toggleIsMouseDown(false);
      switch (mode) {
        case modes.ai:
          if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
            setCurrentAISelection(
              getPointsForAIFromCanvasRect(currentAISelection, x, y, rect)
            );
          }
          break;
        case modes.drag:
          break;
        case modes.cursor:
          break;
        default:
          stopDrawing({ x, y });
          break;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const start = {
      x: e.clientX - canvasSettings.offsetX,
      y: e.clientY - canvasSettings.offsetY,
    };

    toggleIsMouseDown(true);
    switch (mode) {
      case modes.ai:
        if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
          setCurrentAISelection(
            getPointsForAIFromCanvasRect(currentAISelection, x, y, rect)
          );
        }
        break;
      case modes.drag:
        setStartPoint(start);
        break;
      case modes.cursor:
        setStartPoint({ x, y });
        setCurrentSelectedLayerForReposition({ x, y });
        break;
      default:
        startDrawing({ x, y });
        break;
    }
  };

  useEffect(() => {
    modeCursorMap[mode] && setCursor(modeCursorMap[mode]);
  }, [mode]);

  return (
    <div
      className="w-full h-full flex flex-col gap-2 items-center overflow-hidden bg-slate-200"
      onMouseDown={handleMouseDown}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
    >
      <ScribblePrompt></ScribblePrompt>
      <CanvasSettings></CanvasSettings>
      <div
        style={{
          cursor,
        }}
      >
        <DrawingCanvas canvasRef={canvasRef}></DrawingCanvas>
      </div>
    </div>
  );
};
