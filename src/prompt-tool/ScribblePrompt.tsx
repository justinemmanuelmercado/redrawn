import { useState } from "react";
import { useStore } from "../store";
import { useMutation } from "@tanstack/react-query";
import { Layer } from "../lib/layers/Layer";
import { Point } from "../canvas/Canvas";

const drawCanvas = (layers: Layer[]): CanvasRenderingContext2D | null => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  canvas.style.width = "512px";
  canvas.style.height = "512px";
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  layers.forEach((layer) => {
    layer.drawToCanvas(ctx);
  });

  return ctx;
};

function captureArea(
  start: Point,
  end: Point,
  originalCtx: CanvasRenderingContext2D
): Promise<Blob | null> {
  return new Promise((resolve) => {
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);
    const width = Math.abs(start.x - end.x);
    const height = Math.abs(start.y - end.y);

    const maxCanvasWidth = originalCtx.canvas.width;
    const maxCanvasHeight = originalCtx.canvas.height;
    
    console.log("Max Width:", maxCanvasWidth, "Max Height:", maxCanvasHeight);
    console.log("Current x:", x, "y:", y, "width:", width, "height:", height);

    const imageData = originalCtx.getImageData(x, y, width, height);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    if (ctx) {
      ctx.putImageData(imageData, 0, 0);
      canvas.toBlob((blob) => {
        resolve(blob);
      });
    }
  });
}

const uploadScribble = async ({
  blob,
  prompt,
}: {
  blob: Blob;
  prompt: string;
}) => {
  const formData = new FormData();
  formData.append("image", blob);
  formData.append("prompt", prompt);

  const response = await fetch("http://localhost:8080/v1/scribble", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  return response.json();
};

export const ScribblePrompt = () => {
  const { currentSelection, layers } = useStore((state) => state);
  const [prompt, setPrompt] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const mutation = useMutation(uploadScribble);

  const handleSubmit = async () => {
    const ctx = drawCanvas(layers);
    if (!ctx) return;

    captureArea(currentSelection[0], currentSelection[1], ctx).then(
      async (blob: Blob | null) => {
        if (!blob) return;
        console.log(ctx);

        mutation.mutate(
          { blob, prompt },
          {
            onSuccess: (data) => {
              console.log("Success!", data);
            },
            onError: (error) => {
              console.log("Error:", error);
            },
          }
        );
      }
    );
  };

  return (
    <div className="w-full">
      <input
        className="border border-black"
        value={prompt}
        onChange={handleChange}
        type="text"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
