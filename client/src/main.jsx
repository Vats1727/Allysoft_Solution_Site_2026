import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { getDynamicApiUrl } from './utils/helpers.jsx';
import App from './App.jsx';
import './index.css';

let batchPromise = null;
let batchCache = null;

// Global event listener to invalidate the batch cache when any data updates
window.addEventListener("api-data-updated", () => {
  batchPromise = null;
  batchCache = null;
});

// Global Production URL interceptor to rewrite '/api' requests in production environments
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  const isDev = import.meta.env.DEV;
  const method = (options.method || "GET").toUpperCase();

  // Optimize and batch load all /active endpoints on public landing page to prevent SQLite locks and overhead
  if (typeof url === "string" && method === "GET") {
    const cleanUrl = url.split("?")[0];
    if (cleanUrl.includes("/api/") && cleanUrl.endsWith("/active")) {
      const parts = cleanUrl.split("/");
      const activeIdx = parts.indexOf("active");
      if (activeIdx !== -1 && activeIdx > 0) {
        const table = parts[activeIdx - 1];
        const apiBase = getDynamicApiUrl();

        if (!batchPromise) {
          const batchUrl = isDev ? '/api/batch_active' : (apiBase ? apiBase + '/batch_active' : '/api/batch_active');
          batchPromise = originalFetch(batchUrl)
            .then(res => res.json())
            .then(data => {
              batchCache = data;
              return data;
            })
            .catch(err => {
              console.error("Failed to load batch data", err);
              batchCache = {};
              batchPromise = null; // Reset on failure
              return {};
            });
        }

        const data = await batchPromise;
        const tableData = data[table] || [];
        return new Response(JSON.stringify(tableData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  let finalUrl = url;
  if (typeof url === "string" && url.startsWith("/api")) {
    const apiBase = getDynamicApiUrl();
    if (!isDev && apiBase) {
      finalUrl = apiBase + url.replace(/^\/api/, "");
    }

    // Apply cache busting for GET requests to /api to ensure instant customizer previews
    if (method === "GET") {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl = `${finalUrl}${separator}t=${Date.now()}`;
    }
  }

  // Auto-inject Authorization header for admin requests
  if (typeof url === "string" && (url.includes("/admin/") || url.includes("/admin"))) {
    const token = localStorage.getItem("admin_token");
    if (token) {
      if (!options.headers) options.headers = {};
      if (options.headers instanceof Headers) {
        if (!options.headers.has("Authorization")) {
          options.headers.set("Authorization", `Bearer ${token}`);
        }
      } else {
        if (!options.headers["Authorization"]) {
          options.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    }
  }

  return originalFetch(finalUrl, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
