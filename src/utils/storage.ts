import { supabase } from '../config/auth';

/**
 * Initializes the Supabase storage buckets needed for the application
 * Creates buckets if they don't exist with appropriate public/private settings
 */
export const initializeStorage = async () => {
  try {
    // Create the documents bucket if it doesn't exist
    const { data: buckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      console.error('Error checking storage buckets:', getBucketsError);
      return;
    }
    
    // Check if documents bucket exists
    const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
    
    if (!documentsBucketExists) {
      // Create the documents bucket - public access
      const { error: createBucketError } = await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          'application/pdf',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'text/csv',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ]
      });
      
      if (createBucketError) {
        console.error('Error creating documents bucket:', createBucketError);
      } else {
        console.log('Created documents bucket for file storage');
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error initializing storage:', err);
    return false;
  }
};

/**
 * Ensures that a file name is valid for storage
 * Removes invalid characters and spaces
 */
export const sanitizeFileName = (fileName: string): string => {
  // Replace spaces and special characters
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')  // Replace invalid chars with underscore
    .replace(/_{2,}/g, '_');          // Replace multiple consecutive underscores with a single one
};

/**
 * Checks if the file type is supported
 */
export const isSupportedFileType = (mimeType: string): boolean => {
  const supportedTypes = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/csv',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  return supportedTypes.includes(mimeType);
};

/**
 * Get a friendly name for a file type
 */
export const getFileTypeName = (mimeType: string): string => {
  const types: Record<string, string> = {
    'application/pdf': 'PDF',
    'application/vnd.ms-excel': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'text/plain': 'Text',
    'text/csv': 'CSV',
    'application/vnd.ms-powerpoint': 'PowerPoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  };
  
  return types[mimeType] || 'Document';
};

/**
 * Format file size in KB or MB
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
};
