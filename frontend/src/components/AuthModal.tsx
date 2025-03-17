import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const containerStyles: React.CSSProperties = {
  width: "443px",
  backgroundColor: "#524456",
  border: "2px solid #756A78",
  borderRadius: "30px",
  color: "white",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  padding: "32px",
  willChange: "transform, opacity",
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
  position: "relative"
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const [passwordFocused, setPasswordFocused] = useState(false);

  const navigate = useNavigate();
  const { signIn, signUp, error, clearError } = useAuth();


  const requirements = useMemo(() => ({
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }), [password]);


  const isSignUpValid = useMemo(() => (
    email.trim() !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    password === confirmPassword &&
    requirements.minLength &&
    requirements.uppercase &&
    requirements.lowercase &&
    requirements.digit &&
    requirements.special &&
    termsChecked
  ), [email, password, confirmPassword, requirements, termsChecked]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    try {
      await signIn(email, password);
      navigate("/dashboard");
      onClose();
    } catch (err) {
      console.error("Error during sign in:", err);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    if (password !== confirmPassword) return;
    try {
      await signUp(username, email, password);
      navigate("/dashboard");
      onClose();
    } catch (err) {
      console.error("Error during sign up:", err);
    }
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 flex items-center justify-center p-8">
      <motion.div
        style={containerStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
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

        {mode === "signIn" && (
          <form onSubmit={handleSignIn} className="flex flex-col items-start w-full">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            {error && <div className="mb-2 text-red-400">{error}</div>}
            {/* Email/Password Input Box for Sign In */}
            <div style={{ width: "383px", height: "126px" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#AEA7B0",
                  border: "3px solid #635667",
                  borderRadius: "30px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                />
                <div style={{ height: "3px", backgroundColor: "#635667" }} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            <button
              type="submit"
              style={{ width: "383px", borderRadius: "30px" }}
              className="p-2 mt-4 text-center bg-[#F5EFF7] text-[#453245] rounded hover:bg-[#e0d7ee] transition-colors duration-200"
            >
              Sign In
            </button>
            <div className="mt-4 text-sm w-full">
              <button
                type="button"
                onClick={() => setMode("signUp")}
                className="text-gray-300 hover:text-white"
              >
                Create an Account
              </button>
            </div>
          </form>
        )}

        {mode === "signUp" && (
          <form onSubmit={handleSignUp} className="flex flex-col items-start w-full">
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            {error && <div className="mb-2 text-red-400">{error}</div>}
            <button
              type="button"
              className="absolute top-4 left-4 text-gray-300 hover:text-white"
              onClick={onClose}
            >
              ←
            </button>
            {/* Username Input */}
            <div className="w-[383px] mb-4">
              <div className="bg-[#AEA7B0] border border-[#635667] rounded-[30px] overflow-hidden flex items-center px-4 h-[63px]">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>
            {/* Container for Email & Password */}
            <div style={{ width: "383px", height: "126px" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#AEA7B0",
                  border: "3px solid #635667",
                  borderRadius: "30px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                />
                <div style={{ height: "3px", backgroundColor: "#635667" }} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            {/* Separate container for Confirm Password */}
            <div style={{ width: "383px", height: "63px" }} className="mt-4">
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#AEA7B0",
                  border: "3px solid #635667",
                  borderRadius: "30px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ height: "100%" }}
                  className="px-4 bg-transparent focus:outline-none"
                />
              </div>
            </div>
            {/* Terms and Conditions Checkbox with Link */}
            <div className="flex items-center mt-4 mb-4">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e) => setTermsChecked(e.target.checked)}
                id="terms"
              />
              <label htmlFor="terms" className="ml-2">
                I agree with{" "}
                <Link to="/terms" className="text-blue-500 underline">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {/* Password Requirements Panel */}
            {(passwordFocused || password.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <ul className="text-sm">
                  <li className="flex items-center">
                    {requirements.minLength ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✕</span>
                    )}
                    <span className="ml-2">At least 8 characters</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.uppercase ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✕</span>
                    )}
                    <span className="ml-2">At least one uppercase letter</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.lowercase ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✕</span>
                    )}
                    <span className="ml-2">At least one lowercase letter</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.digit ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✕</span>
                    )}
                    <span className="ml-2">At least one digit</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.special ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-red-500">✕</span>
                    )}
                    <span className="ml-2">At least one special character</span>
                  </li>
                </ul>
              </motion.div>
            )}
            <button
              type="submit"
              style={{ width: "383px", borderRadius: "30px" }}
              className="p-2 mt-2 text-center bg-[#F5EFF7] text-[#453245] rounded hover:bg-[#e0d7ee] transition-colors duration-200"
              disabled={!isSignUpValid}
            >
              Create Account
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthModal;
