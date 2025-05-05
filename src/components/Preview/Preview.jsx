import React from "react";
import { useTemplate } from "../../context/TemplateContext";
import SimpleTemplate from "../templates/simpleTemplate";
import { withTemplate } from "../../middlewares/withTemplate";
import { TemplateComponents } from "../templates/templateConfig";
import { FormInput, FormSelect } from "../Form/FormInput";

const Preview = React.forwardRef(
  ({ previewData, templateIndex, displaySize = "small-layout" }, ref) => {
    const { template, updateTemplateTheme } = useTemplate();

    const TemplateComponent = TemplateComponents[templateIndex].component;

    return (
      <div
        style={{
          "--primary": template.colors.primary,
          "--secondary": template.colors.secondary,
          "--accent": template.colors.accent,
          "--text-primary": template.textColors.primary,
          "--text-secondary": template.textColors.secondary,
          "--text-accent": template.textColors.accent,
        }}
      >
        {/* Your preview content structure */}
        <div className="custom-options">
          <div className="custom-options-wrapper">
            <FormInput
              label={"Primary Color"}
              containerClassName="input-color"
              value={template.colors?.primary}
              type="color"
              onChange={(e) =>
                updateTemplateTheme({ colors: { primary: e.target.value } })
              }
            />
            <FormInput
              label={"Secondary Color"}
              containerClassName="input-color"
              value={template.colors?.secondary}
              type="color"
              onChange={(e) =>
                updateTemplateTheme({ colors: { secondary: e.target.value } })
              }
            />
            <FormInput
              label={"Accent Color"}
              containerClassName="input-color"
              value={template.colors?.accent}
              type="color"
              onChange={(e) =>
                updateTemplateTheme({ colors: { accent: e.target.value } })
              }
            />

            <FormInput
              label={"Text Primary Color"}
              containerClassName="input-color"
              value={template.textColors?.primary}
              type="color"
              onChange={(e) =>
                updateTemplateTheme({ textColors: { primary: e.target.value } })
              }
            />

            <FormInput
              label={"Text Secondary Color"}
              containerClassName="input-color"
              value={template.textColors?.secondary}
              type="color"
              onChange={(e) =>
                updateTemplateTheme({
                  textColors: { secondary: e.target.value },
                })
              }
            />
          </div>
        </div>
        <hr className="divider" />

        <div className="preview-wrapper">
          {/* <SimpleTemplate {...previewData} /> */}
          <div id="preview-area" className={displaySize} ref={ref}>
            {TemplateComponent ? (
              <TemplateComponent {...previewData} /> // Pass previewData as props
            ) : (
              <div>No template component available</div>
            )}
          </div>
        </div>

        {/* Other sections (features, highlights, etc.) */}
        {/* ... */}
        {/* </div> */}
      </div>
    );
  }
);

export default Preview;
