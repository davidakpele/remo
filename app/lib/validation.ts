import { LoginCredentials, RegisterCredentials } from "../types/user";


export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateLogin(credentials: LoginCredentials): void {
  if (!credentials.email) {
    throw new ValidationError('Email is required');
  }

  if (!credentials.email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }

  if (!credentials.password) {
    throw new ValidationError('Password is required');
  }

  if (credentials.password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters');
  }
}

export function validateRegister(credentials: RegisterCredentials): void {
  validateLogin(credentials);

  if (!credentials.name) {
    throw new ValidationError('Name is required');
  }

  if (credentials.name.length < 2) {
    throw new ValidationError('Name must be at least 2 characters');
  }

  if (credentials.password !== credentials.confirmPassword) {
    throw new ValidationError('Passwords do not match');
  }
}