import React from "react";
import * as LucideIcons from "lucide-react";

// Dynamically compute the router base path from the address bar
export const getDynamicBase = () => {
  let path = window.location.pathname;
  if (path.endsWith('/index.html')) {
    path = path.substring(0, path.length - 10);
  }
  if (path !== '/' && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  
  let base = "";
  let specialFound = false;
  const specialPaths = ['/admin', '/login', '/forgot-password', '/recover-password'];
  for (const sPath of specialPaths) {
    const idx = path.toLowerCase().indexOf(sPath);
    if (idx !== -1) {
      base = path.substring(0, idx);
      specialFound = true;
      break;
    }
  }
  
  if (!specialFound && !base) {
    base = path === '/' ? '' : path;
  }
  
  // Clean up client/dist from base path if accessed directly on local server
  base = base.replace(/\/client\/dist\/?$/i, '');
  
  // Normalize leading slash, no trailing slash
  if (base && !base.startsWith('/')) {
    base = '/' + base;
  }
  if (base && base.endsWith('/')) {
    base = base.slice(0, -1);
  }
  
  return base || '';
};

// Dynamically compute the API URL path
export const getDynamicApiUrl = () => {
  const isDev = import.meta.env.DEV;
  if (isDev) return '';
  return getDynamicBase() + '/server/public';
};

// Helper to detect if a path points to a dynamic upload directory on the server
const isUploadDir = (path) => {
  const uploadDirs = [
    '/upload/', 
    '/assets/navbar_section/', 
    '/assets/projects/', 
    '/assets/why_ally_section/', 
    '/assets/about_section/', 
    '/assets/team/', 
    '/assets/footer_section/',
    '/assets/services/',
    '/assets/contact_info/'
  ];
  return uploadDirs.some(dir => path.startsWith(dir));
};

// Map file uploads / images through proxy target in dev vs static files in production
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('pending_upload_')) return ''; // Ignore transient uploads
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('data:')) return imagePath; // Local blob URL
  if (imagePath.length <= 4) return imagePath; // Return emojis as-is
  
  const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
  const apiUrl = getDynamicApiUrl();
  const isDev = import.meta.env.DEV;
  
  if (isDev) {
    // In development mode, route upload files through the Vite dev proxy
    if (isUploadDir(cleanPath)) {
      return '/api' + cleanPath;
    }
    return cleanPath;
  }
  
  // In production mode, serve files as static assets directly from Apache without hitting PHP
  if (isUploadDir(cleanPath)) {
    return apiUrl + cleanPath;
  }
  if (cleanPath.startsWith('/server/public/upload/') || cleanPath.startsWith('/server/public/assets/')) {
    return getDynamicBase() + cleanPath;
  }
  // Client static assets (like logo-white.png, or static team photos in assets/)
  return getDynamicBase() + cleanPath;
};

// Dynamically resolve API endpoints for both dev proxy and production context paths
export const getApiEndpoint = (path) => {
  const isDev = import.meta.env.DEV;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (isDev) {
    return '/api/' + cleanPath;
  }
  
  const apiBase = getDynamicApiUrl();
  return apiBase + '/' + cleanPath;
};

// Dynamic Icon renderer with safe Lucide icon fallback
export const DynamicIcon = ({ name, size = 24, className = '', color }) => {
  if (!name) return <LucideIcons.HelpCircle size={size} className={className} color={color} />;
  
  // Clean up string (e.g. if we get "Smartphone" or "lucide:Smartphone")
  const iconKey = name.includes(":") ? name.split(":")[1] : name;
  const IconComponent = LucideIcons[iconKey] || LucideIcons.HelpCircle;
  return <IconComponent size={size} className={className} color={color} />;
};
