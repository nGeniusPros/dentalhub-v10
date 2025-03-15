/**
 * Format a phone number to a standardized display format
 * @param phone Raw phone number string
 * @returns Formatted phone number (e.g., (123) 456-7890)
 */
export const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a valid US phone number (10 digits)
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  }
  
  // For other formats, do minimal formatting
  if (cleaned.length > 10) {
    // Possibly an international number, just add a + if it doesn't exist
    return phone.startsWith('+') ? phone : `+${cleaned}`;
  }
  
  // Return the original if no formatting applied
  return phone;
};

/**
 * Format a date to a locale-specific string
 * @param date Date to format (string or Date object)
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date?: string | Date | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return '';
  
  // Convert string to Date object if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  // Format using Intl API for localization
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format a date and time to a locale-specific string
 * @param date Date to format (string or Date object)
 * @param includeSeconds Whether to include seconds
 * @returns Formatted date and time string
 */
export const formatDateTime = (
  date?: string | Date | null,
  includeSeconds = false
): string => {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds ? { second: '2-digit' } : {})
  };
  
  return formatDate(date, options);
};

/**
 * Format a currency value
 * @param value Number to format as currency
 * @param currency Currency code (default: USD)
 * @param locale Locale string (default: en-US)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value?: number | null,
  currency = 'USD',
  locale = 'en-US'
): string => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a percentage value
 * @param value Number to format as percentage
 * @param decimals Number of decimal places to include
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value?: number | null,
  decimals = 1
): string => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

/**
 * Format a number with thousand separators
 * @param value Number to format
 * @param decimals Number of decimal places to include
 * @returns Formatted number string
 */
export const formatNumber = (
  value?: number | null,
  decimals = 0
): string => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format a full address
 * @param address Address components
 * @returns Formatted address string
 */
export const formatAddress = (address: {
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}): string => {
  const parts = [];
  
  if (address.street) {
    parts.push(address.street);
  }
  
  if (address.street2) {
    parts.push(address.street2);
  }
  
  const cityStateZip = [];
  if (address.city) cityStateZip.push(address.city);
  if (address.state) cityStateZip.push(address.state);
  if (address.postalCode) cityStateZip.push(address.postalCode);
  
  if (cityStateZip.length > 0) {
    parts.push(cityStateZip.join(', '));
  }
  
  if (address.country) {
    parts.push(address.country);
  }
  
  return parts.join('\n');
};

/**
 * Truncate a long string and add ellipsis
 * @param str String to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateString = (
  str?: string | null,
  maxLength = 50
): string => {
  if (!str) return '';
  
  if (str.length <= maxLength) return str;
  
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Convert a file size in bytes to a human-readable size
 * @param bytes File size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted file size string (e.g., '1.5 MB')
 */
export const formatFileSize = (
  bytes?: number | null,
  decimals = 1
): string => {
  if (bytes === undefined || bytes === null) return '';
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};