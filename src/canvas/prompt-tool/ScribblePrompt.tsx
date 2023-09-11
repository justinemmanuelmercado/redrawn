import { useState } from "react";
import { useStore } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { Layer } from "@/lib/layers/Layer";
import { Point } from "@/canvas/DrawingCanvas";
import { Button } from "@/components/ui/button";

const drawCanvas = (
  layers: Map<string, Layer>,
  canvasSettings: { width: number; height: number }
): CanvasRenderingContext2D | null => {
  const canvas = document.createElement("canvas");
  canvas.width = canvasSettings.width;
  canvas.height = canvasSettings.height;
  canvas.style.width = canvasSettings.width + "px";
  canvas.style.height = canvasSettings.height + "px";
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
  const { currentSelection, layers, canvasSettings } = useStore(
    (state) => state
  );
  const [prompt, setPrompt] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const mutation = useMutation(uploadScribble);

  const handleSubmit = async () => {
    const ctx = drawCanvas(layers, canvasSettings);
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
    <div className="p-2 bg-gray-100">
      <input
        className="border border-black"
        value={prompt}
        onChange={handleChange}
        type="text"
      />
      <Button onClick={handleSubmit}>Imagine</Button>
    </div>
  );
};
