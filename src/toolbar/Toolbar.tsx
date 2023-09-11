import { useStore } from "@/store";
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
import { tools } from '@/lib/tools/tools';


export const Toolbar = () => {
  const { setMode, mode, setStrokeSize, strokeSize } = useStore(
    (state) => state
  );

  return (
    <div className="flex flex-col justify-center items-end h-full">
      <div className="items-center flex flex-col gap-10 bg-slate-100 border border-slate-300 py-2 w-12 z-30 rounded-md">
        <div className="flex flex-col gap-1">
          {tools.map((tool) => {
            return (
              <TooltipProvider key={tool.name}>
                <Tooltip>
                  <TooltipTrigger
                    className={`rounded-md border ${
                      mode === tool.name ? "bg-slate-300" : "bg-slate-200"
                    }`}
                    onClick={() => setMode(tool.name)}
                  >
                    <img
                      className="aspect-square w-8 p-2"
                      src={`icons/${tool.icon}.svg`}
                      alt={tool.name + " tool"}
                    />
                  </TooltipTrigger>
                  <TooltipContent side='right'>
                    <p>{tool.tooltip}</p>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    className="bg-slate-100 border border-slate-300 flex justify-center rounded-md"
                  >
                    <img
                      className="w-8 h-8 p-2 aspect-square"
                      src="icons/width.svg"
                      alt="width-toggle"
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Stroke Size</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2">
              <div>Stroke Size</div>
              <div className="flex gap-2">
                <Slider
                  defaultValue={[strokeSize]}
                  max={100}
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
