import { parseGIF, decompressFrames } from "gifuct-js";
import GIF from "gif.js";
import html2canvas from "html2canvas";
import { progressToast } from "../components/toast/toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// export const exportToGif = async (elementRef, fileName) => {
//   const uploadToast = progressToast({
//     message: "Rendering progress...",
//     progress: 0,
//   });
//   try {
//     // 1. Verify element exists
//     if (!elementRef.current) {
//       throw new Error("Element reference is not available");
//     }

//     // 2. Alternative to cloning - store original styles
//     const originalStyles = [];
//     const gifElements = Array.from(
//       elementRef.current.querySelectorAll('[data-mediatype="gif"]')
//     );

//     // 3. Capture static content without GIFs
//     const staticCanvas = await html2canvas(elementRef.current, {
//       width: elementRef.current.clientWidth,
//       height: elementRef.current.clientHeight,
//       scale: 1,
//       logging: false,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: null,
//       onclone: (document, element) => {
//         Array.from(element.querySelectorAll('[data-mediatype="gif"]')).forEach(
//           (el) => {
//             el.style.opacity = "0";
//           }
//         );
//       },
//     });

//     // Restore original styles immediately
//     originalStyles.forEach((style) => {
//       style.element.style.display = style.display;
//     });

//     const width = staticCanvas.width;
//     const height = staticCanvas.height;

//     if (gifElements.length === 0) {
//       console.log("no gifs found");
//       // return exportAsPng(elementRef);
//       uploadToast.close();
//     }

//     // 4. Process GIFs from original elements
//     const gifData = await Promise.all(
//       gifElements.map(async (gifElement) => {
//         const response = await fetch(gifElement.src);
//         const buffer = await response.arrayBuffer();
//         const gif = parseGIF(buffer);
//         const frames = decompressFrames(gif, true);

//         return {
//           element: gifElement,
//           frames,
//           rect: gifElement.getBoundingClientRect(),
//           containerRect: elementRef.current.getBoundingClientRect(),
//         };
//       })
//     );

//     // 5. Initialize GIF encoder
//     const gifEncoder = new GIF({
//       workers: 2,
//       quality: 15,
//       width,
//       height,
//       workerScript: "/gif.worker.js",
//       transparent: 0x000000,
//       dither: "Atkinson-serpentine",
//     });

//     gifEncoder.on("progress", (p) => {
//       // Update later
//       uploadToast.update({ progress: (p * 100).toFixed(1) });
//     });

//     // 6. Process frames
//     const frameCount = Math.max(...gifData.map((g) => g.frames.length));
//     for (let i = 0; i < frameCount; i++) {
//       const canvas = document.createElement("canvas");
//       canvas.width = width;
//       canvas.height = height;
//       const ctx = canvas.getContext("2d");

//       // Draw animated GIF frames
//       gifData.forEach(({ element, frames, rect, containerRect }) => {
//         const frame = frames[i % frames.length];
//         if (!frame) return;

//         const x = rect.left - containerRect.left;
//         const y = rect.top - containerRect.top;
//         const imgWidth = element.clientWidth;
//         const imgHeight = element.clientHeight;

//         const imageData = new ImageData(
//           new Uint8ClampedArray(frame.patch),
//           frame.dims.width,
//           frame.dims.height
//         );

//         const tempCanvas = document.createElement("canvas");
//         tempCanvas.width = frame.dims.width;
//         tempCanvas.height = frame.dims.height;
//         const tempCtx = tempCanvas.getContext("2d");
//         tempCtx.putImageData(imageData, 0, 0);

//         ctx.drawImage(tempCanvas, x, y, imgWidth, imgHeight);
//       });

//       const delay = gifData.reduce((min, { frames }) => {
//         const frame = frames[i % frames.length];
//         return frame ? Math.min(min, frame.delay) : min;
//       }, 100);

//       gifEncoder.addFrame(ctx, { delay });
//       // Draw static background
//       ctx.drawImage(staticCanvas, 0, 0);
//     }

//     // 7. Render and download
//     return new Promise((resolve) => {
//       gifEncoder.on("finished", (blob) => {
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = `${fileName || "product"}-landing.gif`;
//         a.click();
//         uploadToast.close();
//         resolve();
//       });
//       gifEncoder.render();
//     });
//   } catch (error) {
//     console.error("GIF export failed:", error);
//     uploadToast.close();
//     throw error;
//   }
// };

export const exportToGif = async (elementRef, fileName) => {
  const uploadToast = progressToast({
    message: "Preparing sections...",
    progress: 0,
  });

  try {
    if (!elementRef.current) {
      throw new Error("Element reference is not available");
    }

    const zip = new JSZip();
    const sections = Array.from(
      elementRef.current.querySelectorAll(".section")
    );

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionName = section.id || `section-${i + 1}`;
      const gifElements = Array.from(
        section.querySelectorAll('[data-mediatype="gif"]')
      );

      uploadToast.update({
        message: `Processing ${sectionName}...`,
        progress: (i / sections.length) * 100,
      });

      if (gifElements.length > 0) {
        // 1. First capture the static background (without GIF elements visible)
        const staticCanvas = await html2canvas(section, {
          width: section.clientWidth,
          height: section.clientHeight,
          scale: 1,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          onclone: (doc, el) => {
            Array.from(el.querySelectorAll('[data-mediatype="gif"]')).forEach(
              (gifEl) => {
                gifEl.style.visibility = "hidden";
              }
            );
          },
        });

        // 2. Process all GIF elements
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
              containerRect: section.getBoundingClientRect(),
            };
          })
        );

        // 3. Create animated GIF with proper frame composition
        const gifBlob = await new Promise((resolve) => {
          const gifEncoder = new GIF({
            workers: 2,
            quality: 15,
            width: staticCanvas.width,
            height: staticCanvas.height,
            workerScript: "/gif.worker.js",
            transparent: 0x000000, // Black as transparent color
            dither: "Atkinson-serpentine", // Best quality dithering
            repeat: 0, // 0 = no repeat, -1 = infinite loop
            background: "#FFFFFF", // Fallback background color
            debug: false, // Disable for production
          });

          const frameCount = Math.max(...gifData.map((g) => g.frames.length));

          for (let frameIndex = 0; frameIndex < frameCount; frameIndex++) {
            const frameCanvas = document.createElement("canvas");
            frameCanvas.width = staticCanvas.width;
            frameCanvas.height = staticCanvas.height;
            const ctx = frameCanvas.getContext("2d");

            // Then draw each animated element at current frame
            gifData.forEach(({ element, frames, rect, containerRect }) => {
              const frame = frames[frameIndex % frames.length];
              if (!frame) return;

              const x = rect.left - containerRect.left;
              const y = rect.top - containerRect.top;

              // Create temporary canvas for this frame
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = frame.dims.width;
              tempCanvas.height = frame.dims.height;
              const tempCtx = tempCanvas.getContext("2d");

              // Put the frame data
              tempCtx.putImageData(
                new ImageData(
                  new Uint8ClampedArray(frame.patch),
                  frame.dims.width,
                  frame.dims.height
                ),
                0,
                0
              );

              // Draw onto main canvas at correct position
              ctx.drawImage(
                tempCanvas,
                x,
                y,
                element.clientWidth,
                element.clientHeight
              );
            });

            // Add frame to GIF with proper delay
            gifEncoder.addFrame(frameCanvas, {
              delay: gifData.reduce((min, { frames }) => {
                const frame = frames[frameIndex % frames.length];
                return frame ? Math.min(min, frame.delay) : min;
              }, 100),
            });

            // draw static background
            ctx.drawImage(staticCanvas, 0, 0);
          }

          gifEncoder.on("finished", resolve);
          gifEncoder.render();
        });

        zip.file(`${sectionName}.gif`, gifBlob);
      } else {
        // Process static section as PNG
        const canvas = await html2canvas(section, {
          width: section.clientWidth,
          height: section.clientHeight,
          scale: 1,
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
        });

        const pngBlob = await new Promise((resolve) => {
          canvas.toBlob(resolve, "image/png", 1.0);
        });

        zip.file(`${sectionName}.png`, pngBlob);
      }
    }

    // Generate ZIP
    const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
      uploadToast.update({
        message: "Creating ZIP file...",
        progress: metadata.percent.toFixed(1),
      });
    });

    saveAs(content, `${fileName || "sections"}.zip`);
    uploadToast.close();
  } catch (error) {
    console.error("Export failed:", error);
    uploadToast.close();
    throw error;
  }
};

export const exportToPng = async (elementRef, fileName) => {
  const uploadToast = progressToast({
    message: "Preparing PNG sections...",
    progress: 0,
  });

  try {
    if (!elementRef.current) {
      throw new Error("Element reference is not available");
    }

    const zip = new JSZip();
    const sections = Array.from(
      elementRef.current.querySelectorAll(".section")
    );

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionName = section.id || `section-${i + 1}`;

      uploadToast.update({
        message: `Processing ${sectionName}...`,
        progress: (i / sections.length) * 80, // Reserve 20% for ZIP creation
      });

      const canvas = await html2canvas(section, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      });

      const pngBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1.0); // Maximum quality
      });

      zip.file(`${sectionName}.png`, pngBlob);
    }

    // Generate ZIP
    const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
      uploadToast.update({
        message: "Creating ZIP file...",
        progress: 80 + metadata.percent * 0.2, // Last 20% for ZIP
      });
    });

    saveAs(content, `${fileName || "sections"}.zip`);
    uploadToast.close();
  } catch (error) {
    console.error("PNG export failed:", error);
    uploadToast.close();
    throw error;
  }
};

export const exportToJpeg = async (elementRef, fileName) => {
  const uploadToast = progressToast({
    message: "Preparing JPEG sections...",
    progress: 0,
  });

  try {
    if (!elementRef.current) {
      throw new Error("Element reference is not available");
    }

    const zip = new JSZip();
    const sections = Array.from(
      elementRef.current.querySelectorAll(".section")
    );

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionName = section.id || `section-${i + 1}`;

      uploadToast.update({
        message: `Processing ${sectionName}...`,
        progress: (i / sections.length) * 80, // Reserve 20% for ZIP creation
      });

      const canvas = await html2canvas(section, {
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff", // JPEG needs background
      });

      const jpegBlob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.92); // High quality
      });

      zip.file(`${sectionName}.jpg`, jpegBlob);
    }

    // Generate ZIP
    const content = await zip.generateAsync({ type: "blob" }, (metadata) => {
      uploadToast.update({
        message: "Creating ZIP file...",
        progress: 80 + metadata.percent * 0.2, // Last 20% for ZIP
      });
    });

    saveAs(content, `${fileName || "sections"}.zip`);
    uploadToast.close();
  } catch (error) {
    console.error("JPEG export failed:", error);
    uploadToast.close();
    throw error;
  }
};
