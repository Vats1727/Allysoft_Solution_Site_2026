import React, { createContext, useContext, useState, useEffect } from "react";
import { getDynamicApiUrl } from "../utils/helpers";

const LandingDataContext = createContext(null);

export function LandingDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBatchData = async () => {
    const isDev = import.meta.env.DEV;
    const apiBase = getDynamicApiUrl();
    const batchUrl = isDev ? '/api/batch_active' : (apiBase ? apiBase + '/batch_active' : '/api/batch_active');

    try {
      const res = await fetch(batchUrl);
      const batchData = await res.json();
      setData(batchData || {});
    } catch (err) {
      console.error("Failed to fetch batch active data", err);
      setData({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchData();

    // Listen for global data updates (e.g. from Customizer saves)
    const handleDataUpdated = () => {
      fetchBatchData();
    };
    window.addEventListener("api-data-updated", handleDataUpdated);

    // Listen for live preview edits from the visual editor panel
    const handleLiveUpdate = (e) => {
      if (e.detail && e.detail.section && e.detail.data) {
        setData(prev => {
          if (!prev) return prev;
          const section = e.detail.section;
          const updatedVal = e.detail.data;
          
          const next = { ...prev };
          if (Array.isArray(next[section])) {
            if (Array.isArray(updatedVal)) {
              next[section] = updatedVal;
            } else if (updatedVal && typeof updatedVal === "object") {
              next[section] = next[section].map(item => item.id === updatedVal.id ? updatedVal : item);
            }
          } else {
            next[section] = updatedVal;
          }
          return next;
        });
      }
    };
    window.addEventListener("api-live-update", handleLiveUpdate);

    return () => {
      window.removeEventListener("api-data-updated", handleDataUpdated);
      window.removeEventListener("api-live-update", handleLiveUpdate);
    };
  }, []);

  return (
    <LandingDataContext.Provider value={{ data, loading, refresh: fetchBatchData }}>
      {children}
    </LandingDataContext.Provider>
  );
}

export function useLandingData() {
  const context = useContext(LandingDataContext);
  if (!context) {
    throw new Error("useLandingData must be used within a LandingDataProvider");
  }
  return context;
}
