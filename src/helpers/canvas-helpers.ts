import { Point } from "@/canvas/DrawingCanvas";

export const drawCheckerBoard = (
  ctx: CanvasRenderingContext2D,
  size: number,
  rows: number,
  cols: number
) => {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      ctx.fillStyle = (i + j) % 2 === 0 ? "white" : "gray";
      ctx.fillRect(i * size, j * size, size, size);
    }
  }
};

const average = (a: number, b: number) => (a + b) / 2;

export function getSvgPathFromStroke(points: number[][], closed = true) {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];

  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
}

export function getPointsForAIFromCanvasRect(
  currentAISelection: [Point, Point],
  x: number,
  y: number,
  rect: DOMRect
): [Point, Point] {
  // Calculate the width and height of the current selection
  const selectionWidth = currentAISelection[1].x - currentAISelection[0].x;
  const selectionHeight = currentAISelection[1].y - currentAISelection[0].y;

  // Calculate the new topLeft and bottomRight points, keeping them within canvas boundaries
  const newTopLeftX = Math.min(
    Math.max(0, x - selectionWidth / 2),
    rect.width - selectionWidth
  );
  const newTopLeftY = Math.min(
    Math.max(0, y - selectionHeight / 2),
    rect.height - selectionHeight
  );

  return [
    { x: newTopLeftX, y: newTopLeftY },
    { x: newTopLeftX + selectionWidth, y: newTopLeftY + selectionHeight },
  ];
}
export const drawMarchingAnts = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  lineDashOffset: number
) => {
  const lineWidth = 6
  ctx.strokeStyle = "white";
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

  ctx.setLineDash([8, 4]);
  ctx.lineDashOffset = lineDashOffset;
  ctx.strokeStyle = "black";
  ctx.lineWidth = lineWidth / 2 + 1;
  ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
};

export const calculateNewDragPosition = (
  start: Point,
  clientX: number,
  clientY: number
) => {
  return {
    offsetX: clientX - start.x,
    offsetY: clientY - start.y,
  };
};
