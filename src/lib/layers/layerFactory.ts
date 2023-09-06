import { State, drawModes } from "../../store";
import { EllipseLayer } from "./EllipseLayer";
import { Layer } from "./Layer";
import { LineLayer } from "./LineLayer";
import { RectangleLayer } from "./RectangleLayer";
import { SelectionLayer } from "./SelectionLayer";

export const layerFactory = (state: State): Layer => {
  switch (state.drawMode) {
    case drawModes.ellipse:
      return new EllipseLayer(
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case drawModes.rectangle:
      return new RectangleLayer(
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case drawModes.line:
      return new LineLayer(
        state.startPoint!,
        state.endPoint!,
        state.strokeColor,
        state.strokeSize
      );
    case drawModes.scribbleSelection:
      return new SelectionLayer(state.setCurrentSelection);
    default:
      throw new Error("Invalid layer type");
  }
};
