import { Point } from "@/canvas/DrawingCanvas";
import { Layer } from "./Layer";
import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from '@/helpers/canvas-helpers';

export class FreehandLayer extends Layer {
  constructor(
    public name: string,
    public points: Point[] = [],
    public strokeColor: string | null,
    public strokeSize: number = 1
  ) {
    super();
  }

  drawToCanvas(ctx: CanvasRenderingContext2D, scale = 1) {
    if (this.points.length === 0) {
      return;
    }

    ctx.save();

    ctx.scale(scale, scale);

    const outlinePoints = getStroke(this.points, {
      size: this.strokeSize
    });
    const pathData = getSvgPathFromStroke(outlinePoints);
    const myPath = new Path2D(pathData!);

    if (this.strokeColor) {
      ctx.fillStyle = this.strokeColor;
    }

    ctx.fill(myPath)

    ctx.restore();
  }

  public updatePoint(newPoint: Point): void {
    this.points.push(newPoint);
  }
}

