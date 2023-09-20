import { create } from "zustand";
import { Layer } from "./lib/layers/Layer";
import { layerFactory } from "./lib/layers/layerFactory";
import { Modes, initialLayerCounts, modes } from "./lib/tools/tools";
import { ImageLayer } from "./lib/layers/ImageLayer";
import { LineLayer } from "./lib/layers/LineLayer";
import { EllipseLayer } from "./lib/layers/EllipseLayer";
import { RectangleLayer } from "./lib/layers/RectangleLayer";
import { isPointNearLine } from "./helpers/canvas-helpers";

interface Point {
  x: number;
  y: number;
}

interface CanvasSettings {
  width: number;
  height: number;
  zoom: number;
  offsetY: number;
  offsetX: number;
}

export type State = {
  layerCounts: Record<Modes, number>;
  canvasSettings: CanvasSettings;
  isMouseDown: boolean;
  mode: Modes;
  startPoint: Point | null;
  endPoint: Point | null;
  passedPoints: Point[];
  layers: Map<string, Layer>;
  selectedLayer: string | null;
  currentLayer: Layer | null;
  fill: boolean;
  fillColor: string;
  strokeColor: string;
  strokeSize: number;
  currentAISelection: [Point, Point];
  currentSelectedLayerForReposition: string | null;
  setStartPoint: (point: Point) => void;
  startDrawing: (point: Point) => void;
  stopDrawing: (point: Point) => void;
  updateCurrentLayer: (point: Point) => void;
  setMode: (mode: Modes) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeSize: (width: number) => void;
  setCurrentAISelection: (selection: [Point, Point]) => void;
  toggleIsMouseDown: (isMouseDown: boolean) => void;
  toggleLayer: (layerName: string) => void;
  deleteLayer: (layerName: string) => void;
  updateCanvasSettings: (options: Partial<CanvasSettings>) => void;
  newImageLayer: (image: HTMLImageElement) => void;
  repositionLayer: (position: Point) => void;
  setCurrentSelectedLayerForReposition: (position: Point) => void;
};

export const useStore = create<State>((set) => ({
  layerCounts: initialLayerCounts,
  canvasSettings: {
    width: 512,
    height: 512,
    zoom: 100,
    offsetY: 0,
    offsetX: 0,
  },
  isMouseDown: false,
  mode: modes.rectangle,
  startPoint: null,
  passedPoints: [],
  endPoint: null,
  layers: new Map(),
  selectedLayer: null,
  currentLayer: null,
  fill: true,
  fillColor: "rgba(0,0,0,1)",
  strokeColor: "rgba(0,0,0,1)",
  strokeSize: 4,
  currentAISelection: [
    { x: 0, y: 0 },
    { x: 512, y: 512 },
  ],
  currentSelectedLayerForReposition: "",
  setStartPoint: (point) => {
    set(() => {
      return {
        startPoint: { x: point.x, y: point.y },
      };
    });
  },
  startDrawing: (point) =>
    set((state) => {
      const isMouseDown = true;

      const newLayer = layerFactory({
        ...state,
        isMouseDown,
        startPoint: { x: point.x, y: point.y },
        endPoint: { x: point.x, y: point.y  },
      });
      return {
        isMouseDown,
        startPoint: { x: point.x, y: point.y },
        endPoint: { x: point.x, y: point.y },
        currentLayer: newLayer,
      };
    }),
  stopDrawing: (point) =>
    set((state) => {
      // If start and end points are the same or less than 2px difference, don't create a layer
      if (
        state.startPoint &&
        (Math.abs(state.startPoint.x - point.x) <= 2 ||
          Math.abs(state.startPoint.y - point.y) <= 2)
      ) {
        return {
          isMouseDown: false,
          startPoint: null,
          endPoint: null,
          currentLayer: null,
        };
      }

      const layerCounts = {
        ...state.layerCounts,
        [state.mode]: state.layerCounts[state.mode] + 1,
      };

      const isMouseDown = false;
      const newLayer = layerFactory({ ...state, isMouseDown, endPoint: point });
      const newLayers = new Map(state.layers);
      newLayers.set(newLayer.name, newLayer);
      return {
        isMouseDown: false,
        layers: newLayers,
        passedPoints: [],
        currentLayer: null,
        layerCounts,
        startPoint: null,
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
  setCurrentAISelection: (selection: [Point, Point]) => {
    set(() => ({ currentAISelection: selection }));
  },
  toggleIsMouseDown: (isMouseDown: boolean) => {
    set(() => ({ isMouseDown }));
  },
  toggleLayer: (layerName: string) => {
    set((state) => {
      if (layerName === state.selectedLayer) {
        return { selectedLayer: null };
      }

      return { selectedLayer: layerName };
    });
  },
  deleteLayer: (layerName: string) => {
    set((state) => {
      const layers = new Map(state.layers);
      layers.delete(layerName);
      return { layers };
    });
  },
  updateCanvasSettings: (options: Partial<CanvasSettings>) => {
    set((state) => {
      return { canvasSettings: { ...state.canvasSettings, ...options } };
    });
  },
  newImageLayer: (loadedImage: HTMLImageElement) => {
    set((state) => {
      const nme = `${modes.image.toUpperCase()} ${
        state.layerCounts[modes.image]
      }`;

      const newLayer = new ImageLayer(
        nme,
        state.currentAISelection[0],
        state.currentAISelection[1],
        loadedImage // pass the loaded HTMLImageElement here
      );

      const layerCounts = {
        ...state.layerCounts,
        [modes.image]: state.layerCounts[modes.image] + 1,
      };
      return {
        layers: new Map(state.layers).set(newLayer.name, newLayer),
        layerCounts,
      };
    });
  },
  repositionLayer: (position: Point) => {
    set((state) => {
      if (
        state.currentSelectedLayerForReposition !== null &&
        state.startPoint !== null
      ) {
        const layer = state.layers.get(state.currentSelectedLayerForReposition);
        if (layer) {
          if (layer instanceof RectangleLayer) {
            const dx = position.x - state.startPoint.x;
            const dy = position.y - state.startPoint.y;
            layer.start.x += dx;
            layer.end.x += dx;
            layer.start.y += dy;
            layer.end.y += dy;
            return {
              startPoint: { x: state.startPoint.x + dx, y: state.startPoint.y + dy },
              layers: new Map(state.layers).set(layer.name,layer),
            };
            // return {
            //   layers: new Map(state.layers).set(
            //     layer.name,
            //     layer.createNew(
            //       { x: layer.start.x + dx, y: layer.start.y + dy },
            //       { x: layer.end.x + dx, y: layer.end.y + dy }
            //     )
            //   ),
            // };
          }
        }
      }

      return {
      };
    });
  },
  setCurrentSelectedLayerForReposition: (position: Point) => {
    const { x, y } = position;
    set((state) => {
      const layersArray = Array.from(state.layers.values()).reverse();
      let selectedLayer = null;
      for (const layer of layersArray) {
        if (layer instanceof RectangleLayer) {
          if (
            x >= layer.start.x &&
            x <= layer.end.x &&
            y >= layer.start.y &&
            y <= layer.end.y
          ) {
            selectedLayer = layer;
            break;
          }
        } else if (layer instanceof LineLayer) {
          if (
            isPointNearLine(
              x,
              y,
              layer.start.x,
              layer.start.y,
              layer.end.x,
              layer.end.y
            )
          ) {
            selectedLayer = layer;
            break;
          }
        } else if (layer instanceof EllipseLayer) {
          const centerX = (layer.start.x + layer.end.x) / 2;
          const centerY = (layer.start.y + layer.end.y) / 2;
          const radiusX = Math.abs(layer.end.x - layer.start.x) / 2;
          const radiusY = Math.abs(layer.end.y - layer.start.y) / 2;

          if (
            Math.pow((x - centerX) / radiusX, 2) +
              Math.pow((y - centerY) / radiusY, 2) <=
            1
          ) {
            selectedLayer = layer;
            break;
          }
        } else if (layer instanceof ImageLayer) {
          if (
            x >= layer.start.x &&
            x <= layer.end.x &&
            y >= layer.start.y &&
            y <= layer.end.y
          ) {
            selectedLayer = layer;
            break;
          }
        }
      }
      return {
        currentSelectedLayerForReposition:
          selectedLayer !== null ? selectedLayer.name : null,
      };
    });
  },
}));
