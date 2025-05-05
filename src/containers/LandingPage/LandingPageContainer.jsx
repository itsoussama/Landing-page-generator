import React from "react";
import { usePreviewData } from "../../hooks/usePreviewData";
import { useExport } from "../../hooks/useExport";
import LandingPageView from "./LandingPageView";

const LandingPageContainer = () => {
  const { previewData, updatePreviewData } = usePreviewData();
  const { handleExport, isExporting } = useExport();
  const previewRef = React.useRef();

  return (
    <LandingPageView
      previewData={previewData}
      updatePreviewData={updatePreviewData}
      handleExport={handleExport}
      isExporting={isExporting}
      previewRef={previewRef}
    />
  );
};

export default LandingPageContainer;
