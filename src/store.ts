import { create } from "zustand";
import { Layer } from "./lib/layers/Layer";
import { layerFactory } from "./lib/layers/layerFactory";

interface Point {
  x: number;
  y: number;
}

export const drawModes = {
  rectangle: "rectangle",
  ellipse: "ellipse",
  line: "line",
  scribbleSelection: "scribbleSelection",
} as const;

export type DrawModes = (typeof drawModes)[keyof typeof drawModes];

export type State = {
  isDrawing: boolean;
  drawMode: DrawModes;
  startPoint: Point | null;
  endPoint: Point | null;
  layers: Layer[];
  currentLayer: Layer | null;
  fill: boolean;
  fillColor: string;
  strokeColor: string;
  strokeSize: number;
  currentSelection: [Point, Point];
  startDrawing: (point: Point) => void;
  stopDrawing: (point: Point) => void;
  updateCurrentLayer: (point: Point) => void;
  setDrawMode: (mode: DrawModes) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeSize: (width: number) => void;
  setCurrentSelection: (selection: [Point, Point]) => void;
  addLayer: (layer: Layer) => void;
};

export const useStore = create<State>((set) => ({
  isDrawing: false,
  drawMode: drawModes.rectangle,
  startPoint: null,
  endPoint: null,
  layers: [],
  currentLayer: null,
  fill: true,
  fillColor: "rgba(255,255,255,1)",
  strokeColor: "rgba(0,0,0,1)",
  strokeSize: 4,
  currentSelection: [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ],
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
        currentLayer: null,
      };
    }),
  updateCurrentLayer: (point) =>
    set((state) => {
      if (state.currentLayer) {
        state.endPoint = point;
      }
      const currentLayer = layerFactory({ ...state, endPoint: point });
      return { currentLayer };
    }),
  setDrawMode: (mode: DrawModes) => set(() => ({ drawMode: mode })),
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
