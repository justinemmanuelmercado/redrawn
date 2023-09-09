import { Point } from "@/canvas/Canvas";
import { Layer } from "./Layer";

export class RectangleLayer extends Layer {
  constructor(
    public name: string,
    start: Point,
    end: Point,
    fillColor: string | null,
    strokeColor: string | null,
    strokeSize: number = 1
  ) {
    super();
    this.start = start;
    this.end = end;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeSize = strokeSize;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D, scale = 1) {
    ctx.save();

    ctx.scale(scale, scale);

    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
    }

    if (this.strokeSize) {
      ctx.lineWidth = this.strokeSize;
    }

    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fillRect(
        this.start.x,
        this.start.y,
        this.end.x - this.start.x,
        this.end.y - this.start.y
      );
    }

    ctx.strokeRect(
      this.start.x,
      this.start.y,
      this.end.x - this.start.x,
      this.end.y - this.start.y
    );

    ctx.restore();
  }
}
