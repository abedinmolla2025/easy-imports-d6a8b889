import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

// Global listener for chunk load failures (common in PWAs after a new deploy)
window.addEventListener("error", (event) => {
  if (event.message.includes("Loading chunk") || event.message.includes("CSS_CHUNK_LOAD_FAILED")) {
    console.warn("Chunk load failure detected, forcing reload...");
    window.location.reload();
  }
}, true);

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>,
);

