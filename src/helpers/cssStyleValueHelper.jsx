/**
 * Gets the value of a CSS custom property (variable)
 * @param {string} varName - The CSS variable name (e.g., "--primary-color")
 * @param {HTMLElement} [element=document.documentElement] - Element to check
 * @returns {string} The variable value
 */
function getCssVariable(varName, element = document.documentElement) {
  return getComputedStyle(element).getPropertyValue(varName).trim();
}

/**
 * Gets the computed value of a CSS property
 * @param {HTMLElement} element - The DOM element
 * @param {string} property - The CSS property name (e.g., "color")
 * @returns {string} The computed style value
 */
function getCssStyle(element, property) {
  return getComputedStyle(element)[property];
}

/**
 * Sets the computed value or a CSS custom property
 * @param {string} property - The CSS property / variable name (e.g., "color", "--primary-color")
 * @param {string} value - The modified CSS value
 * @param {HTMLElement} element - The DOM element (null)
 * @param {string} priority - The priority of the value (eg. "important")
 * @returns {string} The computed style value
 */
function setCss(property, value, element = null, priority = "") {
  // Handle CSS variables
  if (property.startsWith("--")) {
    const target = element || document.documentElement;
    target.style.setProperty(property, value, priority);
    return target;
  }

  // Handle regular properties (requires element)
  if (!element) {
    console.warn("setCss requires an element parameter for regular properties");
    return null;
  }

  element.style[property] = value;
  return element;
}

export { getCssStyle, getCssVariable, setCss };
