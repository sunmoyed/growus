import React, { useLayoutEffect } from "react";

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode | string;
  onClose?: () => void;
}) {
  // Call hook to lock body scroll
  useLockBodyScroll();

  return (
    <div className="modal-background" onClick={onClose}>
      <div className="modal-container">
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
export default Modal;

// Prevent the background from scrolling while the modal is overlaid.
// https://usehooks.com/useLockBodyScroll/
function useLockBodyScroll() {
  useLayoutEffect(() => {
    // Get original body overflow
    const originalStyle = window.getComputedStyle(document.body).overflow;

    // Prevent scrolling on mount
    document.body.style.overflow = "hidden";

    // Re-enable scrolling when component unmounts
    return () => (document.body.style.overflow = originalStyle);
  }, []); // Empty array ensures effect is only run on mount and unmount
}
