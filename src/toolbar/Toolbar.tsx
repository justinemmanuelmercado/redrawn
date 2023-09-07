import { useState } from "react";
import { DrawModes, drawModes, useStore } from "../store";
import { SketchPicker } from "react-color";
import ColorSelector from './ColorSelector';

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
  {
    name: drawModes.scribbleSelection,
    icon: "scribble",
  },
];

export const Toolbar = () => {
  const { setDrawMode, drawMode, setStrokeColor, setFillColor, setStrokeSize } =
    useStore((state) => state);

  const [localStrokeColor, setLocalStrokeColor] = useState<string | null>(null);
  const [localFillColor, setLocalFillColor] = useState<string | null>(null);
  const [displayStrokeColorPicker, setDisplayStrokeColorPicker] =
    useState(false);
  const [displayFillColorPicker, setDisplayFillColorPicker] = useState(false);
  return (
    <div className="flex flex-col items-start gap-10">
      <div className='flex flex-col gap-2'>
        {tools.map((tool) => {
          return (
            <button
              key={tool.name}
              className={`rounded-md ${
                drawMode === tool.name
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setDrawMode(tool.name)}
            >
              <img className="aspect-square w-8 p-2" src={`icons/${tool.icon}.svg`} alt={tool.name + " tool"} />
            </button>
          );
        })}
      </div>
      <div className="flex flex-col space-y-2">
        <ColorSelector strokeColor={localStrokeColor ?? "transparent"} fillColor={localFillColor ?? "transparent"} />
        <label>
          <button
            onClick={() =>
              setDisplayStrokeColorPicker(!displayStrokeColorPicker)
            }
          >
            Stroke Color
          </button>
          {displayStrokeColorPicker ? (
            <SketchPicker
              color={localStrokeColor ?? "transparent"}
              onChange={(e) => {
                setLocalStrokeColor(
                  e.rgb.a === 1
                    ? e.hex
                    : `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`
                );
              }}
              onChangeComplete={() =>
                setStrokeColor(localStrokeColor ?? "transparent")
              }
            />
          ) : null}
        </label>
        <label>
          <button
            onClick={() => setDisplayFillColorPicker(!displayFillColorPicker)}
          >
            Fill Color
          </button>
          {displayFillColorPicker ? (
            <SketchPicker
              color={localFillColor ?? "transparent"}
              onChange={(e) => {
                setLocalFillColor(
                  e.rgb.a === 1
                    ? e.hex
                    : `rgba(${e.rgb.r}, ${e.rgb.g}, ${e.rgb.b}, ${e.rgb.a})`
                );
              }}
              onChangeComplete={() =>
                setFillColor(localFillColor ?? "transparent")
              }
            />
          ) : null}
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
