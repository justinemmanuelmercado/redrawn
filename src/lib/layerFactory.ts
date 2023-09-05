import { State } from "../store";
import { EllipseLayer } from "./EllipseLayer";
import { Layer } from "./Layer";
import { LineLayer } from "./LineLayer";
import { RectangleLayer } from "./RectangleLayer";

export const layerFactory = (state: State): Layer => {
  switch (state.drawMode) {
    case "ellipse":
      return new EllipseLayer(
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case "rectangle":
      return new RectangleLayer(
        state.startPoint!,
        state.endPoint!,
        state.fillColor,
        state.strokeColor,
        state.strokeSize
      );
    case "line":
      return new LineLayer(
        state.startPoint!,
        state.endPoint!,
        state.strokeColor,
        state.strokeSize
      );
    default:
      throw new Error("Invalid layer type");
  }
};
