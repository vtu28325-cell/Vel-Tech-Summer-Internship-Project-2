// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

// Auth form types
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// API response type
export interface ApiError {
  message: string;
}
