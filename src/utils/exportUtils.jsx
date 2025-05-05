import { parseGIF, decompressFrames } from "gifuct-js";
import GIF from "gif.js";
import html2canvas from "html2canvas";
import { progressToast } from "../components/toast/toast";

export const exportToGif = async (elementRef, fileName) => {
  const uploadToast = progressToast({
    message: "Rendering progress...",
    progress: 0,
  });
  try {
    // 1. Verify element exists
    if (!elementRef.current) {
      throw new Error("Element reference is not available");
    }

    // 2. Alternative to cloning - store original styles
    const originalStyles = [];
    const gifElements = Array.from(
      elementRef.current.querySelectorAll('[data-mediatype="gif"]')
    );

    // 3. Capture static content without GIFs
    const staticCanvas = await html2canvas(elementRef.current, {
      width: elementRef.current.clientWidth,
      height: elementRef.current.clientHeight,
      scale: 1,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      onclone: (document, element) => {
        Array.from(element.querySelectorAll('[data-mediatype="gif"]')).forEach(
          (el) => {
            el.style.opacity = "0";
          }
        );
      },
    });

    // Restore original styles immediately
    originalStyles.forEach((style) => {
      style.element.style.display = style.display;
    });

    const width = staticCanvas.width;
    const height = staticCanvas.height;

    if (gifElements.length === 0) {
      console.log("no gifs found");
      // return exportAsPng(elementRef);
      uploadToast.close();
    }

    // 4. Process GIFs from original elements
    const gifData = await Promise.all(
      gifElements.map(async (gifElement) => {
        const response = await fetch(gifElement.src);
        const buffer = await response.arrayBuffer();
        const gif = parseGIF(buffer);
        const frames = decompressFrames(gif, true);

        return {
          element: gifElement,
          frames,
          rect: gifElement.getBoundingClientRect(),
          containerRect: elementRef.current.getBoundingClientRect(),
        };
      })
    );

    // 5. Initialize GIF encoder
    const gifEncoder = new GIF({
      workers: 2,
      quality: 15,
      width,
      height,
      workerScript: "/gif.worker.js",
      transparent: 0x000000,
      dither: "Atkinson-serpentine",
    });

    gifEncoder.on("progress", (p) => {
      // Update later
      uploadToast.update({ progress: (p * 100).toFixed(1) });
    });

    // 6. Process frames
    const frameCount = Math.max(...gifData.map((g) => g.frames.length));
    for (let i = 0; i < frameCount; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      // Draw animated GIF frames
      gifData.forEach(({ element, frames, rect, containerRect }) => {
        const frame = frames[i % frames.length];
        if (!frame) return;

        const x = rect.left - containerRect.left;
        const y = rect.top - containerRect.top;
        const imgWidth = element.clientWidth;
        const imgHeight = element.clientHeight;

        const imageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        );

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = frame.dims.width;
        tempCanvas.height = frame.dims.height;
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.putImageData(imageData, 0, 0);

        ctx.drawImage(tempCanvas, x, y, imgWidth, imgHeight);
      });

      const delay = gifData.reduce((min, { frames }) => {
        const frame = frames[i % frames.length];
        return frame ? Math.min(min, frame.delay) : min;
      }, 100);

      gifEncoder.addFrame(ctx, { delay });
      // Draw static background
      ctx.drawImage(staticCanvas, 0, 0);
    }

    // 7. Render and download
    return new Promise((resolve) => {
      gifEncoder.on("finished", (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileName || "product"}-landing.gif`;
        a.click();
        uploadToast.close();
        resolve();
      });
      gifEncoder.render();
    });
  } catch (error) {
    console.error("GIF export failed:", error);
    uploadToast.close();
    throw error;
  }
};

export const exportToPng = async (elementRef, fileName) => {
  const canvas = await html2canvas(elementRef.current);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName || "product"}-landing.png`;
  a.click();
};

export const exportToJpeg = async (elementRef, fileName) => {
  const canvas = await html2canvas(elementRef.current);
  const url = canvas.toDataURL("image/jpeg", 0.8);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName || "product"}-landing.jpg`;
  a.click();
};
