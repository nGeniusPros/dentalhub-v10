import { supabase } from '../config/auth';

/**
 * Sanitizes database inputs to prevent SQL injection
 * @param input The string to sanitize
 * @returns Sanitized string safe for database operations
 */
export const sanitizeDbInput = (input: string): string => {
  if (!input) return '';
  
  // Remove SQL injection patterns
  return input
    .replace(/'/g, "''")                // Escape single quotes
    .replace(/;/g, '')                  // Remove semicolons
    .replace(/--/g, '')                 // Remove comment markers
    .replace(/\/\*/g, '')               // Remove comment openings
    .replace(/\*\//g, '')               // Remove comment closings
    .trim();
};

/**
 * Sanitizes database keys to prevent SQL injection in column names
 * @param key The key to sanitize
 * @returns Sanitized key safe for database operations
 */
export const sanitizeDbKey = (key: string): string => {
  if (!key) return '';
  
  // Only allow alphanumeric characters and underscores in keys
  return key.replace(/[^a-zA-Z0-9_]/g, "");
};

/**
 * Validates an email string
 * @param email The email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export { supabase };
