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
