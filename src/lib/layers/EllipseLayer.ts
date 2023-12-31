import { Point } from "@/canvas/DrawingCanvas";
import { Layer } from "./Layer";

export class EllipseLayer extends Layer {
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

  drawToCanvas(ctx: CanvasRenderingContext2D, scale?: number) {
    ctx.save();  

    ctx.scale(this.scale, this.scale);
    if(scale){
      ctx.scale(scale, scale);
    }
    const centerX = (this.start.x + this.end.x) / 2;
    const centerY = (this.start.y + this.end.y) / 2;
    const radiusX = Math.abs(this.end.x - this.start.x) / 2;
    const radiusY = Math.abs(this.end.y - this.start.y) / 2;
  
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0, // rotation: not rotated
      0,
      2 * Math.PI
    );
  
    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
    }
  
    if (this.fillColor) {
      ctx.fillStyle = this.fillColor;
      ctx.fill();
    }
  
    ctx.lineWidth = this.strokeSize;
    ctx.stroke();
    ctx.restore();
  }
}
