import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/ui/Button";
import Stars from "../components/animations/Stars";
import ShootingStars from "../components/animations/ShootingStars";
import AuthModal from "../components/AuthModal";

const TITLE_TEXT_SHADOW = [
  "0px 0px 12px rgba(255,255,255,0.6)",
  "0px 0px 22px rgba(255,255,255,1)",
  "0px 0px 16px rgba(255,255,255,0.8)",
  "0px 0px 20px rgba(255,255,255,1)",
  "0px 0px 14px rgba(255,255,255,0.7)",
];

const SUBTITLE_TEXT_SHADOW = [
  "0px 0px 5px rgba(255,255,255,0.4)",
  "0px 0px 12px rgba(255,255,255,0.8)",
  "0px 0px 18px rgba(255,255,255,0.5)",
  "0px 0px 10px rgba(255,255,255,0.7)",
  "0px 0px 7px rgba(255,255,255,0.6)",
];

const TITLE_TRANSITION = {
  duration: 15,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut",
};

const SUBTITLE_TRANSITION = {
  duration: 18,
  repeat: Infinity,
  repeatType: "mirror" as const,
  ease: "easeInOut",
};

const Splash = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleEnterClick = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/splash-bg.jpg')" }}
    >
      <div className="absolute inset-0 z-0">
        <Stars />
        <ShootingStars />
      </div>

      <AnimatePresence>
        {!isAuthModalOpen && (
          <motion.div
            key="titles"
            className="absolute top-[15%] flex flex-col items-center text-center w-[853px] h-[214px] z-10"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.h1
              className="text-[110px] font-title text-white leading-none tracking-wide w-full"
              animate={{ textShadow: TITLE_TEXT_SHADOW }}
              transition={TITLE_TRANSITION}
            >
              Mythos
            </motion.h1>
            <motion.p
              className="text-[64px] font-subtitle text-gray-200 leading-none w-[989px]"
              animate={{ textShadow: SUBTITLE_TEXT_SHADOW }}
              transition={SUBTITLE_TRANSITION}
            >
              Forge Your Legend
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isAuthModalOpen && (
        <div className="absolute top-[60%] transform -translate-y-1/2 z-10">
          <Button
            text="Enter"
            onClick={handleEnterClick}
            textColor="text-[#453245]"
          />
        </div>
      )}

      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            key="modal"
            className="fixed inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseModal} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Splash;
