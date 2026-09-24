/**
 * USER - The user document as returned by the backend.
 * Represents an end user (or admin) of the platform.
 */
export interface User {
  _id: string;           // MongoDB unique ID
  name: string;          // The user's full name
  email: string;         // Email address (unique)
  phone?: string;        // Phone number (optional)
  company?: string;      // Company name (optional)
  logo?: string;         // Company logo URL (optional)
  role?: string;         // User role - "admin" or another value (optional)
}