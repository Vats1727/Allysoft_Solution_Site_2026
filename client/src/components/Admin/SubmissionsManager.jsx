import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  try {
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const parts = formatter.formatToParts(date);
    let day = '', month = '', year = '', hour = '', minute = '', dayPeriod = 'AM';
    for (const part of parts) {
      if (part.type === 'day') day = part.value;
      if (part.type === 'month') month = part.value;
      if (part.type === 'year') year = part.value;
      if (part.type === 'hour') hour = part.value;
      if (part.type === 'minute') minute = part.value;
      if (part.type === 'dayPeriod') dayPeriod = part.value;
    }
    const ampm = dayPeriod.toUpperCase();
    return `${day}-${month}-${year} ${hour}:${minute} ${ampm} IST`;
  } catch (e) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strTime = String(hours).padStart(2, "0") + ":" + minutes + " " + ampm;
    return `${day}-${month}-${year} ${strTime} IST`;
  }
};

export default function SubmissionsManager() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/admin/submissions/${id}`, {
        method: "DELETE"
      });
      const result = await res.json();
      if (result.success) {
        loadSubmissions();
      }
    } catch (err) {
      console.error("Failed to delete lead", err);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = submissions.filter(item => {
    const term = searchTerm.toLowerCase();
    return (
      (item.name || "").toLowerCase().includes(term) ||
      (item.email || "").toLowerCase().includes(term) ||
      (item.subject || "").toLowerCase().includes(term) ||
      (item.message || "").toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filtered.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", color: "#e2e8f5", padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#f5a623", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>Enquiry Inbox</h2>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>Manage client requests and custom builds quotes received through the contact form.</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <LucideIcons.Search size={16} style={{ position: "absolute", left: "12px", color: "#64748b" }} />
            <input 
              type="text" 
              placeholder="Search enquiries..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                background: "#0c0e18",
                border: "1px solid rgba(245, 166, 35, 0.2)",
                borderRadius: "8px",
                padding: "8px 12px 8px 36px",
                fontSize: "13px",
                color: "#e2e8f5",
                outline: "none",
                width: "240px",
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
            />
          </div>
          <button 
            onClick={loadSubmissions}
            style={{
              background: "rgba(245, 166, 35, 0.1)",
              border: "1px solid rgba(245, 166, 35, 0.3)",
              color: "#f5a623",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            title="Refresh"
          >
            <LucideIcons.RotateCw size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", gap: "10px" }}>
          <LucideIcons.Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "#f5a623" }} />
          <span style={{ fontSize: "14px", color: "#94a3b8" }}>Loading enquiries...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: "50px 20px", textAlign: "center", background: "#0c0e18", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px" }}>
          <LucideIcons.Inbox size={48} style={{ color: "#64748b", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "1rem", color: "#e2e8f5", fontWeight: "700" }}>No matching enquiries</h3>
          <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "6px" }}>New client messages will automatically populate here.</p>
        </div>
      ) : (
        <div style={{ background: "#0c0e18", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
              <thead>
                <tr style={{ background: "rgba(245, 166, 35, 0.05)", borderBottom: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}>
                  <th style={{ padding: "16px 20px" }}>Contact Details</th>
                  <th style={{ padding: "16px 20px" }}>Subject</th>
                  <th style={{ padding: "16px 20px" }}>Message</th>
                  <th style={{ padding: "16px 20px" }}>Received Date</th>
                  <th style={{ padding: "16px 20px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ fontWeight: "700", color: "#e2e8f5" }}>{item.name}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px", fontSize: "11px", color: "#94a3b8" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><LucideIcons.Mail size={10} /> {item.email || "-"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{
                        background: "rgba(245, 166, 35, 0.12)",
                        color: "#f5a623",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}>
                        {item.subject}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", maxWidth: "300px", wordBreak: "break-word", color: "#cbd5e1", lineHeight: "1.5" }}>
                      {item.message}
                    </td>
                    <td style={{ padding: "16px 20px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                      {formatDateTime(item.created_at)}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <a 
                          href={`mailto:${item.email}?subject=Reply: ${encodeURIComponent(item.subject)}`}
                          style={{
                            background: "rgba(245, 166, 35, 0.1)",
                            border: "1px solid rgba(245, 166, 35, 0.2)",
                            color: "#f5a623",
                            borderRadius: "6px",
                            padding: "6px 12px",
                            fontSize: "11px",
                            fontWeight: "700",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            textDecoration: "none"
                          }}
                        >
                          <LucideIcons.Mail size={12} />
                          <span>Reply</span>
                        </a>
                        <button 
                          onClick={(e) => handleDelete(item.id, e)}
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            borderRadius: "6px",
                            padding: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          title="Delete Lead"
                        >
                          <LucideIcons.Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filtered.length)} of {filtered.length} entries
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  style={{
                    background: currentPage === 1 ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: currentPage === 1 ? "#4b5563" : "#e2e8f5",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    cursor: currentPage === 1 ? "default" : "pointer"
                  }}
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  style={{
                    background: currentPage === totalPages ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: currentPage === totalPages ? "#4b5563" : "#e2e8f5",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "11px",
                    cursor: currentPage === totalPages ? "default" : "pointer"
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
