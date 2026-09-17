export interface User {
  _id: string;           // MongoDB unique ID
  name: string;          // User's full name.
  email: string;         // Email address (unique)
  phone?: string;        // Phone number (optional)
  company?: string;      // Company name (optional)
  logo?: string;         // Company logo URL (optional)
  role?: string;         // Optional user role, such as "admin".
}