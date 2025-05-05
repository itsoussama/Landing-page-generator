import { useState } from "react";
import { exportToGif, exportToPng, exportToJpeg } from "../utils/exportUtils";

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type, elementRef, productName) => {
    try {
      switch (type) {
        case "gif":
          await exportToGif(elementRef, productName);
          setIsExporting(true);
          break;
        case "png":
          await exportToPng(elementRef, productName);
          setIsExporting(true);
          break;
        case "jpeg":
          await exportToJpeg(elementRef, productName);
          setIsExporting(true);
          break;
        default:
          throw new Error("Unsupported export type");
      }
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
    } finally {
      setTimeout(() => {
        setIsExporting(false);
      }, 100);
    }
  };

  return { handleExport, isExporting };
};
