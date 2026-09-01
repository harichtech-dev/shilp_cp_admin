export interface User {
  _id: string;           // MongoDB unique ID
  name: string;          // User ka full name
  email: string;         // Email address (unique)
  phone?: string;        // Phone number (optional)
  company?: string;      // Company name (optional)
  logo?: string;         // Company logo URL (optional)
  role?: string;         // User role - "admin" ya kuch aur (optional)
}