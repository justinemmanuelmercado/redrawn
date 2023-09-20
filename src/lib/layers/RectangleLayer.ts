import { Point } from "@/canvas/DrawingCanvas";
import { Layer } from "./Layer";

export class RectangleLayer extends Layer {
  constructor(
    public name: string,
    start: Point,
    end: Point,
    fillColor: string | null,
    strokeColor: string | null,
    strokeSize: number = 1,
    scale: number = 1
  ) {
    super();
    this.start = start;
    this.end = end;
    this.fillColor = fillColor;
    this.strokeColor = strokeColor;
    this.strokeSize = strokeSize;
    this.scale = scale;
  }

  createNew(start: Point, end: Point) {
    console.log(
      this.name,
      start,
      end,
      this.fillColor,
      this.strokeColor,
      this.strokeSize,
      this.scale
    )
    return new RectangleLayer(
      this.name,
      start,
      end,
      this.fillColor,
      this.strokeColor,
      this.strokeSize,
      this.scale
    );
  }

  drawToCanvas(ctx: CanvasRenderingContext2D, scale?: number) {
    ctx.save();

    ctx.scale(this.scale, this.scale);
    if(scale){
      ctx.scale(scale, scale);
    }

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
