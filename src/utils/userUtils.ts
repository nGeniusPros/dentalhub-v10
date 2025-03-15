/**
 * Get initials from a name
 * @param name Full name to extract initials from
 * @returns Uppercase initials (1-2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  // Split the name by spaces and get the first letter of each part
  const parts = name.trim().split(/\s+/);
  
  if (parts.length === 1) {
    // If only one part, return the first character
    return parts[0].charAt(0).toUpperCase();
  } else {
    // If multiple parts, return first letter of first and last parts
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
};

/**
 * Get a consistent color based on a string (like a name or ID)
 * @param str Input string
 * @returns Hexadecimal color code
 */
export const getColorFromString = (str: string): string => {
  // Default color for empty strings
  if (!str) return '#1890ff';
  
  // Generate a simple hash from the string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to hexadecimal and ensure it's not too light
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    // Limit the minimum brightness (value between 40 and 200)
    value = Math.max(40, Math.min(200, value));
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
};

/**
 * Format a user's name for display
 * @param user User object with name and email properties
 * @returns Formatted name
 */
export const formatUserName = (user: { name?: string | null, email?: string | null }): string => {
  // If name exists, use it
  if (user?.name) return user.name;
  
  // Otherwise, use email without domain
  if (user?.email) {
    const emailParts = user.email.split('@');
    return emailParts[0];
  }
  
  // Default case
  return 'Unknown User';
};