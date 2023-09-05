import { Point } from "../canvas/Canvas";
import { Layer } from "./Layer";

export class LineLayer extends Layer {
  constructor(
    start: Point,
    end: Point,
    strokeColor: string | null,
    strokeSize: number = 1
  ) {
    super();
    this.start = start;
    this.end = end;
    this.strokeColor = strokeColor;
    this.strokeSize = strokeSize;
  }
  drawToCanvas(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
  
    if (this.strokeColor) {
      ctx.strokeStyle = this.strokeColor;
    }
  
    ctx.lineWidth = this.strokeSize;
    
    ctx.stroke();
  }
}