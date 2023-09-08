import { Point } from "@/canvas/Canvas";
import { Layer } from "./Layer";

export class SelectionLayer extends Layer {
  constructor(private cb: (selection: [Point, Point]) => void) {
    super();
    this.start = { x: 0, y: 0 };
    this.end = { x: 512, y: 512 };
  }

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    // Set up dashed lines
    ctx.setLineDash([4, 2]);
    // Fixed Stroke color and line width
    ctx.strokeStyle = "#000000"; // Black color for the stroke
    ctx.lineWidth = 6; // Fixed 1px line width

    // No need for fill for a marquee, so we'll skip that part

    // Drawing the rectangle
    ctx.beginPath();
    ctx.rect(
      this.start.x,
      this.start.y,
      this.end.x - this.start.x,
      this.end.y - this.start.y
    );
    ctx.stroke();

    // Resetting line dash
    ctx.setLineDash([]);

    // Set current Selection
    this.cb([this.start, this.end]);
  }
}
