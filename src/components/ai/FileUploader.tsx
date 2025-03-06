import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../../config/auth';
import { Button } from '../ui/button';
import * as Icons from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { 
  initializeStorage, 
  sanitizeFileName, 
  isSupportedFileType, 
  getFileTypeName, 
  formatFileSize 
} from '../../utils/storage';

// Supported file types
const SUPPORTED_FILE_TYPES = [
  'application/pdf',                                                // PDF
  'application/vnd.ms-excel',                                      // Excel (old)
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Excel (new)
  'application/msword',                                            // Word (old)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Word (new)
  'text/plain',                                                    // TXT
  'text/csv',                                                      // CSV
  'application/vnd.ms-powerpoint',                                // PowerPoint (old)
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PowerPoint (new)
];

// File type icons mapping
const FILE_TYPE_ICONS: Record<string, keyof typeof Icons> = {
  'application/pdf': 'FileText',
  'application/vnd.ms-excel': 'Table',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Table',
  'application/msword': 'FileText',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'FileText',
  'text/plain': 'FileText',
  'text/csv': 'Table',
  'application/vnd.ms-powerpoint': 'PresentationChart',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PresentationChart',
};

// Helper to get friendly names for file types
// const getFileTypeName = (mimeType: string): string => {
//   const types: Record<string, string> = {
//     'application/pdf': 'PDF',
//     'application/vnd.ms-excel': 'Excel',
//     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
//     'application/msword': 'Word',
//     'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
//     'text/plain': 'Text',
//     'text/csv': 'CSV',
//     'application/vnd.ms-powerpoint': 'PowerPoint',
//     'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
//   };
  
//   return types[mimeType] || 'Document';
// };

// Format file size in KB or MB
// const formatFileSize = (bytes: number): string => {
//   if (bytes < 1024 * 1024) {
//     return `${Math.round(bytes / 1024)}KB`;
//   }
//   return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
// };

interface FileUploaderProps {
  onFileUploaded: (fileData: {
    title: string;
    url: string;
    fileType: string;
    fileSize: string;
    mimeType: string;
  }) => void;
  maxSizeMB?: number;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUploaded,
  maxSizeMB = 10 // Default max size is 10MB
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize storage bucket on component mount
  useEffect(() => {
    initializeStorage().catch(err => {
      console.error('Failed to initialize storage:', err);
      setError('Storage initialization failed. Please try again later.');
    });
  }, []);

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  // Process and upload the file
  const processFile = async (file: File) => {
    setError(null);
    
    // Validate file type
    if (!isSupportedFileType(file.type)) {
      setError('Unsupported file type. Please upload PDF, Excel, Word, PowerPoint, CSV, or Text files.');
      return;
    }
    
    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File is too large. Maximum file size is ${maxSizeMB}MB.`);
      return;
    }
    
    try {
      setIsUploading(true);
      setProgress(10);
      
      // Generate a unique file name to avoid conflicts
      const fileExt = file.name.split('.').pop();
      const safeFileName = sanitizeFileName(file.name.split('.')[0]);
      const fileName = `${safeFileName}_${uuidv4().substring(0, 8)}.${fileExt}`;
      const filePath = `knowledge-base/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      setProgress(70);
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      setProgress(90);
      
      // Call the callback with the file data
      onFileUploaded({
        title: file.name,
        url: urlData.publicUrl,
        fileType: getFileTypeName(file.type),
        fileSize: formatFileSize(file.size),
        mimeType: file.type
      });
      
      setProgress(100);
      
    } catch (err) {
      console.error('File upload error:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Prompt file selection dialog
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={SUPPORTED_FILE_TYPES.join(',')}
      />
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-navy bg-navy/5' : 'border-gray-300 hover:border-navy hover:bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileSelector}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFileSelector();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Click or drag files to upload"
      >
        {isUploading ? (
          <div className="py-4">
            <div className="flex justify-center mb-2">
              <Icons.Upload className="h-12 w-12 text-navy animate-pulse" />
            </div>
            <p className="text-gray-600 mb-2">Uploading file... {progress}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-navy h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <Icons.Upload className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">
              Drag and drop your files here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse (Max {maxSizeMB}MB)
            </p>
            <p className="text-xs text-gray-400">
              Supported files: PDF, Excel, Word, PowerPoint, CSV, Text
            </p>
          </>
        )}
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          <Icons.AlertCircle className="w-4 h-4 inline mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
