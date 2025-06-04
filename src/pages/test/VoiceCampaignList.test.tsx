import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VoiceCampaignList } from '@/pages/admin/communications/components/voice/VoiceCampaignList';
import { getCampaigns, updateCampaignStatus, deleteCampaign } from '@/services/voiceCampaignService';

// Mock the modules
jest.mock('@/services/voiceCampaignService');

// Mock the toast implementation
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();

jest.mock('sonner', () => ({
  toast: {
    success: mockToastSuccess,
    error: mockToastError,
  },
}));

// Mock the window.confirm function
const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

const mockCampaigns = [
  {
    id: '1',
    name: 'Recall Campaign',
    type: 'recall',
    status: 'active',
    targetCount: 100,
    completedCalls: 45,
    successRate: 75,
    scheduledDate: '2023-06-15T10:00:00Z',
    lastRun: '2023-06-01T09:30:00Z',
  },
  {
    id: '2',
    name: 'Reactivation Campaign',
    type: 'reactivation',
    status: 'paused',
    targetCount: 200,
    completedCalls: 80,
    successRate: 60,
    lastRun: '2023-05-28T14:15:00Z',
  },
];

describe('VoiceCampaignList', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock the API responses
    (getCampaigns as jest.Mock).mockResolvedValue(mockCampaigns);
    (updateCampaignStatus as jest.Mock).mockResolvedValue({});
    (deleteCampaign as jest.Mock).mockResolvedValue({});
  });

  it('renders loading state initially', async () => {
    render(<VoiceCampaignList />);
    
    // Check if loading spinner is shown
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(getCampaigns).toHaveBeenCalledTimes(1);
    });
  });

  it('displays campaigns after loading', async () => {
    render(<VoiceCampaignList />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Recall Campaign')).toBeInTheDocument();
      expect(screen.getByText('Reactivation Campaign')).toBeInTheDocument();
    });
    
    // Check if campaign details are displayed
    expect(screen.getByText('recall Campaign')).toBeInTheDocument();
    expect(screen.getByText('reactivation Campaign')).toBeInTheDocument();
    expect(screen.getByText('45/100')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('handles campaign status update', async () => {
    // Mock the update function
    (updateCampaignStatus as jest.Mock).mockResolvedValueOnce({});
    
    render(<VoiceCampaignList />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Recall Campaign')).toBeInTheDocument();
    });
    
    // Find and click the pause button for the first campaign
    const pauseButton = screen.getAllByRole('button', { name: /pause campaign/i })[0];
    fireEvent.click(pauseButton);
    
    // Check if the API was called with the correct parameters
    await waitFor(() => {
      expect(updateCampaignStatus).toHaveBeenCalledWith('1', 'paused');
      expect(mockToastSuccess).toHaveBeenCalledWith('Campaign status updated to paused');
    });
  });

  it('handles campaign deletion', async () => {
    // Mock the delete function
    (deleteCampaign as jest.Mock).mockResolvedValueOnce({});
    
    // Mock window.confirm
    mockConfirm.mockReturnValueOnce(true);
    
    render(<VoiceCampaignList />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Recall Campaign')).toBeInTheDocument();
    });
    
    // Find and click the delete button for the first campaign
    const deleteButton = screen.getAllByRole('button', { name: /delete campaign/i })[0];
    fireEvent.click(deleteButton);
    
    // Check if the confirmation dialog was shown
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this campaign?');
    
    // Check if the API was called with the correct parameters
    await waitFor(() => {
      expect(deleteCampaign).toHaveBeenCalledWith('1');
      expect(mockToastSuccess).toHaveBeenCalledWith('Campaign deleted successfully');
    });
  });

  it('handles API errors', async () => {
    // Mock an API error
    const errorMessage = 'Failed to fetch campaigns';
    (getCampaigns as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    
    render(<VoiceCampaignList />);
    
    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Failed to load campaigns. Please try again.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
    
    // Test retry functionality
    (getCampaigns as jest.Mock).mockResolvedValueOnce(mockCampaigns);
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    
    // Check if data is loaded after retry
    await waitFor(() => {
      expect(screen.getByText('Recall Campaign')).toBeInTheDocument();
    });
    
    // Check if error toast was shown
    expect(mockToastError).toHaveBeenCalledWith('Failed to load campaigns');
  });
  
  it('displays empty state when no campaigns exist', async () => {
    // Mock empty campaigns array
    (getCampaigns as jest.Mock).mockResolvedValueOnce([]);
    
    render(<VoiceCampaignList />);
    
    // Wait for empty state
    await waitFor(() => {
      expect(screen.getByText('No campaigns found')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating your first campaign')).toBeInTheDocument();
    });
  });
  
  it('toggles between active and paused states', async () => {
    // Mock the update function
    (updateCampaignStatus as jest.Mock).mockResolvedValue({});
    
    render(<VoiceCampaignList />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Recall Campaign')).toBeInTheDocument();
    });
    
    // Find and click the pause button for the first campaign
    const pauseButton = screen.getAllByRole('button', { name: /pause campaign/i })[0];
    fireEvent.click(pauseButton);
    
    // Check if the API was called to pause the campaign
    await waitFor(() => {
      expect(updateCampaignStatus).toHaveBeenCalledWith('1', 'paused');
      expect(mockToastSuccess).toHaveBeenCalledWith('Campaign status updated to paused');
    });
    
    // Now test resuming the campaign
    const resumeButton = screen.getAllByRole('button', { name: /resume campaign/i })[0];
    fireEvent.click(resumeButton);
    
    // Check if the API was called to resume the campaign
    await waitFor(() => {
      expect(updateCampaignStatus).toHaveBeenCalledWith('1', 'active');
      expect(mockToastSuccess).toHaveBeenCalledWith('Campaign status updated to active');
    });
  });
});
