import { useState } from "react";
import generateMarketingCopy from "../api/generateCopy";

export const usePreviewData = () => {
  const [previewData, setPreviewData] = useState({
    mainHeader: "Main Header",
    demoDescription: "Demo Description",
    features: [],
    highlights: [],
    images: Array(6).fill("https://placehold.co/900?text=Product+Image"),
  });

  const updatePreviewData = async (
    productName,
    productDescription,
    tone,
    language
  ) => {
    const productCopy = await generateMarketingCopy(
      productName,
      productDescription,
      tone,
      language
    );
    // console.log(productName, productDescription);
    setPreviewData(productCopy);
  };

  return { previewData, updatePreviewData };
};
