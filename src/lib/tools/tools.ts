export const modes = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  line: "line",
  ai: "ai",
  freehand: "freehand",
  image: "image",
  drag: "drag",
  cursor: "cursor"
} as const;

export const modeCursorMap = {
  [modes.rectangle]: "crosshair",
  [modes.ellipse]: "crosshair",
  [modes.line]: "crosshair",
  [modes.ai]: "crosshair",
  [modes.freehand]: "crosshair",
  [modes.image]: "crosshair",
  [modes.cursor]: "default",
  [modes.drag]: "grab",
};

type LayerCounts = Record<Modes, number>;

/**
 * Converts modes into a record of counts
 * { rectangle: 0, ellipse: 0 ... }
 */
export const initialLayerCounts: LayerCounts = Object.keys(modes).reduce(
  (acc: LayerCounts, mode) => {
    acc[mode as Modes] = 1;
    return acc;
  },
  {} as LayerCounts
);

export type Modes = (typeof modes)[keyof typeof modes];

interface Tool {
  name: Modes;
  icon: string;
  tooltip?: string;
}

export const tools: Tool[] = [
  {
    name: modes.ellipse,
    icon: "ellipse",
    tooltip: "Draw Ellipse",
  },
  {
    name: modes.rectangle,
    icon: "rectangle",
    tooltip: "Draw Rectangle",
  },
  {
    name: modes.line,
    icon: "line",
    tooltip: "Draw Line",
  },
  {
    name: modes.freehand,
    icon: "pencil",
    tooltip: "Draw with a freehand",
  },
  {
    name: modes.ai,
    icon: "ai",
    tooltip: "Overlay AI generated image",
  },
  {
    name: modes.drag,
    icon: "drag",
    tooltip: "Drag the canvas around",
  },
  {
    name: modes.cursor,
    icon: "cursor",
    tooltip: "Select and move layers",
  },
];
