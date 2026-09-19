import React, { useState, useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';

const VisualEditorTrigger = ({ sectionPath, style = {} }) => {
  const isPreview = new URLSearchParams(window.location.search).get('admin_preview') === 'true';
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isPreview) return;
    const buttonEl = containerRef.current;
    if (!buttonEl) return;
    const parentNode = buttonEl.parentNode;
    if (!parentNode) return;

    const originalPos = parentNode.style.position;
    const originalCursor = parentNode.style.cursor;
    const originalTransition = parentNode.style.transition;

    if (!parentNode.style.position || parentNode.style.position === 'static') {
      parentNode.style.position = 'relative';
    }
    parentNode.style.cursor = 'pointer';
    parentNode.style.transition = (originalTransition ? `${originalTransition}, ` : '') + 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    const handleParentClick = () => setIsActive(true);
    const handleGlobalClick = (e) => {
      if (parentNode && !parentNode.contains(e.target)) setIsActive(false);
    };

    parentNode.addEventListener('click', handleParentClick);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      parentNode.removeEventListener('click', handleParentClick);
      document.removeEventListener('click', handleGlobalClick);
      parentNode.style.position = originalPos;
      parentNode.style.cursor = originalCursor;
      parentNode.style.transition = originalTransition;
    };
  }, [isPreview]);

  useEffect(() => {
    if (!isPreview || !containerRef.current) return;
    const parentNode = containerRef.current.parentNode;
    if (!parentNode) return;

    if (isActive) {
      parentNode.style.outline = '3px solid #f5a623'; // Gold border for highlights matching theme
      parentNode.style.outlineOffset = '-3px';
      parentNode.style.boxShadow = 'inset 0 0 50px rgba(245, 166, 35, 0.06)';
    } else {
      parentNode.style.outline = 'none';
      parentNode.style.outlineOffset = '0';
      parentNode.style.boxShadow = 'none';
    }
  }, [isActive, isPreview]);

  if (!isPreview) return null;

  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.parent) {
      window.parent.postMessage({ type: 'OPEN_SECTION', section: sectionPath }, '*');
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsActive(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 99999 }}>
      {isActive && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={handleTriggerClick} 
            style={{ 
              background: 'linear-gradient(135deg, #f5a623 0%, #d48312 100%)', 
              color: '#050505', 
              borderRadius: '30px', 
              padding: '10px 20px', 
              fontSize: '12px', 
              fontWeight: '800', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              border: '2px solid rgba(255, 255, 255, 0.3)', 
              boxShadow: '0 12px 30px rgba(245, 166, 35, 0.35)', 
              cursor: 'pointer', 
              ...style 
            }}
          >
            <LucideIcons.Pencil size={14} />
            <span>Edit This Section</span>
          </button>
          <button 
            type="button" 
            onClick={handleClose} 
            style={{ 
              background: '#161616', 
              border: '1px solid #222222', 
              color: '#94a3b8', 
              width: '36px', 
              height: '36px', 
              borderRadius: '18px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer' 
            }}
          >
            <LucideIcons.X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default VisualEditorTrigger;
