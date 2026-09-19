import React, { useState, useEffect, useRef } from "react";
import * as LucideIcons from "lucide-react";
import { getImageUrl, getApiEndpoint } from "../../utils/helpers";

const GenericManager = ({ section, schema, onSaveSuccess, onLiveUpdate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [iconSearch, setIconSearch] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(schema.isSingleRow);
  const [toast, setToast] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});

  const [imageFiles, setImageFiles] = useState({}); // Raw File objects
  const [imagePreviews, setImagePreviews] = useState({}); // Blobs or existing URLs

  const isUserChanging = useRef(false);

  // Close icons dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".icon-dropdown-grid") && !e.target.closest(".admin-icon-selector-trigger")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  // Filter Lucide icons keys
  const lucideIconKeys = Object.keys(LucideIcons).filter(
    (key) => key.charAt(0) === key.charAt(0).toUpperCase() && key !== "Icon" && key !== "Lucide"
  );

  // Custom Toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle auto-expanding the accordion settings from Visual Editor Trigger
  useEffect(() => {
    const handleOpenAccordion = (e) => {
      if (e.detail && e.detail.section === section) {
        setIsCollapsed(false);
        setTimeout(() => {
          const el = document.getElementById(`accordion-${section}`);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    };
    window.addEventListener("open-admin-accordion", handleOpenAccordion);
    return () => window.removeEventListener("open-admin-accordion", handleOpenAccordion);
  }, [section]);

  // Load items from database API
  const loadItems = async (preserveForm = false) => {
    if (items.length === 0) setLoading(true);
    try {
      const res = await fetch(getApiEndpoint(`admin/${section}`));
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setItems(list);
      
      if (!preserveForm) {
        if (schema.isSingleRow) {
          if (list.length > 0) {
            const updatedItem = list.find(x => x.id === selectedItem?.id) || list[0];
            openEdit(updatedItem);
          } else {
            await provisionSingleRowRecord();
          }
        } else if (selectedItem) {
          const updatedItem = list.find(x => x.id === selectedItem.id);
          if (updatedItem) openEdit(updatedItem);
        }
      }
    } catch (err) {
      console.error("Failed to load generic items for section: " + section, err);
      showToast("Failed to fetch database data", "error");
    } finally {
      setLoading(false);
    }
  };

  const provisionSingleRowRecord = async () => {
    try {
      const initialData = {};
      schema.fields.forEach(f => {
        if (f.type === "tags" || f.type === "json" || f.type === "features_list" || f.type === "pricing_list") {
          initialData[f.name] = [];
        } else {
          initialData[f.name] = f.defaultValue !== undefined ? f.defaultValue : "";
        }
      });
      initialData.status_toggle = "Active";

      const res = await fetch(getApiEndpoint(`admin/${section}`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialData),
      });
      const result = await res.json();
      if (result.success) {
        const newList = [result.data];
        setItems(newList);
        setTimeout(() => openEdit(result.data), 50);
      }
    } catch (err) {
      console.error("Failed to auto-provision single-row record", err);
    }
  };

  useEffect(() => {
    setSelectedItem(null);
    setFormData({});
    setImageFiles({});
    setImagePreviews({});
    setShowForm(false);
    setIsCollapsed(schema.isSingleRow);
    loadItems();
  }, [section]);

  const openCreate = () => {
    const initial = {};
    schema.fields.forEach(f => {
      if (f.type === "tags" || f.type === "json" || f.type === "features_list" || f.type === "pricing_list") {
        initial[f.name] = [];
      } else {
        initial[f.name] = f.defaultValue !== undefined ? f.defaultValue : "";
      }
    });
    initial.status_toggle = "Active";
    initial.sort_order = items.length;
    setFormData(initial);
    setSelectedItem(null);
    setImageFiles({});
    setImagePreviews({});
    setShowForm(true);
  };

  const openEdit = (item) => {
    const editedData = { ...item };
    schema.fields.forEach(f => {
      if (f.type === "tags" || f.type === "json" || f.type === "features_list" || f.type === "pricing_list") {
        let val = editedData[f.name];
        if (typeof val === "string") {
          try { val = JSON.parse(val); } catch(e) { 
            val = val ? val.split(",").map(s => s.trim()) : [];
          }
        }
        editedData[f.name] = val;
      }
    });

    setFormData(editedData);
    setSelectedItem(item);
    setImageFiles({});

    const previews = {};
    schema.fields.forEach(f => {
      if ((f.type === "image" || f.type === "file") && item[f.name]) {
        previews[f.name] = getImageUrl(item[f.name]);
      }
    });
    setImagePreviews(previews);
    setShowForm(true);
  };

  const updateFormData = (newData) => {
    isUserChanging.current = true;
    setFormData(newData);
  };

  const handleSave = async (e = null, isAuto = false) => {
    if (e) e.preventDefault();
    if (saving && !isAuto) return;

    if (!isAuto) setSaving(true);

    try {
      const isNew = !selectedItem || selectedItem.id === "new";
      const url = isNew ? getApiEndpoint(`admin/${section}`) : getApiEndpoint(`admin/${section}/${selectedItem.id}`);
      
      const payload = new FormData();
      if (!isNew) {
        payload.append("_method", "PUT");
      }

      // Add normal fields
      Object.keys(formData).forEach(key => {
        if (key !== "id") {
          if (Array.isArray(formData[key]) || typeof formData[key] === "object") {
            payload.append(key, JSON.stringify(formData[key]));
          } else {
            payload.append(key, formData[key] !== null && formData[key] !== undefined ? formData[key] : "");
          }
        }
      });

      // Add image files
      Object.keys(imageFiles).forEach(key => {
        if (imageFiles[key]) {
          payload.append(key, imageFiles[key]);
        }
      });

      const res = await fetch(url, {
        method: "POST",
        body: payload,
      });
      const result = await res.json();

      if (result.success) {
        const savedRecord = result.data;
        const parsedRecord = { ...savedRecord };
        
        schema.fields.forEach(f => {
          if (f.type === "tags" || f.type === "json" || f.type === "features_list" || f.type === "pricing_list") {
            let val = parsedRecord[f.name];
            if (typeof val === "string") {
              try { val = JSON.parse(val); } catch(e) { 
                val = val ? val.split(",").map(s => s.trim()) : [];
              }
            }
            parsedRecord[f.name] = val;
          }
        });

        setSelectedItem(parsedRecord);
        setImageFiles({});
        
        const nextPreviews = { ...imagePreviews };
        schema.fields.forEach(f => {
          if (f.type === "image" && parsedRecord[f.name]) {
            nextPreviews[f.name] = getImageUrl(parsedRecord[f.name]);
          }
        });
        setImagePreviews(nextPreviews);

        // Form shut down / Collapsible close on manual saves
        if (!isAuto) {
          setShowForm(false);
          setSelectedItem(null);
          if (schema.isSingleRow) {
            setIsCollapsed(true);
          }
        }

        showToast(isAuto ? "Autosaved Changes" : "Configuration Saved Successfully!", "success");
        window.dispatchEvent(new CustomEvent("api-data-updated"));
        if (onSaveSuccess) onSaveSuccess();
        await loadItems(true);
      } else {
        if (!isAuto) showToast(result.error || "Save operation failed.", "error");
      }
    } catch (err) {
      console.error("Failed to save changes", err);
      if (!isAuto) showToast("Network communication error.", "error");
    } finally {
      if (!isAuto) setSaving(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      const res = await fetch(getApiEndpoint(`admin/${section}/${id}`), {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        window.dispatchEvent(new CustomEvent("api-data-updated"));
        if (selectedItem?.id === id) {
          setShowForm(false);
          setSelectedItem(null);
        }
        showToast("Item deleted successfully!", "success");
        if (onSaveSuccess) onSaveSuccess();
        loadItems(true);
      }
    } catch (err) {
      console.error("Delete call failed", err);
      showToast("Delete operation failed.", "error");
    }
  };

  const handleImageChange = (fieldName, file) => {
    if (!file) return;
    setImageFiles(prev => ({ ...prev, [fieldName]: file }));
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviews(prev => ({ ...prev, [fieldName]: e.target.result }));
      updateFormData({ ...formData, [fieldName]: e.target.result });
    };
    reader.readAsDataURL(file);
  };

  // Debounced Auto-Save Watcher
  useEffect(() => {
    if (!showForm || !selectedItem || !isUserChanging.current || selectedItem.id === "new") return;
    const timer = setTimeout(() => {
      isUserChanging.current = false;
      handleSave(null, true);
    }, 450);
    return () => clearTimeout(timer);
  }, [formData, imageFiles]);

  // Real-time changes broadcast
  useEffect(() => {
    if (showForm && Object.keys(formData).length > 0) {
      const cleanData = { ...formData };
      schema.fields.forEach(f => {
        if (f.type === "image" && cleanData[f.name] && cleanData[f.name].startsWith("data:image")) {
          // Local base64 file buffer preview
        }
      });
      onLiveUpdate?.(section, cleanData);
    }
  }, [formData, showForm]);

  const renderFormFields = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {schema.fields.map((field) => {
          const val = formData[field.name];

          return (
            <div key={field.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>{field.label}</label>

              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={field.placeholder || ""}
                  value={val || ""}
                  onChange={(e) => updateFormData({ ...formData, [field.name]: e.target.value })}
                  style={formStyles.input}
                  required={field.required}
                />
              )}

              {field.type === "password" && (
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <input
                    type={showPasswords[field.name] ? "text" : "password"}
                    placeholder={field.placeholder || ""}
                    value={val || ""}
                    onChange={(e) => updateFormData({ ...formData, [field.name]: e.target.value })}
                    style={{ ...formStyles.input, paddingRight: "40px" }}
                    required={field.required}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, [field.name]: !prev[field.name] }))}
                    style={{
                      position: "absolute",
                      right: "12px",
                      background: "transparent",
                      border: "none",
                      color: "#64748b",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      zIndex: 10
                    }}
                  >
                    {showPasswords[field.name] ? <LucideIcons.EyeOff size={16} /> : <LucideIcons.Eye size={16} />}
                  </button>
                </div>
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  value={val !== undefined ? val : ""}
                  onChange={(e) => updateFormData({ ...formData, [field.name]: parseFloat(e.target.value) || 0 })}
                  style={formStyles.input}
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  rows={4}
                  value={val || ""}
                  onChange={(e) => updateFormData({ ...formData, [field.name]: e.target.value })}
                  style={formStyles.textarea}
                />
              )}

              {field.type === "tags" && (
                <input
                  type="text"
                  placeholder="Comma separated values"
                  value={Array.isArray(val) ? val.join(", ") : (val || "")}
                  onChange={(e) => updateFormData({ ...formData, [field.name]: e.target.value.split(",").map(x => x.trim()) })}
                  style={formStyles.input}
                />
              )}

              {field.type === "json" && (
                <textarea
                  rows={8}
                  placeholder="JSON Block structure e.g. [{title: '', desc: ''}]"
                  value={typeof val === "object" ? JSON.stringify(val, null, 2) : (val || "")}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateFormData({ ...formData, [field.name]: parsed });
                    } catch (err) {
                      updateFormData({ ...formData, [field.name]: e.target.value });
                    }
                  }}
                  style={formStyles.textareaMono}
                />
              )}

              {field.type === "features_list" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#f5a623" }}>Features Manager</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVal = Array.isArray(val) ? val : [];
                        // Prepend new feature to the top of features list
                        updateFormData({ ...formData, [field.name]: [{ title: "", desc: "", icon: "Zap" }, ...currentVal] });
                      }}
                      style={{ background: "#f5a623", color: "#000", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "10px", fontWeight: "800", cursor: "pointer" }}
                    >
                      + Add Feature
                    </button>
                  </div>

                  {(Array.isArray(val) ? val : []).map((feat, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "10px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>Feature #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentVal = Array.isArray(val) ? val : [];
                            const updatedVal = currentVal.filter((_, fIdx) => fIdx !== idx);
                            updateFormData({ ...formData, [field.name]: updatedVal });
                          }}
                          style={{ background: "rgba(239, 68, 68, 0.12)", border: "none", color: "#ef4444", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Feature Title (e.g. Multi-Instance Gateway)"
                        value={feat.title || ""}
                        onChange={(e) => {
                          const currentVal = Array.isArray(val) ? val : [];
                          const updatedVal = currentVal.map((f, fIdx) => fIdx === idx ? { ...f, title: e.target.value } : f);
                          updateFormData({ ...formData, [field.name]: updatedVal });
                        }}
                        style={formStyles.input}
                      />
                      
                      {/* Dynamic Icon Dropdown Selector for features */}
                      <div style={{ position: "relative" }}>
                        <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>Feature Icon</label>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === `feature-icon-${idx}` ? null : `feature-icon-${idx}`);
                          }}
                          className="admin-icon-selector-trigger"
                          style={formStyles.selectButton}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {React.createElement(LucideIcons[feat.icon] || LucideIcons.Zap, { size: 16, color: "#f5a623" })}
                            <span>{feat.icon || "Zap"}</span>
                          </div>
                          <LucideIcons.ChevronDown size={14} style={{ marginLeft: "auto", color: "#64748b" }} />
                        </button>

                        {activeDropdown === `feature-icon-${idx}` && (
                          <div className="icon-dropdown-grid" style={formStyles.dropdownContainer}>
                            <div style={{ padding: "8px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: "6px" }}>
                              <LucideIcons.Search size={14} style={{ color: "#64748b" }} />
                              <input
                                type="text"
                                placeholder="Search icons..."
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  outline: "none",
                                  color: "#e2e8f5",
                                  fontSize: "12px",
                                  width: "100%"
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onKeyUp={(e) => {
                                  const term = e.target.value.toLowerCase();
                                  const gridItems = e.target.closest(".icon-dropdown-grid").querySelectorAll(".icon-grid-item");
                                  gridItems.forEach(item => {
                                    const name = item.getAttribute("data-name").toLowerCase();
                                    item.style.display = name.includes(term) ? "flex" : "none";
                                  });
                                }}
                              />
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", padding: "10px", maxHeight: "180px", overflowY: "auto" }}>
                              {lucideIconKeys.map((name) => (
                                <button
                                  key={name}
                                  type="button"
                                  className="icon-grid-item"
                                  data-name={name}
                                  onClick={() => {
                                    const currentVal = Array.isArray(val) ? val : [];
                                    const updatedVal = currentVal.map((f, fIdx) => fIdx === idx ? { ...f, icon: name } : f);
                                    updateFormData({ ...formData, [field.name]: updatedVal });
                                    setActiveDropdown(null);
                                  }}
                                  style={{
                                    background: feat.icon === name ? "rgba(245, 166, 35, 0.15)" : "transparent",
                                    border: feat.icon === name ? "1px solid #f5a623" : "1px solid transparent",
                                    borderRadius: "8px",
                                    padding: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    transition: "all 0.15s"
                                  }}
                                  title={name}
                                >
                                  {React.createElement(LucideIcons[name], { size: 18, color: feat.icon === name ? "#f5a623" : "#cbd5e1" })}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <textarea
                        placeholder="Feature short description..."
                        rows={2}
                        value={feat.desc || ""}
                        onChange={(e) => {
                          const currentVal = Array.isArray(val) ? val : [];
                          const updatedVal = currentVal.map((f, fIdx) => fIdx === idx ? { ...f, desc: e.target.value } : f);
                          updateFormData({ ...formData, [field.name]: updatedVal });
                        }}
                        style={formStyles.textarea}
                      />
                    </div>
                  ))}
                  {(Array.isArray(val) ? val : []).length === 0 && (
                    <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic", textAlign: "center", margin: "10px 0" }}>No features added yet.</span>
                  )}
                </div>
              )}

              {field.type === "pricing_list" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "12px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#f5a623" }}>Pricing Tiers Manager</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVal = Array.isArray(val) ? val : [];
                        // Prepend new tier to the top of pricing tiers list
                        updateFormData({ ...formData, [field.name]: [{ name: "", price: "", period: "", desc: "", highlight: false, features: [] }, ...currentVal] });
                      }}
                      style={{ background: "#f5a623", color: "#000", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "10px", fontWeight: "800", cursor: "pointer" }}
                    >
                      + Add Tier
                    </button>
                  </div>

                  {(Array.isArray(val) ? val : []).map((tier, idx) => (
                    <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "12px", background: "rgba(0, 0, 0, 0.25)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.04)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "bold" }}>Tier #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentVal = Array.isArray(val) ? val : [];
                            const updatedVal = currentVal.filter((_, tIdx) => tIdx !== idx);
                            updateFormData({ ...formData, [field.name]: updatedVal });
                          }}
                          style={{ background: "rgba(239, 68, 68, 0.12)", border: "none", color: "#ef4444", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" }}
                        >
                          Delete
                        </button>
                      </div>
                      
                      <div style={{ display: "flex", gap: "8px" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Starter"
                            value={tier.name || ""}
                            onChange={(e) => {
                              const currentVal = Array.isArray(val) ? val : [];
                              const updatedVal = currentVal.map((t, tIdx) => tIdx === idx ? { ...t, name: e.target.value } : t);
                              updateFormData({ ...formData, [field.name]: updatedVal });
                            }}
                            style={formStyles.input}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>Price</label>
                          <input
                            type="text"
                            placeholder="e.g. $49"
                            value={tier.price || ""}
                            onChange={(e) => {
                              const currentVal = Array.isArray(val) ? val : [];
                              const updatedVal = currentVal.map((t, tIdx) => tIdx === idx ? { ...t, price: e.target.value } : t);
                              updateFormData({ ...formData, [field.name]: updatedVal });
                            }}
                            style={formStyles.input}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>Period</label>
                          <input
                            type="text"
                            placeholder="e.g. /mo"
                            value={tier.period || ""}
                            onChange={(e) => {
                              const currentVal = Array.isArray(val) ? val : [];
                              const updatedVal = currentVal.map((t, tIdx) => tIdx === idx ? { ...t, period: e.target.value } : t);
                              updateFormData({ ...formData, [field.name]: updatedVal });
                            }}
                            style={formStyles.input}
                          />
                        </div>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "6px", marginTop: "14px" }}>
                          <input
                            type="checkbox"
                            checked={!!tier.highlight}
                            id={`tier-highlight-${idx}`}
                            onChange={(e) => {
                              const currentVal = Array.isArray(val) ? val : [];
                              const updatedVal = currentVal.map((t, tIdx) => tIdx === idx ? { ...t, highlight: e.target.checked } : t);
                              updateFormData({ ...formData, [field.name]: updatedVal });
                            }}
                            style={{ cursor: "pointer" }}
                          />
                          <label htmlFor={`tier-highlight-${idx}`} style={{ fontSize: "11px", color: "#cbd5e1", cursor: "pointer", userSelect: "none" }}>Popular Card</label>
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>Short Description</label>
                        <input
                          type="text"
                          placeholder="e.g. Best for micro start-ups"
                          value={tier.desc || ""}
                          onChange={(e) => {
                            const currentVal = Array.isArray(val) ? val : [];
                            const updatedVal = currentVal.map((t, tIdx) => tIdx === idx ? { ...t, desc: e.target.value } : t);
                            updateFormData({ ...formData, [field.name]: updatedVal });
                          }}
                          style={formStyles.input}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>Features Bullets (one per line)</label>
                        <textarea
                          rows={3}
                          placeholder="e.g.&#10;10 Instances&#10;Rest API Gateway&#10;24/7 Support"
                          value={Array.isArray(tier.features) ? tier.features.join("\n") : (tier.features || "")}
                          onChange={(e) => {
                            const currentVal = Array.isArray(val) ? val : [];
                            const lines = e.target.value.split("\n").map(x => x.trim()).filter(Boolean);
                            const updatedVal = currentVal.map((t, tIdx) => tIdx === idx ? { ...t, features: lines } : t);
                            updateFormData({ ...formData, [field.name]: updatedVal });
                          }}
                          style={formStyles.textarea}
                        />
                      </div>
                    </div>
                  ))}
                  {(Array.isArray(val) ? val : []).length === 0 && (
                    <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic", textAlign: "center", margin: "10px 0" }}>No tiers added yet.</span>
                  )}
                </div>
              )}

              {field.type === "image" && (
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "#0c0e18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden"
                    }}
                  >
                    {imagePreviews[field.name] ? (
                      <img
                        src={imagePreviews[field.name]}
                        alt="Thumbnail Preview"
                        style={{ width: "100%", height: "100%", objectCover: "cover" }}
                      />
                    ) : (
                      <LucideIcons.Image size={24} style={{ color: "#222" }} />
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <input
                      type="file"
                      accept="image/*"
                      id={`file-input-${field.name}`}
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(field.name, e.target.files[0])}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById(`file-input-${field.name}`).click()}
                      style={formStyles.secButton}
                    >
                      Upload Image
                    </button>
                  </div>
                </div>
              )}

              {field.type === "icon" && (
                <div style={{ position: "relative" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === field.name ? null : field.name);
                    }}
                    className="admin-icon-selector-trigger"
                    style={formStyles.selectButton}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {React.createElement(LucideIcons[val] || LucideIcons.HelpCircle, { size: 16, color: "#f5a623" })}
                      <span>{val || "Select Dynamic Icon"}</span>
                    </div>
                    <LucideIcons.ChevronDown size={14} style={{ marginLeft: "auto", color: "#64748b" }} />
                  </button>

                  {activeDropdown === field.name && (
                    <div className="icon-dropdown-grid" style={formStyles.dropdownContainer}>
                      <div style={{ padding: "8px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <LucideIcons.Search size={14} style={{ color: "#64748b" }} />
                        <input
                          type="text"
                          placeholder="Search icons..."
                          style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#e2e8f5",
                            fontSize: "12px",
                            width: "100%"
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyUp={(e) => {
                            const term = e.target.value.toLowerCase();
                            const gridItems = e.target.closest(".icon-dropdown-grid").querySelectorAll(".icon-grid-item");
                            gridItems.forEach(item => {
                              const name = item.getAttribute("data-name").toLowerCase();
                              item.style.display = name.includes(term) ? "flex" : "none";
                            });
                          }}
                        />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", padding: "10px", maxHeight: "200px", overflowY: "auto" }}>
                        {lucideIconKeys.map((name) => (
                          <button
                            key={name}
                            type="button"
                            className="icon-grid-item"
                            data-name={name}
                            onClick={() => {
                              updateFormData({ ...formData, [field.name]: name });
                              setActiveDropdown(null);
                            }}
                            style={{
                              background: val === name ? "rgba(245, 166, 35, 0.15)" : "transparent",
                              border: val === name ? "1px solid #f5a623" : "1px solid transparent",
                              borderRadius: "8px",
                              padding: "8px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              transition: "all 0.15s"
                            }}
                            title={name}
                          >
                            {React.createElement(LucideIcons[name], { size: 18, color: val === name ? "#f5a623" : "#cbd5e1" })}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Status Toggle Switch */}
        {!schema.isSingleRow && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#94a3b8" }}>Visibility Status</span>
            <label 
              style={{ 
                position: "relative", 
                display: "inline-block", 
                width: "48px", 
                height: "24px", 
                cursor: "pointer" 
              }}
            >
              <input
                type="checkbox"
                checked={formData.status_toggle === "Active"}
                onChange={(e) => updateFormData({ ...formData, status_toggle: e.target.checked ? "Active" : "Inactive" })}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: formData.status_toggle === "Active" ? "rgba(245, 166, 35, 0.3)" : "rgba(255,255,255,0.06)",
                  border: formData.status_toggle === "Active" ? "1px solid #f5a623" : "1px solid rgba(255,255,255,0.1)",
                  transition: ".3s",
                  borderRadius: "24px"
                }}
              />
              <span
                style={{
                  position: "absolute",
                  content: '""',
                  height: "16px",
                  width: "16px",
                  left: formData.status_toggle === "Active" ? "26px" : "4px",
                  bottom: "4px",
                  backgroundColor: formData.status_toggle === "Active" ? "#f5a623" : "#64748b",
                  transition: ".3s",
                  borderRadius: "50%"
                }}
              />
            </label>
            <span style={{ fontSize: "12px", color: formData.status_toggle === "Active" ? "#f5a623" : "#94a3b8" }}>
              {formData.status_toggle}
            </span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            {/* Show manual save button inside single-row collapsibles or new items */}
            {(schema.isSingleRow || !selectedItem || selectedItem.id === "new") ? (
              <button type="submit" disabled={saving} style={formStyles.priButton}>
                {saving ? "Saving..." : "Save Configuration"}
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f5a623", fontSize: "11px", fontWeight: "bold" }}>
                <LucideIcons.Sparkles size={13} style={{ animation: "pulse 2s infinite" }} />
                <span>Auto-save active</span>
              </div>
            )}
            
            {!schema.isSingleRow && (
              <button type="button" onClick={() => setShowForm(false)} style={formStyles.cancelButton}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (schema.isSingleRow) {
    return (
      <div id={`accordion-${section}`} style={{ fontFamily: "Outfit, sans-serif", color: "#e2e8f5", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", background: "#0c0e18", overflow: "hidden", marginBottom: "4px", position: "relative" }}>
        {/* Clickable Header Accordion Bar */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ 
            padding: "14px 18px", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            cursor: "pointer", 
            userSelect: "none",
            background: "rgba(255, 255, 255, 0.01)",
            borderBottom: isCollapsed ? "none" : "1px solid rgba(255,255,255,0.05)",
            transition: "all 0.2s"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <LucideIcons.Sliders size={14} style={{ color: "#f5a623" }} />
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {schema.title}
            </span>
          </div>
          {isCollapsed ? <LucideIcons.ChevronDown size={14} style={{ color: "#64748b" }} /> : <LucideIcons.ChevronUp size={14} style={{ color: "#64748b" }} />}
        </div>

        {/* Collapsible Content */}
        {!isCollapsed && (
          <div style={{ padding: "16px" }}>
            <form onSubmit={handleSave}>
              {renderFormFields()}
            </form>
          </div>
        )}

        {/* Custom Toast element inside single-row view */}
        {toast && (
          <div 
            style={{
              position: "fixed",
              bottom: "20px",
              left: "20px",
              background: toast.type === "success" ? "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)" : "linear-gradient(135deg, #dc3545 0%, #bd2130 100%)",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "30px",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "0.5px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
              zIndex: 999999,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              textTransform: "uppercase",
              animation: "toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
            }}
          >
            {toast.type === "success" ? <LucideIcons.CheckCircle size={15} /> : <LucideIcons.AlertTriangle size={15} />}
            <span>{toast.message}</span>
            <style>{`
              @keyframes toastSlideIn {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Outfit, sans-serif", color: "#e2e8f5", padding: "10px", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
          {schema.title}
        </h3>
        {!schema.isSingleRow && !showForm && (
          <button
            onClick={openCreate}
            style={{
              background: "#f5a623",
              color: "#050505",
              border: "none",
              borderRadius: "20px",
              padding: "8px 16px",
              fontSize: "12px",
              fontWeight: "800",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <LucideIcons.Plus size={14} /> Add Item
          </button>
        )}
      </div>

      {!schema.isSingleRow && !showForm && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Reverse list rendering to show newest item at the top */}
          {[...items].reverse().map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => openEdit(item)}
              style={{
                background: "#0c0e18",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {item.image && (
                  <img
                    src={getImageUrl(item.image)}
                    alt="Preview"
                    style={{ width: "40px", height: "40px", borderRadius: "8px", objectCover: "cover" }}
                  />
                )}
                {item.icon && (
                  <div style={{ color: "#f5a623", background: "rgba(245,166,35,0.08)", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {React.createElement(LucideIcons[item.icon] || LucideIcons.HelpCircle, { size: 18 })}
                  </div>
                )}
                <div>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: "700" }}>{item.title || item.name || `Item #${item.id}`}</h4>
                  <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#64748b" }}>
                    {item.desc || item.role || item.category || ""}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={e => e.stopPropagation()}>
                <span style={{ fontSize: "11px", color: item.status_toggle === "Active" ? "#f5a623" : "#ef4444", fontWeight: "bold" }}>
                  {item.status_toggle}
                </span>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#ef4444",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  <LucideIcons.Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p style={{ fontSize: "12px", color: "#64748b", textAlign: "center", margin: "20px 0" }}>No records found.</p>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSave}>
          {renderFormFields()}
        </form>
      )}

      {/* Custom Toast element inside multi-row view */}
      {toast && (
        <div 
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            background: toast.type === "success" ? "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)" : "linear-gradient(135deg, #dc3545 0%, #bd2130 100%)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "30px",
            fontSize: "12px",
            fontWeight: "800",
            letterSpacing: "0.5px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
            zIndex: 999999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textTransform: "uppercase",
            animation: "toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          }}
        >
          {toast.type === "success" ? <LucideIcons.CheckCircle size={15} /> : <LucideIcons.AlertTriangle size={15} />}
          <span>{toast.message}</span>
          <style>{`
            @keyframes toastSlideIn {
              from { transform: translateY(50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

const formStyles = {
  input: {
    background: "#0c0e18",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#e2e8f5",
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  },
  textarea: {
    background: "#0c0e18",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#e2e8f5",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit"
  },
  textareaMono: {
    background: "#05060b",
    border: "1px solid rgba(245, 166, 35, 0.15)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "12px",
    color: "#cbd5e1",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "Courier, monospace"
  },
  selectButton: {
    background: "#0c0e18",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#e2e8f5",
    outline: "none",
    width: "100%",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left"
  },
  dropdownContainer: {
    position: "absolute",
    top: "105%",
    left: 0,
    right: 0,
    background: "#0e111a",
    border: "1px solid rgba(245, 166, 35, 0.2)",
    borderRadius: "10px",
    zIndex: 9999,
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  priButton: {
    background: "linear-gradient(135deg, #f5a623 0%, #d48312 100%)",
    border: "none",
    borderRadius: "20px",
    color: "#050505",
    padding: "10px 24px",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(245, 166, 35, 0.2)",
    boxSizing: "border-box"
  },
  secButton: {
    background: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    color: "#e2e8f5",
    padding: "8px 16px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer"
  },
  cancelButton: {
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    color: "#64748b",
    padding: "10px 20px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer"
  }
};

export default GenericManager;
