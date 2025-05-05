import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/Toast.css";
import {
  FaCircleCheck,
  FaCircleInfo,
  FaCircleQuestion,
  FaCircleXmark,
  FaTriangleExclamation,
  FaXmark,
} from "react-icons/fa6";
import { createRoot } from "react-dom/client";

const Toast = ({ open = false, message, type, duration, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer =
      duration &&
      setTimeout(() => {
        console.log("done");

        setIsVisible(false);
        onClose?.();
      }, duration);

    return () => duration && clearTimeout(timer);
  }, [duration, onClose, open]);

  useEffect(() => {
    return () => {
      if (open) {
        console.log(open);

        setIsVisible(open);
      }
    };
  }, [open]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCircleCheck />;
      case "error":
        return <FaCircleXmark />;
      case "warning":
        return <FaTriangleExclamation />;
      case "info":
        return <FaCircleInfo />;
      default:
        return <FaCircleQuestion />;
    }
  };

  return (
    isVisible && (
      <div className={`toast toast-${type} ${isVisible ? "show" : "hide"}`}>
        <div className="toast-icon">{getIcon()}</div>
        <div className="toast-content">
          <p>{message}</p>
        </div>
        <button
          className="toast-close"
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
        >
          <FaXmark />
        </button>
      </div>
    )
  );
};

// const ProgressToast = ({
//   progress = 0, // Expects 0-100
//   message = "Processing...",
//   onClose,
// }) => {
//   const [progressState, setProgressState] = useState(progress);

//   useEffect(() => {
//     setProgressState(progress);
//   }, [progress]);

//   return progressToast(message, progressState, onClose);
// };

// const progressToast = (message, progress, onClose) => {
//   return React.cloneElement(
//     <div className={`progress-toast`}>
//       <div className="toast-content">
//         <p>{message}</p>
//         <div className="progress-track">
//           <div className="progress-bar" style={{ width: `${progress}%` }} />
//         </div>
//       </div>
//       {onClose && progress && (
//         <button className="toast-close" onClick={onClose}>
//           <FaXmark />
//         </button>
//       )}
//     </div>,
//     document.body
//   );
// };

let progressContainer;
let root;

const setupprogressContainer = () => {
  progressContainer = document.createElement("div");
  progressContainer.className = "toast-container";
  document.body.appendChild(progressContainer);
  root = createRoot(progressContainer);
};

// Base Toast Component
const ToastComponent = ({ message, progress, onClose }) => (
  <div className="progress-toast">
    <div className="toast-content">
      <p>{message}</p>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
    {onClose && (
      <button className="toast-close" onClick={onClose}>
        <FaXmark />
      </button>
    )}
  </div>
);

// Imperative function
export const progressToast = (config) => {
  if (!progressContainer) setupprogressContainer();

  const toastId = `toast-${Date.now()}`;
  const toastElement = document.createElement("div");
  toastElement.id = toastId;
  progressContainer.appendChild(toastElement);
  const toastRoot = createRoot(toastElement);

  let currentConfig = { ...config };

  const render = () => {
    toastRoot.render(<ToastComponent {...currentConfig} onClose={close} />);
  };

  const update = (newConfig) => {
    currentConfig = { ...currentConfig, ...newConfig };
    render();
  };

  const close = () => {
    setTimeout(() => {
      toastRoot.unmount();
      toastElement.remove();
    }, 300); // Allow exit animation
    currentConfig.onClose?.();
  };

  render();

  return { update, close };
};

// Declarative Component
const ProgressToast = (props) => {
  useEffect(() => {
    if (typeof props.progress !== "undefined") {
      const toastInstance = progressToast(props);
      return () => toastInstance.close();
    }
  }, [props]);

  return null;
};

export { Toast, ProgressToast };
