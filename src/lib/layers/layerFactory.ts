import { State } from "@/store";
import { EllipseLayer } from "./EllipseLayer";
import { Layer } from "./Layer";
import { LineLayer } from "./LineLayer";
import { RectangleLayer } from "./RectangleLayer";
import { SelectionLayer } from "./SelectionLayer";
import { FreehandLayer } from "./FreehandLayer";
import { modes } from "@/lib/tools/tools";

export const layerFactory = (state: State): Layer => {
  const name = `${state.mode.toUpperCase()} ${state.layerCounts[state.mode]}`;
  switch (state.mode) {
    case modes.ellipse:
      return new EllipseLayer(
        name,
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case modes.rectangle:
      return new RectangleLayer(
        name,
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case modes.line:
      return new LineLayer(
        name,
        state.startPoint!,
        state.endPoint!,
        state.strokeColor,
        state.strokeSize
      );
    case modes.scribbleSelection:
      return new SelectionLayer(state.setCurrentSelection);
    case modes.freehand:
      return new FreehandLayer(
        name,
        state.passedPoints,
        state.strokeColor,
        state.strokeSize
      );
    default:
      throw new Error("Invalid layer type");
  }
};
