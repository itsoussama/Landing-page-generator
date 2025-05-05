import { useState } from "react";
import { Toast } from "../../components/toast/toast";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, options = {}) => {
    const id = Date.now();
    const newToast = { id, message, ...options };

    setToasts((prev) => [...prev, newToast]);

    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};
