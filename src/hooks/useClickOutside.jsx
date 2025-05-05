import { useCallback, useEffect, useState } from "react";

export const useClickOutside = (ref) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClickOutside = useCallback(
    (event) => {
      // Add null checks
      if (!ref.current || !event.target) return;

      // Check if clicked outside
      if (!ref.current.contains(event.target)) {
        setIsClicked(true);
      }
    },
    [ref]
  );

  useEffect(() => {
    // Only add listener if ref exists
    if (!ref.current) return;

    // Use capture phase to catch events earlier
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [handleClickOutside, ref]); // Add ref to dependencies

  return [isClicked, setIsClicked];
};
