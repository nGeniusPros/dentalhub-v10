/**
 * Utility functions for formatting data in the UI
 */

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @param locale - The locale to use for formatting (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number | null | undefined,
  currency = 'USD',
  locale = 'en-US'
): string => {
  if (amount === null || amount === undefined) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
};

/**
 * Format a decimal as a percentage
 * @param value - The decimal value to format (e.g., 0.75 for 75%)
 * @param decimals - Number of decimal places to include (default: 0)
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number | null | undefined,
  decimals = 0
): string => {
  if (value === null || value === undefined) return '';
  
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Format a number with specified options
 * @param value - The number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 */
export const formatNumber = (
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('en-US', options).format(value);
};

/**
 * Capitalize the first letter of a string
 * @param text - The string to capitalize
 * @returns String with first letter capitalized
 */
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Convert a string to title case
 * @param text - The string to convert
 * @returns Title case string
 */
export const toTitleCase = (text: string): string => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format a string from snake_case or camelCase to a readable label
 * @param key - The key to format
 * @returns Formatted label
 */
export const formatKeyAsLabel = (key: string): string => {
  if (!key) return '';
  
  // Replace underscores and camelCase with spaces
  let result = key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1');
  
  // Capitalize first letter and trim
  result = capitalizeFirstLetter(result.trim());
  
  return result;
};

/**
 * Format a phone number in (xxx) xxx-xxxx format
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Strip all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

/**
 * Truncate text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format boolean values as Yes/No
 * @param value - Boolean value
 * @returns 'Yes' or 'No' string
 */
export const formatYesNo = (value: boolean | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return value ? 'Yes' : 'No';
};