import { Point } from "@/canvas/DrawingCanvas";
import { Layer } from "./Layer";

export class ImageLayer extends Layer {
  image: HTMLImageElement;
  
  constructor(
    public name: string,
    start: Point,
    end: Point,
    image: HTMLImageElement
  ) {
    super();
    this.start = start;
    this.end = end;
    this.image = image;
  }

  drawToCanvas(ctx: CanvasRenderingContext2D, scale?: number) {
    ctx.save();
    
    if(scale) {
      ctx.scale(scale, scale);
    }

    console.log(this.image)

    // Here you can define how you want to draw the image
    ctx.drawImage(
      this.image, 
      this.start.x, 
      this.start.y, 
      this.end.x - this.start.x, 
      this.end.y - this.start.y
    );
    
    ctx.restore();
  }
}
