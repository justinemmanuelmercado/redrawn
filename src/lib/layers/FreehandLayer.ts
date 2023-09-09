import { Point } from "@/canvas/Canvas";
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

    const outlinePoints = getStroke(this.points);
    const pathData = getSvgPathFromStroke(outlinePoints);
    const myPath = new Path2D(pathData!);

    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
    }

    if (this.strokeSize) {
      ctx.lineWidth = this.strokeSize;
    }

    // ctx.beginPath();

    // ctx.moveTo(this.points[0].x, this.points[0].y);

    // this.points.forEach((point) => {
    //   ctx.lineTo(point.x, point.y);
    // });

    // ctx.stroke();
    ctx.fill(myPath)

    ctx.restore();
  }

  public updatePoint(newPoint: Point): void {
    this.points.push(newPoint);
  }
}

