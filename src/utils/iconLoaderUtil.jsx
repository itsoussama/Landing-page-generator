// components/IconLoader.jsx
import React from "react";
import { FaQuestionCircle } from "react-icons/fa";

const ICON_SETS = {
  fa: () => import("react-icons/fa"),
  md: () => import("react-icons/md"),
  hi: () => import("react-icons/hi"),
  fi: () => import("react-icons/fi"),
  ai: () => import("react-icons/ai"),
  // Add more sets as needed
};

const IconLoader = ({
  iconData,
  size = 20,
  color = "currentColor",
  className = "",
  ...props
}) => {
  const [Icon, setIcon] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);

    const loadIcon = async () => {
      try {
        // 1. Try primary icon first
        if (iconData?.icon) {
          const prefix = iconData.icon.slice(0, 2).toLowerCase();
          const iconSet = ICON_SETS[prefix] || ICON_SETS.fa;
          const module = await iconSet();

          if (mounted && module[iconData.icon]) {
            setIcon(() => module[iconData.icon]);
            setLoading(false);
            return; // Exit if primary icon found
          }
        }

        // 2. Only try fallback if primary not found
        if (iconData?.fallbackIcon) {
          const prefix = iconData.fallbackIcon.slice(0, 2).toLowerCase();
          const iconSet = ICON_SETS[prefix] || ICON_SETS.fa;
          const module = await iconSet();

          if (mounted && module[iconData.fallbackIcon]) {
            setIcon(() => module[iconData.fallbackIcon]);
            setLoading(false);
            return; // Exit if fallback found
          }
        }

        // 3. Only use question mark if both attempts fail
        const { FaQuestionCircle } = await ICON_SETS.fa();
        if (mounted) {
          setIcon(() => FaQuestionCircle);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading icon:", error);
        if (mounted) {
          setIcon(null);
          setLoading(false);
        }
      }
    };

    loadIcon();

    return () => {
      mounted = false;
    };
  }, [iconData]);

  if (loading) {
    return (
      <div
        className={`icon-loader loading ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`icon-loader ${className}`}
      aria-hidden="true"
      style={{
        color,
        display: "inline-flex",
      }}
      {...props}
    >
      {Icon ? <Icon /> : <FaQuestionCircle />}
    </div>
  );
};

export default IconLoader;
