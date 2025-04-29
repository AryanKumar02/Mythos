import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [statusMessage, setStatusMessage] = useState("");

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

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
      setStatusMessage(mode === "signIn" ? "Sign in form opened" : "Sign up form opened");
    }
  }, [isOpen, mode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
      if (e.key === 'h' && e.ctrlKey) {
        e.preventDefault();
        setStatusMessage("Press Escape to close the modal, Tab to navigate between fields, and Enter to submit the form");
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setStatusMessage("Attempting to sign in...");
    try {
      await signIn(email, password);
      setStatusMessage("Successfully signed in");
      navigate("/dashboard");
      onClose();
    } catch (err) {
      console.error("Error during sign in:", err);
      setStatusMessage("Sign in failed. Please check your credentials and try again.");
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    if (password !== confirmPassword) {
      setStatusMessage("Passwords do not match");
      return;
    }
    setStatusMessage("Creating your account...");
    try {
      await signUp(username, email, password);
      setStatusMessage("Account created successfully");
      navigate("/dashboard");
      onClose();
    } catch (err) {
      console.error("Error during sign up:", err);
      setStatusMessage("Account creation failed. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 flex items-center justify-center p-8"
      ref={modalRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        style={containerStyles}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
        aria-label="Authentication modal"
      >
        <div
          role="status"
          aria-live="polite"
          className="sr-only"
        >
          {statusMessage}
        </div>

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-white focus:text-black focus:p-4"
        >
          Skip to main content
        </a>

        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white"
          onClick={onClose}
          aria-label="Close modal"
          tabIndex={0}
        >
          ✕
        </button>

        {mode === "signIn" && (
          <form
            onSubmit={handleSignIn}
            className="flex flex-col items-start w-full"
            role="form"
            aria-label="Sign in form"
            id="main-content"
          >
            <h2 id="modal-title" className="text-2xl font-bold mb-4">Sign In</h2>
            {error && (
              <div
                className="mb-2 text-red-400"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                {error}
              </div>
            )}
            <div style={{ width: "383px", height: "126px" }} role="group" aria-label="Sign in credentials">
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
                  ref={firstInputRef}
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                  aria-label="Email address"
                  aria-required="true"
                  required
                  tabIndex={0}
                />
                <div style={{ height: "3px", backgroundColor: "#635667" }} role="separator" aria-hidden="true" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                  aria-label="Password"
                  aria-required="true"
                  required
                  tabIndex={0}
                />
              </div>
            </div>
            <button
              type="submit"
              style={{ width: "383px", borderRadius: "30px" }}
              className="p-2 mt-4 text-center bg-[#F5EFF7] text-[#453245] rounded hover:bg-[#e0d7ee] transition-colors duration-200"
              aria-label="Sign in to your account"
              tabIndex={0}
            >
              Sign In
            </button>
            <div className="mt-4 text-sm w-full">
              <button
                type="button"
                onClick={() => setMode("signUp")}
                className="text-gray-300 hover:text-white"
                aria-label="Switch to sign up form"
                tabIndex={0}
              >
                Create an Account
              </button>
            </div>
          </form>
        )}

        {mode === "signUp" && (
          <form
            onSubmit={handleSignUp}
            className="flex flex-col items-start w-full"
            role="form"
            aria-label="Sign up form"
            id="main-content"
          >
            <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
            {error && (
              <div
                className="mb-2 text-red-400"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                {error}
              </div>
            )}
            <button
              type="button"
              className="absolute top-4 left-4 text-gray-300 hover:text-white"
              onClick={onClose}
              aria-label="Go back to sign in"
              tabIndex={0}
            >
              ←
            </button>
            <div className="w-[383px] mb-4" role="group" aria-label="Username input">
              <div className="bg-[#AEA7B0] border border-[#635667] rounded-[30px] overflow-hidden flex items-center px-4 h-[63px]">
                <input
                  ref={firstInputRef}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                  aria-label="Username"
                  aria-required="true"
                  required
                  tabIndex={0}
                />
              </div>
            </div>
            <div style={{ width: "383px", height: "126px" }} role="group" aria-label="Email and password">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                  aria-label="Email address"
                  aria-required="true"
                  required
                  tabIndex={0}
                />
                <div style={{ height: "3px", backgroundColor: "#635667" }} role="separator" aria-hidden="true" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  style={{ height: "calc(50% - 1.5px)" }}
                  className="px-4 bg-transparent focus:outline-none"
                  aria-label="Password"
                  aria-required="true"
                  required
                  aria-describedby="password-requirements"
                  tabIndex={0}
                />
              </div>
            </div>
            <div style={{ width: "383px", height: "63px" }} className="mt-4" role="group" aria-label="Confirm password">
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  style={{ height: "100%" }}
                  className="px-4 bg-transparent focus:outline-none"
                  aria-label="Confirm password"
                  aria-required="true"
                  required
                  aria-invalid={confirmPassword !== "" && confirmPassword !== password}
                  tabIndex={0}
                />
              </div>
            </div>
            <div className="flex items-center mt-4 mb-4" role="group" aria-label="Terms and conditions">
              <input
                type="checkbox"
                checked={termsChecked}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTermsChecked(e.target.checked)}
                id="terms"
                aria-required="true"
                required
                tabIndex={0}
              />
              <label htmlFor="terms" className="ml-2">
                I agree with{" "}
                <Link to="/terms" className="text-blue-500 underline" aria-label="Read terms and conditions" tabIndex={0}>
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {(passwordFocused || password.length > 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
                id="password-requirements"
                role="status"
                aria-live="polite"
              >
                <ul className="text-sm">
                  <li className="flex items-center">
                    {requirements.minLength ? (
                      <span className="text-green-500" aria-hidden="true">✓</span>
                    ) : (
                      <span className="text-red-500" aria-hidden="true">✕</span>
                    )}
                    <span className="ml-2">At least 8 characters</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.uppercase ? (
                      <span className="text-green-500" aria-hidden="true">✓</span>
                    ) : (
                      <span className="text-red-500" aria-hidden="true">✕</span>
                    )}
                    <span className="ml-2">At least one uppercase letter</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.lowercase ? (
                      <span className="text-green-500" aria-hidden="true">✓</span>
                    ) : (
                      <span className="text-red-500" aria-hidden="true">✕</span>
                    )}
                    <span className="ml-2">At least one lowercase letter</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.digit ? (
                      <span className="text-green-500" aria-hidden="true">✓</span>
                    ) : (
                      <span className="text-red-500" aria-hidden="true">✕</span>
                    )}
                    <span className="ml-2">At least one digit</span>
                  </li>
                  <li className="flex items-center">
                    {requirements.special ? (
                      <span className="text-green-500" aria-hidden="true">✓</span>
                    ) : (
                      <span className="text-red-500" aria-hidden="true">✕</span>
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
              aria-disabled={!isSignUpValid}
              tabIndex={0}
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
