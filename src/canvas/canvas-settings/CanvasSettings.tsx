import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/store";

export const CanvasSettings = () => {
  const canvasSettings = useStore((state) => state.canvasSettings);
  const updateCanvasSettings = useStore((state) => state.updateCanvasSettings);
  const dimensionOptions = [
    { height: 512, width: 512 },
    { height: 768, width: 768 },
    { height: 1024, width: 1024 },
    { height: 2048, width: 2048 },
  ];

  const zoomOptions = [25, 50, 75, 100, 125, 150, 200, 300, 400, 500];

  return (
    <div className="p-2 bg-gray-100 rounded-md flex gap-2 z-20">
      <DropdownMenu>
        <DropdownMenuTrigger className="font-bold">
          Canvas Size
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator></DropdownMenuSeparator>
          {dimensionOptions.map((option) =>
            option.width === canvasSettings.width &&
            option.height === canvasSettings.height ? (
              <DropdownMenuLabel key={option.width}>
                {canvasSettings.width} x {canvasSettings.height}
              </DropdownMenuLabel>
            ) : (
              <DropdownMenuItem
                key={option.width}
                onClick={() => {
                  updateCanvasSettings({
                    width: option.width,
                    height: option.height,
                  });
                }}
              >
                {option.width} x {option.height}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="font-bold">Zoom</DropdownMenuTrigger>
        <DropdownMenuContent>
          {zoomOptions.map((option) =>
            option === canvasSettings.zoom ? (
              <DropdownMenuLabel key={option} className="font-bold">
                {option}
              </DropdownMenuLabel>
            ) : (
              <DropdownMenuItem
                key={option}
                onClick={() => {
                  updateCanvasSettings({
                    zoom: option,
                  });
                }}
              >
                {option}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
