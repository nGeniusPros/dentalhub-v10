declare module '../../utils/dateUtils' {
  /**
   * Format a date string to a human-readable format
   * @param dateString The date string to format
   * @param includeTime Whether to include the time in the formatted result
   * @returns Formatted date string
   */
  export function formatDate(dateString: string, includeTime?: boolean): string;

  /**
   * Calculate the difference between two dates in days
   * @param startDate The starting date
   * @param endDate The ending date (defaults to current date)
   * @returns Number of days between the dates
   */
  export function daysBetween(startDate: string | Date, endDate?: string | Date): number;

  /**
   * Format a date range as a human-readable string
   * @param startDate The starting date
   * @param endDate The ending date
   * @returns Formatted date range
   */
  export function formatDateRange(startDate: string, endDate: string): string;

  /**
   * Get a relative date description (e.g., "2 days ago", "yesterday")
   * @param dateString The date string to format
   * @returns Human-readable relative time
   */
  export function getRelativeTimeString(dateString: string): string;
}