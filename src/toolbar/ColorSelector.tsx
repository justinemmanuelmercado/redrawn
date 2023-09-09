import { useState } from "react";
import { SketchPicker } from "react-color";
import { useStore } from "@/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ColorSelector = () => {
  const { setStrokeColor, setFillColor, strokeColor, fillColor } = useStore(
    (state) => state
  );

  const [localStrokeColor, setLocalStrokeColor] = useState<string>(strokeColor);
  const [localFillColor, setLocalFillColor] = useState<string>(fillColor);

  return (
    <div className="flex flex-col items-center gap-1">
      <div>
        <Popover>
          <PopoverTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild={true}>
                  <div className="rounded-full border-2 border-slate-400 w-6 h-6">
                    <div
                      className="w-full h-full rounded-full border-4 border-black"
                      style={{ borderColor: localStrokeColor }}
                    ></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stroke Color</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </PopoverTrigger>
          <PopoverContent className="w-0 p-0 m-0">
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
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Popover>
          <PopoverTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="block p-2 border border-slate-300" asChild={true}>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-slate-400"
                    style={{ backgroundColor: localFillColor }}
                  ></div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fill Color</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </PopoverTrigger>
          <PopoverContent className="w-0 p-0 m-0">
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
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default ColorSelector;
