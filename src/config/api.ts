/**
 * API Configuration
 * Backend URL for PDF generation
 */

// Use environment variable or fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  generatePDF: `${API_BASE_URL}/api/v1/generate`,
};