import React, { useState } from "react";
import {
  getMediaType,
  handleImageChange,
} from "../../helpers/imageChangeHelper";
import "./styles/RegularTemplateStyle.css";
import IconLoader from "../../utils/iconLoaderUtil";
import { FaCartShopping } from "react-icons/fa6";
import { FaArrowCircleRight } from "react-icons/fa";

const defaultFeatures = [
  {
    title: "Feature 1",
    description: "Description 1",
    icon: "wifi",
    fallbackIcon: "wifi",
  },
  {
    title: "Feature 2",
    description: "Description 2",
    icon: "sun",
    fallbackIcon: "sun",
  },
  {
    title: "Feature 3",
    description: "Description 3",
    icon: "broom",
    fallbackIcon: "broom",
  },
  {
    title: "Feature 4",
    description: "Description 4",
    icon: "leaf",
    fallbackIcon: "leaf",
  },
];

const defaultHighlights = [
  {
    title: "highlights 1",
    subtitle: "Subtitle 1",
  },
  {
    title: "highlights 2",
    subtitle: "Subtitle 2",
  },
  {
    title: "highlights 3",
    subtitle: "Subtitle 3",
  },
];

const RegularTemplate = ({
  mainHeader = "Product Header",
  demoDescription = "Demo Description",
  features = defaultFeatures,
  highlights = defaultHighlights,
  // dimensionsNote = "Dimensions Note",
  initialImages = Array(6).fill("https://placehold.co/900?text=Image+Produit"),
}) => {
  const displayFeatures =
    features && features.length > 0 ? features : defaultFeatures;
  const displayHighlights =
    highlights && highlights.length > 0 ? highlights : defaultHighlights;

  const [images, setImages] = useState(initialImages);

  const handleImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await handleImageChange(index, event, images, setImages);

      // Update mediaType attribute if needed
      changeMediaType(file, index);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const changeMediaType = (file, index) => {
    const imgElement = document.querySelector(`[data-image-index="${index}"]`);

    if (imgElement) {
      if (getMediaType(file) === "gif") {
        imgElement.dataset.mediatype = "gif";
      } else {
        imgElement.dataset.mediatype = "image";
      }
    }
  };

  return (
    <div className="template-container regular bg-color">
      {/* HEADER SECTION */}
      <div data-section={1}>
        <div className="header-section">
          <h1 className="main-title">{mainHeader}</h1>
          <div className="product-image-container">
            <span className="image-label">Image 1</span>
            <img
              className="product-image"
              src={images[0]}
              data-image-index={0}
              alt="Product"
              data-mediatype="image"
            />
            <input
              id="product-image-input-1"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => handleImageUpload(0, e)}
            />
            <label htmlFor="product-image-input-1" className="edit-image-btn">
              <i className="fas fa-edit"></i> Modifier
            </label>
          </div>
        </div>
        <div className="filler">
          <p className="description">{demoDescription}</p>
        </div>
      </div>

      {/* DEMO SECTION */}
      <div data-section={2}>
        <div className="demo-section">
          <div className="product-image-container">
            <span className="image-label">Image 2</span>
            <img
              className="demo-gif"
              src={images[1]}
              data-image-index={1}
              alt="Product Demo"
              data-mediatype="image"
            />
            <input
              id="product-image-input-2"
              type="file"
              style={{ display: "none" }}
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => handleImageUpload(1, e)}
            />
            <label htmlFor="product-image-input-2" className="edit-image-btn">
              <i className="fas fa-edit"></i> Modifier
            </label>
          </div>
        </div>
        <div className="filler"></div>
      </div>

      {/* FEATURES SECTION */}
      <div className="features-section" data-section={3}>
        <div className="features-grid">
          {displayFeatures.map((feature, index) => (
            <div className="feature-item" key={index}>
              <div className="feature-icon">
                <IconLoader
                  key={index}
                  iconData={{
                    icon: feature.icon,
                    fallbackIcon: feature.fallbackIcon,
                  }}
                  className="feature-icon"
                />
              </div>
              <div className="feature-text">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        <a href="#" className="cta-button">
          Acheter Maintenant
          <FaArrowCircleRight size={20} />
        </a>
      </div>
      {/* HIGHLIGHTS SECTIONS */}
      {displayHighlights.map((highlight, index) => (
        <div className="highlight-section" key={index} data-section={index + 4}>
          <div className="highlight-content">
            <h2 className="highlight-title">{highlight.title}</h2>
            <p className="highlight-subtitle">{highlight.subtitle}</p>
          </div>
          <div className="product-image-container">
            <span className="image-label">Image {index + 3}</span>
            <img
              className="highlight-image"
              data-image-index={index + 2}
              src={images[index + 2]}
              alt={`Highlight ${index + 1}`}
              data-mediatype="image"
            />
            <input
              id={`product-image-input-${index + 3}`}
              type="file"
              style={{ display: "none" }}
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => handleImageUpload(index + 2, e)}
            />
            <label
              htmlFor={`product-image-input-${index + 3}`}
              className="edit-image-btn"
            >
              <i className="fas fa-edit"></i> Modifier
            </label>
          </div>
        </div>
      ))}
      <div className="filler"></div>
      {/* DIMENSIONS SECTION */}
      <div className="dimensions-section">
        <div className="product-image-container">
          <span className="image-label">Image 6</span>
          <img
            className="dimensions-image"
            data-image-index={5}
            src={images[5]}
            alt="Product Dimensions"
            data-mediatype="image"
          />
          <input
            id="product-image-input-6"
            type="file"
            style={{ display: "none" }}
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => handleImageUpload(5, e)}
          />
          <label htmlFor="product-image-input-6" className="edit-image-btn">
            <i className="fas fa-edit"></i> Modifier
          </label>
        </div>
      </div>
    </div>
  );
};

export default RegularTemplate;
