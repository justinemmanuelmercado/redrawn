import { DrawModes, drawModes, useStore } from "@/store";
import ColorSelector from "@/toolbar/ColorSelector";
import { Slider } from "@/components/ui/slider";
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
  const { setDrawMode, drawMode, setStrokeSize, strokeSize } = useStore(
    (state) => state
  );

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="items-center flex flex-col gap-10 bg-slate-100 border border-slate-300 ml-8 py-2">
        <div className="flex flex-col">
          {tools.map((tool) => {
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <button
                      key={tool.name}
                      className={`border border-slate-300 ${
                        drawMode === tool.name ? "bg-slate-300" : "bg-slate-200"
                      }`}
                      onClick={() => setDrawMode(tool.name)}
                    >
                      <img
                        className="aspect-square w-8 p-2"
                        src={`icons/${tool.icon}.svg`}
                        alt={tool.name + " tool"}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tool.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        <div className="flex flex-col space-y-2">
          <ColorSelector />
          <Popover>
            <PopoverTrigger>
              <button
                className={`w-full bg-slate-100 border border-slate-300 flex justify-center`}
              >
                <img
                  className="w-8 h-8 p-2 aspect-square"
                  src="icons/width.svg"
                  alt="width-toggle"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
              <div>Stroke Size</div>
              <div className="flex gap-2">

              <Slider
                defaultValue={[strokeSize]}
                max={50}
                step={1}
                onValueChange={(e) => {
                  setStrokeSize(e[0]);
                }}
              ></Slider>
              <span>{strokeSize}</span>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
