import { Point } from "@/canvas/Canvas";

export abstract class Layer {
  public visible: boolean = true;
  public name: string = "Layer";
  public x: number = 0;
  public y: number = 0;
  public start: Point = { x: 0, y: 0 };
  public end: Point = { x: 0, y: 0 };
  public fillColor: null | string = null;
  public strokeColor: null | string = null;
  public strokeSize: number = 1;
  abstract drawToCanvas(ctx: CanvasRenderingContext2D, scale?: number): void;

  public updatePoint(newPoint: Point) {
    this.end = newPoint;
  }

  public setVisibility(visible: boolean) {
    this.visible = visible;
  }

  public move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
