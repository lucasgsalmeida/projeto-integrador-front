import React from "react";
import { createRoot } from "react-dom/client"; // Importando createRoot
import App from "./App.jsx";
import "./index.css";
import { ContextLoginProvider } from "./context/LoginContext.jsx";
import { ContextUserClientProvider } from "./context/ContextUsuarioEscritorio.jsx";
import { BrowserRouter as Router } from "react-router-dom";  // Importando Router

// Certifique-se de usar 'createRoot' corretamente
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <ContextUserClientProvider>
        <ContextLoginProvider>
          <App />
        </ContextLoginProvider>
      </ContextUserClientProvider>
    </Router>
  </React.StrictMode>
);
