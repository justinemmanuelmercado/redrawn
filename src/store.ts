import { create } from "zustand";
import { Layer } from "./lib/layers/Layer";
import { layerFactory } from "./lib/layers/layerFactory";
import { Modes, initialLayerCounts, modes } from "./lib/tools/tools";

interface Point {
  x: number;
  y: number;
}

export type State = {
  layerCounts: Record<Modes, number>;
  canvasDimensions: { width: number; height: number };
  isDrawing: boolean;
  mode: Modes;
  startPoint: Point | null;
  endPoint: Point | null;
  passedPoints: Point[];
  layers: Map<string, Layer>;
  selectedLayers: string[];
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
  toggleLayer: (layerName: string) => void;
  deleteLayer: (layerName: string) => void;
};

export const useStore = create<State>((set) => ({
  layerCounts: initialLayerCounts,
  canvasDimensions: { width: 512, height: 512 },
  isDrawing: false,
  mode: modes.rectangle,
  startPoint: null,
  passedPoints: [],
  endPoint: null,
  layers: new Map(),
  selectedLayers: [],
  currentLayer: null,
  fill: true,
  fillColor: "rgba(0,0,0,1)",
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
      const layerCounts = { ...state.layerCounts, [state.mode]: state.layerCounts[state.mode] + 1 }
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
        layerCounts
      };
    }),
  stopDrawing: (point) =>
    set((state) => {
      const isDrawing = false;
      const newLayer = layerFactory({ ...state, isDrawing, endPoint: point });
      const newLayers = new Map(state.layers);
      newLayers.set(newLayer.name, newLayer);
      return {
        isDrawing: false,
        layers: newLayers,
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
  toggleLayer: (layerName: string) => {
    set((state) => {
      if (state.selectedLayers.includes(layerName)) {
        const selectedLayers = state.selectedLayers.filter(
          (layer) => layer !== layerName
        );
        return { selectedLayers };
      }

      const selectedLayers = [...state.selectedLayers, layerName];
      return { selectedLayers };
    });
  },
  deleteLayer: (layerName: string) => {
    set((state) => {
      const layers = new Map(state.layers);
      layers.delete(layerName);
      return { layers };
    })
  }
}));
