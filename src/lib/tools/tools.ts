export const modes = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  line: "line",
  scribbleSelection: "scribbleSelection",
  freehand: "freehand",
} as const;

export const modeAction = {
  drawing: "drawing",
  selecting: "selecting",
  dragging: "dragging",
};

export const modeActions = {
  [modes.rectangle]: modeAction.drawing,
  [modes.ellipse]: modeAction.drawing,
  [modes.line]: modeAction.drawing,
  [modes.freehand]: modeAction.drawing,
  [modes.scribbleSelection]: modeAction.selecting,
};

type LayerCounts = Record<Modes, number>;

/**
 * Converts modes into a record of counts
 * { rectangle: 0, ellipse: 0 ... }
 */
export const initialLayerCounts: LayerCounts = Object.keys(modes).reduce(
  (acc: LayerCounts, mode) => {
    acc[mode as Modes] = 0;
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
    name: modes.scribbleSelection,
    icon: "scribble",
    tooltip: "Select an area to overlay with StableDiffusion",
  },
];
