import React, { useEffect, useState } from "react";
import Form from "../../components/Form/Form";
import Preview from "../../components/Preview/Preview";
import ExportMenu from "../../components/ExportMenu/ExportMenu";
import ExportOption from "../../components/ExportMenu/ExportOption";
import {
  FormTextArea,
  FormInput,
  FormSelect,
} from "../../components/Form/FormInput";
import { useToast } from "./ToastContainer";
import { ProgressToast, Toast } from "../../components/toast/toast";
import TemplateSelector from "../../components/templates/templateSelector";
import { withTemplate } from "../../middlewares/withTemplate";
import SimpleTemplate from "../../components/templates/simpleTemplate";
import { FaArrowLeft } from "react-icons/fa6";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import { setCss } from "../../helpers/cssStyleValueHelper";
import { TemplateComponents } from "../../components/templates/templateConfig";

const previewDataExample = {
  mainHeader: "Découvrez notre Écarteur Nasal",
  demoDescription:
    "Libérez votre respiration et profitez d'un quotidien sans inconfort, même en cas de congestion nasale.",
  features: [
    {
      title: "Soulagement Instantané",
      description:
        "Soulage les congestions nasales dues au rhume ou aux allergies.",
      icon: "FaCheckCircle",
      fallbackIcon: "HiOutlineCheck",
    },
    {
      title: "Respiration Optimale",
      description:
        "Ouvre vos voies nasales pour faciliter une respiration fluide toute la journée.",
      icon: "MdAirlineSeatReclineNormal",
      fallbackIcon: "FiWind",
    },
    {
      title: "Bien-Être Général",
      description:
        "Favorise un meilleur apport en oxygène pour un bien-être général.",
      icon: "HiOutlineSparkles",
      fallbackIcon: "FiSmile",
    },
    {
      title: "Confort Absolu",
      description:
        "Réduit l'inconfort lié à la respiration difficile, vous permettant de rester actif et concentré.",
      icon: "MdMood",
      fallbackIcon: "FiHeart",
    },
  ],
  highlights: [
    {
      title: "Nuits Paisibles",
      subtitle:
        "Réduisez efficacement les ronflements et améliorez votre sommeil.",
    },
    {
      title: "Performances Sportives",
      subtitle:
        "Augmentez votre endurance et réduisez la fatigue pendant l'effort.",
    },
    {
      title: "Facile à Utiliser",
      subtitle:
        "Simplifiez votre routine avec une solution pratique qui agit en quelques secondes.",
    },
  ],
  dimensionsNote:
    "Dimensions compactes pour une utilisation facile et discrète.",
};

const LandingPageView = ({
  previewData,
  updatePreviewData,
  handleExport,
  isExporting,
  previewRef,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = React.useState(true);
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    language: "french",
    template: {
      id: TemplateComponents[0].id,
      name: TemplateComponents[0].name,
      component: TemplateComponents[0].component,
      thumbnail: TemplateComponents[0].thumbnail,
    },
  });
  const [displayOption, setDisplayOption] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await updatePreviewData(
        formData.productName,
        formData.productDescription,
        "professional",
        formData.language
      );
      // console.log(formData.template);
      setShowPreview(true);
    } catch (error) {
      setError(error.message);
      setShowPreview(false);
    } finally {
      setIsLoading(false);
    }
  };

  const switchDisplaySize = (index) => {
    switch (index) {
      case 0:
        setCss("--option-index", 0);
        setDisplayOption("small-layout");
        break;
      case 1:
        setCss("--option-index", 1);
        setDisplayOption("large-layout");
        break;
      default:
        setCss("--option-index", 0);
        setDisplayOption("small-layout");
        break;
    }
  };

  return (
    <>
      <div className="container">
        {!isLoading && !error && !showPreview && (
          <>
            <h1>Landing Page Generator</h1>
            <div className="view">
              {error && <div className="error-message">{error}</div>}
              <div className="input-section">
                <Form onSubmit={handleSubmit}>
                  <div className="wrapper">
                    <FormInput
                      label="Product Name"
                      id="productName"
                      name="productName"
                      type="text"
                      placeholder="Enter product name"
                      value={formData.productName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target.id]: e.target.value,
                        }))
                      }
                    />

                    <FormTextArea
                      label="Product Description"
                      id="productDescription"
                      name="productDescription"
                      placeholder="Enter product description"
                      value={formData?.productDescription}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target?.id]: e.target.value,
                        }))
                      }
                    />

                    <FormSelect
                      label="Language"
                      id="language"
                      name="language"
                      placeholder="Select language"
                      value={formData?.language}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [e.target?.id]: e.target.value,
                        }))
                      }
                    >
                      <FormSelect.Options value={"french"} label={"French"} />
                      <FormSelect.Options value={"arabic"} label={"Arabic"} />
                      <FormSelect.Options value={"english"} label={"English"} />
                    </FormSelect>

                    <TemplateSelector
                      onSelect={(select) =>
                        setFormData((prev) => ({ ...prev, template: select }))
                      }
                    />

                    {formData.template.thumbnail && (
                      <a href={formData.template.thumbnail} target="_blank">
                        See Example
                      </a>
                    )}

                    {/* Other form inputs */}
                    {/* ... */}

                    <button type="submit" className="btn">
                      Generate AI Copy
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </>
        )}
        {isLoading && !error && !showPreview && (
          <div className="loader-screen">
            <div className="loader-wrapper">
              <div className="blob-loader"></div>
              <p>Generating Content...</p>
            </div>
          </div>
        )}
        {showPreview && (
          <>
            <div className="preview-section">
              <div className="section-header">
                <FaArrowLeft
                  size={20}
                  className="previous-icon"
                  onClick={() => setShowPreview(false)}
                />
                <div className="section-header-middle">
                  <h2>Preview</h2>
                  <div className="display-size">
                    <FiSmartphone onClick={() => switchDisplaySize(0)} />
                    <FiMonitor onClick={() => switchDisplaySize(1)} />
                  </div>
                </div>
                <ExportMenu
                  onExport={(type) =>
                    handleExport(type, previewRef, formData.productName)
                  }
                >
                  <ExportOption type="png">PNG (High Quality)</ExportOption>
                  <ExportOption type="jpeg">JPEG (Compressed)</ExportOption>
                  <ExportOption type="gif">GIF (Animated)</ExportOption>
                </ExportMenu>
              </div>
              {/* <ProgressToast message="Processing..." progress={50} /> */}
            </div>
            <Preview
              ref={previewRef}
              displaySize={displayOption}
              templateIndex={1} //formData.template.id
              previewData={previewDataExample}
            />
          </>
        )}
        <Toast
          open={isExporting}
          message={`Exported successfully!`}
          duration={5000}
          type="success"
        />
      </div>
    </>
  );
};

export default LandingPageView;
