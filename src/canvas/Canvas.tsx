import { MouseEventHandler, useRef, useState } from "react";
import { DrawingCanvas, Point } from "./DrawingCanvas";
import { CanvasSettings } from "./canvas-settings/CanvasSettings";
import { ScribblePrompt } from "./prompt-tool/ScribblePrompt";
import { useStore } from "@/store";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDrawing, startDrawing, stopDrawing, updateCurrentLayer, mode } =
    useStore((state) => state);
  const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);

  const handleGlobalMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isDrawing) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      updateCurrentLayer({ x, y });
    }

    // Handle moving the entire canvas if needed
    if (dragStartPoint) {
      // Your logic here to update the canvas position
      // Probably update a translateX and translateY in your state
    }
  };

  const handleGlobalMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    if (isDrawing) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      stopDrawing({ x, y });
    }

    if (dragStartPoint) {
      // Your logic here to finalize the canvas position
      // Maybe save the new position to the state if you need to
      // Then clear the dragStartPoint to indicate dragging is done
      setDragStartPoint(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    console.log(x, y);

    if (mode === "dragging") {
      setDragStartPoint({ x, y });
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
      <div>
        <DrawingCanvas canvasRef={canvasRef}></DrawingCanvas>
      </div>
    </div>
  );
};
