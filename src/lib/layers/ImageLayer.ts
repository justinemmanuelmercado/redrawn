import { Point } from "@/canvas/DrawingCanvas";
import { Layer } from "./Layer";

export class EllipseLayer extends Layer {
  imgUrl: string | null = null;
  constructor(name: string, start: Point, end: Point, imgUrl: string | null) {
    super();
    this.imgUrl = imgUrl;
    this.start = start;
    this.end = end;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D, scale = 1) {
    ctx.save();
    ctx.scale(scale, scale);
    if (this.imgUrl) {
      const img = new Image();
      img.src = this.imgUrl;
      ctx.drawImage(
        img,
        this.start.x,
        this.start.y,
        this.end.x - this.start.x,
        this.end.y - this.start.y
      );
    }

    ctx.restore();
  }
}
