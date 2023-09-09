import { State, modes } from "@/store";
import { EllipseLayer } from "./EllipseLayer";
import { Layer } from "./Layer";
import { LineLayer } from "./LineLayer";
import { RectangleLayer } from "./RectangleLayer";
import { SelectionLayer } from "./SelectionLayer";
import { FreehandLayer } from "./FreehandLayer";

export const layerFactory = (state: State): Layer => {
  switch (state.mode) {
    case modes.ellipse:
      return new EllipseLayer(
        "Layer " + (state.layers.length + 1),
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case modes.rectangle:
      return new RectangleLayer(
        "Layer " + (state.layers.length + 1),
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case modes.line:
      return new LineLayer(
        "Layer " + (state.layers.length + 1),
        state.startPoint!,
        state.endPoint!,
        state.strokeColor,
        state.strokeSize
      );
    case modes.scribbleSelection:
      return new SelectionLayer(state.setCurrentSelection);
    case modes.freehand:
      return new FreehandLayer(
        "Layer " + (state.layers.length + 1),
        state.passedPoints,
        state.strokeColor,
        state.strokeSize
      );
    default:
      throw new Error("Invalid layer type");
  }
};
