// src/types/user.ts
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  logo?: string;
}