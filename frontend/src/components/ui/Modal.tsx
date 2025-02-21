import React from "react";
import ReactDOM from "react-dom";
import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-60" />
      {/* Modal Container */}
      <motion.div
        className="relative bg-[#524456] border border-[#756A78] rounded-[30px] text-white flex flex-col items-center justify-center p-8 w-full max-w-lg mx-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        {title && (
          <div className="w-full text-center mb-4">
            <h3 className="text-2xl font-bold">{title}</h3>
          </div>
        )}
        <div className="w-full">{children}</div>
      </motion.div>
    </div>,
    document.body
  );
};

export default Modal;