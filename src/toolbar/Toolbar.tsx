import { useState } from 'react';
import { DrawModes, drawModes, useStore } from "../store";
import { SketchPicker } from "react-color";

interface Tool {
  name: DrawModes;
  icon: string;
}

const tools: Tool[] = [
  {
    name: drawModes.ellipse,
    icon: "ellipse",
  },
  {
    name: drawModes.rectangle,
    icon: "rectangle",
  },
  {
    name: drawModes.line,
    icon: "line",
  },
];

export const Toolbar = () => {
  const { setDrawMode, drawMode, setStrokeColor, setFillColor, setStrokeSize } =
    useStore((state) => state);

  const [localStrokeColor, setLocalStrokeColor] = useState<string | null>(null);
  const [localFillColor, setLocalFillColor] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-start p-4 space-y-4">
      <div>
        {tools.map((tool) => {
          return (
            <button
              key={tool.name}
              className={`p-2 rounded-md ${
                drawMode === tool.name
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setDrawMode(tool.name)}
            >
              {tool.name}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col space-y-2">
        <label>
          Stroke Color
          <SketchPicker
            color={localStrokeColor ?? "transparent"}
            onChange={(e) => {
              setLocalStrokeColor(
                e.rgb.a === 1
                  ? e.hex
                  : `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`
              );
            }}
            onChangeComplete={() => setStrokeColor(localStrokeColor ?? "transparent")}
          />
        </label>
        <label>
          Fill Color
          <SketchPicker
            color={localFillColor ?? "transparent"}
            onChange={(e) => {
              setLocalFillColor(
                e.rgb.a === 1
                  ? e.hex
                  : `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`
              );
            }}
            onChangeComplete={() => setFillColor(localFillColor ?? "transparent")}
          />
        </label>
        <label>
          Stroke Width
          <input
            type="number"
            min="1"
            max="10"
            onChange={(e) => setStrokeSize(parseInt(e.target.value, 10))}
          />
        </label>
      </div>
    </div>
  );
};
