import { create } from "zustand";
import { Layer } from "./lib/layers/Layer";
import { layerFactory } from "./lib/layers/layerFactory";

interface Point {
  x: number;
  y: number;
}

export const modes = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  line: "line",
  scribbleSelection: "scribbleSelection",
  freehand: "freehand",
} as const;

export type Modes = (typeof modes)[keyof typeof modes];

export type State = {
  canvasDimensions: { width: number; height: number };
  isDrawing: boolean;
  mode: Modes;
  startPoint: Point | null;
  endPoint: Point | null;
  passedPoints: Point[];
  layers: Layer[];
  selectedLayers: Layer[];
  currentLayer: Layer | null;
  fill: boolean;
  fillColor: string;
  strokeColor: string;
  strokeSize: number;
  currentSelection: [Point, Point];
  isSelecting: boolean;
  startDrawing: (point: Point) => void;
  stopDrawing: (point: Point) => void;
  updateCurrentLayer: (point: Point) => void;
  setMode: (mode: Modes) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeSize: (width: number) => void;
  setCurrentSelection: (selection: [Point, Point]) => void;
  addLayer: (layer: Layer) => void;
};

export const useStore = create<State>((set) => ({
  canvasDimensions: { width: 512, height: 512 },
  isDrawing: false,
  mode: modes.rectangle,
  startPoint: null,
  passedPoints: [],
  endPoint: null,
  layers: [],
  selectedLayers: [],
  currentLayer: null,
  fill: true,
  fillColor: "rgba(255,255,255,1)",
  strokeColor: "rgba(0,0,0,1)",
  strokeSize: 4,
  currentSelection: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
  isSelecting: false,
  startDrawing: (point) =>
    set((state) => {
      const isDrawing = true;
      const newLayer = layerFactory({
        ...state,
        isDrawing,
        startPoint: point,
        endPoint: point,
      });
      return {
        isDrawing,
        startPoint: point,
        endPoint: point,
        currentLayer: newLayer,
      };
    }),
  stopDrawing: (point) =>
    set((state) => {
      const isDrawing = false;
      const newLayer = layerFactory({ ...state, isDrawing, endPoint: point });
      return {
        isDrawing: false,
        layers: [...state.layers, newLayer],
        passedPoints: [],
        currentLayer: null,
      };
    }),
  updateCurrentLayer: (point) =>
    set((state) => {
      if (state.currentLayer) {
        state.endPoint = point;
        state.currentLayer.updatePoint(point);
      }

      return {};
    }),
  setMode: (mode: Modes) => set(() => ({ mode: mode })),
  setStrokeColor: (color: string) => set(() => ({ strokeColor: color })),
  setFillColor: (color: string) => set(() => ({ fillColor: color })),
  setStrokeSize: (size: number) => set(() => ({ strokeSize: size })),
  setCurrentSelection: (selection: [Point, Point]) => {
    set(() => ({ currentSelection: selection }));
  },
  addLayer(layer: Layer) {
    set((state) => ({ layers: [...state.layers, layer] }));
  },
}));
