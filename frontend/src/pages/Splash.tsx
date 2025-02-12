import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Stars from "../components/animations/Stars"; // ✅ Import Stars component
import ShootingStars from "../components/animations/ShootingStars"; // ✅ Import ShootingStars component

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/splash-bg.jpg')" }}
    >
      {/* Background Animations */}
      <div className="absolute inset-0 z-0">
        <Stars />
        <ShootingStars />
      </div>

      {/* Title + Subtitle with Animated Glow Effect */}
      <div className="absolute top-[15%] flex flex-col items-center text-center w-[853px] h-[214px] z-10">
        <motion.h1
          className="text-[110px] font-title text-white leading-none tracking-wide w-full"
          animate={{
            textShadow: [
              "0px 0px 12px rgba(255,255,255,0.6)",
              "0px 0px 22px rgba(255,255,255,1)",
              "0px 0px 16px rgba(255,255,255,0.8)",
              "0px 0px 20px rgba(255,255,255,1)",
              "0px 0px 14px rgba(255,255,255,0.7)",
            ],
          }}
          transition={{
            duration: 15, // ✅ Slower, more mystical glow
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          Mythos
        </motion.h1>

        <motion.p
          className="text-[64px] font-subtitle text-gray-200 leading-none w-[989px]"
          animate={{
            textShadow: [
              "0px 0px 5px rgba(255,255,255,0.4)",
              "0px 0px 12px rgba(255,255,255,0.8)",
              "0px 0px 18px rgba(255,255,255,0.5)",
              "0px 0px 10px rgba(255,255,255,0.7)",
              "0px 0px 7px rgba(255,255,255,0.6)",
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          Forge Your Legend
        </motion.p>
      </div>

      {/* Button */}
      <div className="absolute top-[60%] transform -translate-y-1/2 z-10">
      <Button text="Enter" onClick={() => navigate("/home")} textColor="text-[#453245]" />
      </div>
    </div>
  );
};

export default Splash;