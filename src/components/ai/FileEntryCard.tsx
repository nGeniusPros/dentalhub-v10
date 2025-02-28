import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';

interface FileEntryCardProps {
  id: string;
  title: string;
  fileType: string;
  fileSize: string;
  url: string;
  created: string;
  onDelete: (id: string) => void;
  bundle?: string;
  bundleName?: string;
  agents?: string[];
}

// Map file types to icons
const getFileIcon = (fileType: string): keyof typeof Icons => {
  const typeMap: Record<string, keyof typeof Icons> = {
    'PDF': 'FileText',
    'Excel': 'Table',
    'Word': 'FileText',
    'Text': 'File',
    'CSV': 'Table',
    'PowerPoint': 'PresentationChart',
  };
  
  return typeMap[fileType] || 'File';
};

// Map file types to colors
const getFileColor = (fileType: string): string => {
  const colorMap: Record<string, string> = {
    'PDF': 'text-red-500 bg-red-50',
    'Excel': 'text-green-600 bg-green-50',
    'Word': 'text-blue-500 bg-blue-50',
    'Text': 'text-gray-500 bg-gray-50',
    'CSV': 'text-green-500 bg-green-50',
    'PowerPoint': 'text-orange-500 bg-orange-50',
  };
  
  return colorMap[fileType] || 'text-gray-500 bg-gray-50';
};

const FileEntryCard: React.FC<FileEntryCardProps> = ({
  id,
  title,
  fileType,
  fileSize,
  url,
  created,
  onDelete,
  bundle,
  bundleName,
  agents
}) => {
  const Icon = Icons[getFileIcon(fileType)];
  const colorClass = getFileColor(fileType);
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-4 border border-gray-100">
      <div className="flex items-start">
        <div className={`p-3 rounded-lg mr-4 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-medium text-gray-900 truncate">{title}</h3>
            <div className="flex gap-2 ml-2">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-navy hover:text-navy-light"
              >
                <Icons.ExternalLink className="w-4 h-4" />
              </a>
              <button 
                onClick={() => onDelete(id)}
                className="text-red-500 hover:text-red-600"
              >
                <Icons.Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span className="mr-3">{fileType}</span>
            <span className="mr-3">•</span>
            <span>{fileSize}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {bundle && (
              <span className="inline-flex items-center rounded-full bg-purple/10 px-2 py-1 text-xs font-medium text-purple">
                <Icons.FolderClosed className="w-3 h-3 mr-1" />
                {bundleName || bundle}
              </span>
            )}
            
            {agents && agents.length > 0 && (
              <span className="inline-flex items-center rounded-full bg-navy/10 px-2 py-1 text-xs font-medium text-navy">
                <Icons.Users className="w-3 h-3 mr-1" />
                {agents.length} Agent{agents.length !== 1 ? 's' : ''}
              </span>
            )}
            
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
              <Icons.Clock className="w-3 h-3 mr-1" />
              {formatDate(created)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileEntryCard;
