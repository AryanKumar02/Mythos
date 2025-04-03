import React from "react";
import termsAndConditions from "../components/Terms"; 

const TermsPage: React.FC = () => {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: "url('/assets/splash-bg.jpg')",
      }}
    >
      <div className="relative z-10 max-w-4xl p-8 bg-grey bg-opacity-10 rounded-2xl shadow-xl text-white overflow-hidden">
        <h1 className="text-3xl font-bold mb-4 text-center">Terms & Conditions</h1>
        <div className="max-h-[500px] overflow-y-auto p-4 text-sm leading-relaxed">
          <pre className="whitespace-pre-wrap">{termsAndConditions}</pre>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
