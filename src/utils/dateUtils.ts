/**
 * Date utility functions for consistent date formatting and calculations
 */

/**
 * Format a date string to a user-friendly date format without time
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string (e.g., "Mar 7, 2025")
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check for valid date
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Alias for formatDate for backwards compatibility
 */
export const formatDateOnly = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check for valid date
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format a date string to a user-friendly date and time format
 * @param dateString - ISO date string or Date object
 * @returns Formatted date and time string (e.g., "Mar 7, 2025, 3:55 PM")
 */
export const formatDateTime = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check for valid date
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Calculate days between the given date and today
 * @param dateString - ISO date string or Date object
 * @returns Number of days between the given date and today
 */
export const daysBetween = (dateString: string | Date): number => {
  if (!dateString) return 0;
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check for valid date
  if (isNaN(date.getTime())) return 0;
  
  // Set hours to midnight for accurate day calculation
  const startDate = new Date(date.setHours(0, 0, 0, 0));
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  
  // Calculate difference in milliseconds
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  // Convert to days
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Get the relative time string (e.g., "2 days ago", "just now")
 * @param dateString - ISO date string or Date object
 * @returns Relative time string
 */
export const getRelativeTimeString = (dateString: string | Date): string => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  // Check for valid date
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  }
  
  // Less than a week
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? 'yesterday' : `${days} days ago`;
  }
  
  // Less than a month
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  }
  
  // Less than a year
  const months = Math.floor(days / 30);
  if (months < 12) {
    return months === 1 ? '1 month ago' : `${months} months ago`;
  }
  
  // More than a year
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
};

/**
 * Format a date range as a string
 * @param startDate - Start date (ISO string or Date object)
 * @param endDate - End date (ISO string or Date object), optional
 * @returns Formatted date range (e.g., "Mar 1, 2025 - Mar 7, 2025" or "Mar 1, 2025 - Present")
 */
export const formatDateRange = (startDate: string | Date | undefined | null, endDate?: string | Date | undefined | null): string => {
  if (!startDate) return '';
  
  const formattedStart = formatDate(startDate);
  
  if (!endDate) {
    return `${formattedStart} - Present`;
  }
  
  const formattedEnd = formatDate(endDate);
  return `${formattedStart} - ${formattedEnd}`;
};