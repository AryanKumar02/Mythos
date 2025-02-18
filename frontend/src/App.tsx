import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import TermsPage from "./pages/Terms";// Import the Terms & Conditions page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/terms" element={<TermsPage />} /> {/* Added Terms Page */}
      </Routes>
    </Router>
  );
}

export default App;