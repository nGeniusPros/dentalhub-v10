import React from 'react';
import { Badge, Timeline } from 'flowbite-react';
import { HiCheck, HiClock, HiDocumentText, HiExclamation, HiPaperAirplane, HiCash } from 'react-icons/hi';
import { ClaimStatus, ClaimEvent } from '../../types/claims.types';
import { formatDate } from '../../utils/dateUtils';

interface ClaimStatusTrackerProps {
  status: ClaimStatus;
  events: ClaimEvent[];
}

/**
 * Component for tracking the status of a claim with detailed event history
 */
export const ClaimStatusTracker: React.FC<ClaimStatusTrackerProps> = ({ status, events }) => {
  /**
   * Get the appropriate color for a claim status
   */
  const getStatusColor = (status: ClaimStatus): string => {
    switch(status) {
      case ClaimStatus.DRAFT: return 'gray';
      case ClaimStatus.PENDING: return 'yellow';
      case ClaimStatus.SUBMITTED: return 'blue';
      case ClaimStatus.ACCEPTED: return 'green';
      case ClaimStatus.REJECTED: return 'red';
      case ClaimStatus.PAID: return 'success';
      default: return 'gray';
    }
  };

  /**
   * Get the appropriate icon for a claim status
   */
  const getStatusIcon = (status: ClaimStatus) => {
    switch(status) {
      case ClaimStatus.DRAFT: return <HiDocumentText className="w-5 h-5" />;
      case ClaimStatus.PENDING: return <HiClock className="w-5 h-5" />;
      case ClaimStatus.SUBMITTED: return <HiPaperAirplane className="w-5 h-5" />;
      case ClaimStatus.ACCEPTED: return <HiCheck className="w-5 h-5" />;
      case ClaimStatus.REJECTED: return <HiExclamation className="w-5 h-5" />;
      case ClaimStatus.PAID: return <HiCash className="w-5 h-5" />;
      default: return <HiDocumentText className="w-5 h-5" />;
    }
  };
  
  // Sort events by timestamp in descending order
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h4 className="text-lg font-medium mr-3">Current Status:</h4>
        <Badge 
          color={getStatusColor(status)} 
          className="px-3 py-1.5 flex items-center"
          icon={() => getStatusIcon(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      {sortedEvents.length > 0 ? (
        <Timeline>
          {sortedEvents.map((event, index) => (
            <Timeline.Item key={index}>
              <Timeline.Point 
                icon={() => getStatusIcon(event.status)}
                className={`bg-${getStatusColor(event.status)}-100`}
              />
              <Timeline.Content>
                <Timeline.Time>{formatDate(event.timestamp)}</Timeline.Time>
                <Timeline.Title>{event.title}</Timeline.Title>
                <Timeline.Body>
                  <p className="text-gray-600">{event.description}</p>
                </Timeline.Body>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No events recorded for this claim
        </div>
      )}
    </div>
  );
};