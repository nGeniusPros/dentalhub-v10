import React, { useState } from 'react';
import { Button, Card, Label, FileInput, Spinner } from 'flowbite-react';
import { HiDocumentAdd, HiTrash, HiEye } from 'react-icons/hi';
import { Attachment } from '../../types/claims.types';
import { formatDate } from '../../utils/dateUtils';

interface AttachmentManagerProps {
  claimId: string;
  existingAttachments: Attachment[];
  onAttachmentAdded: (attachment: Attachment) => void;
  onAttachmentRemoved: (attachmentId: string) => void;
  isUploading?: boolean;
}

/**
 * Component for managing file attachments for claims
 */
export const AttachmentManager: React.FC<AttachmentManagerProps> = ({
  claimId,
  existingAttachments,
  onAttachmentAdded,
  onAttachmentRemoved,
  isUploading = false
}) => {
  const [uploading, setUploading] = useState(isUploading);
  const [attachmentType, setAttachmentType] = useState('xray');
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Handle file selection and upload
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setError(null);
    
    try {
      const file = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }
      
      // Validate file type based on attachment type
      validateFileType(file, attachmentType);
      
      // In a real implementation, this would call an API to upload the file
      // and return the new attachment information
      // For now, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAttachment: Attachment = {
        id: `attachment-${Date.now()}`,
        claimId,
        filename: file.name,
        type: attachmentType,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        size: file.size,
        contentType: file.type
      };
      
      onAttachmentAdded(newAttachment);
      e.target.value = ''; // Reset the file input
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };
  
  /**
   * Validate file type based on attachment type
   */
  const validateFileType = (file: File, type: string): void => {
    const allowedTypes: Record<string, string[]> = {
      xray: ['image/jpeg', 'image/png', 'application/pdf', 'image/dicom'],
      photo: ['image/jpeg', 'image/png'],
      perio: ['application/pdf', 'image/jpeg', 'image/png'],
      narrative: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      other: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain']
    };
    
    if (!allowedTypes[type]?.includes(file.type)) {
      throw new Error(`Invalid file type for ${type}. Allowed types: ${allowedTypes[type].join(', ')}`);
    }
  };
  
  /**
   * Format file size in a human-readable way
   */
  const formatFileSize = (bytes: number | undefined): string => {
    if (bytes === undefined) return 'Unknown size';
    
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  return (
    <Card>
      <h4 className="text-lg font-medium mb-3">Claim Attachments</h4>
      
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <Label htmlFor="attachmentType">Attachment Type</Label>
            <select
              id="attachmentType"
              className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              value={attachmentType}
              onChange={(e) => setAttachmentType(e.target.value)}
              disabled={uploading}
            >
              <option value="xray">X-Ray</option>
              <option value="photo">Clinical Photo</option>
              <option value="perio">Periodontal Chart</option>
              <option value="narrative">Narrative</option>
              <option value="other">Other Documentation</option>
            </select>
          </div>
          <div>
            <Label htmlFor="fileUpload">Upload File</Label>
            <FileInput
              id="fileUpload"
              onChange={handleFileUpload}
              disabled={uploading}
              helperText="Max file size: 10MB"
            />
          </div>
        </div>
        
        {uploading && (
          <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg">
            <Spinner size="sm" className="mr-2" />
            <span className="text-sm text-gray-600">Uploading file...</span>
          </div>
        )}
        
        {error && (
          <div className="p-2 mt-2 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      {existingAttachments.length > 0 && (
        <div className="border rounded-lg p-3">
          <h5 className="font-medium mb-2">Attached Documents ({existingAttachments.length})</h5>
          <ul className="divide-y">
            {existingAttachments.map((attachment) => (
              <li key={attachment.id} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <div className="font-medium">{attachment.filename}</div>
                  <div className="text-sm text-gray-500">
                    <span className="capitalize">{attachment.type}</span>
                    {attachment.size && ` • ${formatFileSize(attachment.size)}`}
                    {` • Uploaded ${formatDate(attachment.uploadedAt)}`}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => window.open(attachment.url)}
                    className="flex items-center"
                  >
                    <HiEye className="mr-1" /> View
                  </Button>
                  <Button 
                    size="xs" 
                    color="failure"
                    onClick={() => onAttachmentRemoved(attachment.id)}
                    className="flex items-center"
                  >
                    <HiTrash className="mr-1" /> Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {existingAttachments.length === 0 && !uploading && (
        <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
          <HiDocumentAdd className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            No attachments yet. Add supporting documentation to improve claim approval chances.
          </p>
        </div>
      )}
    </Card>
  );
};