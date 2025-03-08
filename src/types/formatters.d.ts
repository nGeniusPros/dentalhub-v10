declare module '../../utils/formatters' {
  /**
   * Format a number as a currency value
   * @param value The numeric value to format
   * @param currency The currency code (default: USD)
   * @returns Formatted currency string
   */
  export function formatCurrency(value: number, currency?: string): string;

  /**
   * Format a number as a percentage
   * @param value The numeric value (0-1) to format
   * @returns Formatted percentage string
   */
  export function formatPercentage(value: number): string;

  /**
   * Format a file size in bytes to a human-readable format
   * @param bytes The size in bytes
   * @returns Formatted file size string (e.g., "1.5 MB")
   */
  export function formatFileSize(bytes: number): string;

  /**
   * Format a phone number to a standardized format
   * @param phone The phone number string
   * @returns Formatted phone number
   */
  export function formatPhoneNumber(phone: string): string;
}