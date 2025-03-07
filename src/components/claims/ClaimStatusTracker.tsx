import React from 'react';
import { Badge, Timeline } from 'flowbite-react';
import { ClaimStatus, ClaimEvent } from '../../types/claims.types';
import { HiCheck, HiClock, HiDocumentText, HiExclamation, HiCurrencyDollar, HiPaperAirplane } from 'react-icons/hi';

interface ClaimStatusTrackerProps {
  status: ClaimStatus;
  events: ClaimEvent[];
}

const ClaimStatusTracker: React.FC<ClaimStatusTrackerProps> = ({ status, events }) => {
  const getStatusColor = (status: ClaimStatus): string => {
    switch(status) {
      case ClaimStatus.DRAFT:
        return 'gray';
      case ClaimStatus.PENDING:
        return 'yellow';
      case ClaimStatus.SUBMITTED:
        return 'blue';
      case ClaimStatus.ACCEPTED:
        return 'info';
      case ClaimStatus.REJECTED:
        return 'red';
      case ClaimStatus.PAID:
        return 'green';
      default:
        return 'gray';
    }
  };
  
  const getStatusIcon = (status: ClaimStatus) => {
    switch(status) {
      case ClaimStatus.DRAFT:
        return HiDocumentText;
      case ClaimStatus.PENDING:
        return HiClock;
      case ClaimStatus.SUBMITTED:
        return HiPaperAirplane;
      case ClaimStatus.ACCEPTED:
        return HiCheck;
      case ClaimStatus.REJECTED:
        return HiExclamation;
      case ClaimStatus.PAID:
        return HiCurrencyDollar;
      default:
        return HiDocumentText;
    }
  };

  // Sort events by timestamp in descending order (newest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  return (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <h4 className="text-lg font-medium mr-3">Current Status:</h4>
        <Badge color={getStatusColor(status)} className="px-3 py-1.5 text-sm">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
      
      <div className="mt-4">
        <h5 className="text-base font-medium mb-3">Claim History</h5>
        
        {events.length === 0 ? (
          <p className="text-gray-500 text-sm">No claim history available</p>
        ) : (
          <Timeline>
            {sortedEvents.map((event, index) => {
              const StatusIcon = getStatusIcon(event.status);
              
              return (
                <Timeline.Item key={event.id || index}>
                  <Timeline.Point icon={StatusIcon} />
                  <Timeline.Content>
                    <Timeline.Time>
                      {new Date(event.timestamp).toLocaleString()}
                    </Timeline.Time>
                    <Timeline.Title>{event.title}</Timeline.Title>
                    <Timeline.Body className="text-sm text-gray-600">
                      {event.description}
                    </Timeline.Body>
                  </Timeline.Content>
                </Timeline.Item>
              );
            })}
          </Timeline>
        )}
      </div>
    </div>
  );
};

export default ClaimStatusTracker;