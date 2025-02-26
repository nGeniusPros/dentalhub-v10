import { LabCase, LabCaseData } from '../data-retrieval/data-retrieval.agent';

/**
 * Lab Task - represents an action for a specific lab case
 */
export interface LabTask {
  caseId: string;
  taskType: 'follow-up' | 'call-lab' | 'call-patient' | 'check-status' | 'reschedule' | 'other';
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

/**
 * Lab Case Analysis Result
 */
export interface LabCaseAnalysis {
  summary: string;
  overdueCount: number;
  dueSoonCount: number;
  pendingTasks: LabTask[];
  caseDistribution: {
    byType: Record<string, number>;
    byLab: Record<string, number>;
    byStatus: Record<string, number>;
  };
}

/**
 * Lab Case Manager Agent
 * Manages and analyzes dental lab cases
 */
export class LabCaseManagerAgent {
  /**
   * Analyze and manages lab cases based on user query
   * @param query User query about lab cases
   * @returns Lab case analysis and management recommendations
   */
  public async manageLabCases(query: string): Promise<LabCaseAnalysis> {
    // In a real implementation, we would:
    // 1. Send query to DataRetrievalAgent to get lab case data
    // 2. Analyze the data
    // 3. Return management recommendations
    
    // For this demo, we'll use mock data
    const mockLabData: LabCaseData = {
      pendingCases: [
        { id: 'LC001', patient: 'John Smith', type: 'Crown', lab: 'Acme Dental Lab', sentDate: '2025-02-01', dueDate: '2025-02-15', status: 'In Progress' },
        { id: 'LC002', patient: 'Maria Garcia', type: 'Bridge', lab: 'Precision Dental', sentDate: '2025-02-05', dueDate: '2025-02-20', status: 'Pending Review' },
        { id: 'LC009', patient: 'David Miller', type: 'Crown', lab: 'Acme Dental Lab', sentDate: '2025-02-10', dueDate: '2025-02-24', status: 'In Progress' },
        { id: 'LC010', patient: 'Lisa Wong', type: 'Veneer', lab: 'Precision Dental', sentDate: '2025-02-12', dueDate: '2025-02-26', status: 'Pending Review' }
      ],
      receivedCases: [
        { id: 'LC003', patient: 'Robert Johnson', type: 'Denture', lab: 'Acme Dental Lab', sentDate: '2025-01-15', receivedDate: '2025-02-01', status: 'Ready for Delivery' },
        { id: 'LC008', patient: 'Emma Smith', type: 'Night Guard', lab: 'Acme Dental Lab', sentDate: '2025-01-20', receivedDate: '2025-02-05', status: 'Ready for Delivery' }
      ],
      completedCases: [
        { id: 'LC004', patient: 'Susan Williams', type: 'Veneer', lab: 'Precision Dental', sentDate: '2025-01-10', completedDate: '2025-01-31', status: 'Delivered' },
        { id: 'LC005', patient: 'James Brown', type: 'Implant', lab: 'Advanced Implant Lab', sentDate: '2025-01-05', completedDate: '2025-01-25', status: 'Delivered' },
        { id: 'LC006', patient: 'Jennifer Lee', type: 'Crown', lab: 'Acme Dental Lab', sentDate: '2025-01-08', completedDate: '2025-01-28', status: 'Delivered' },
        { id: 'LC007', patient: 'Michael Chen', type: 'Bridge', lab: 'Precision Dental', sentDate: '2025-01-12', completedDate: '2025-02-03', status: 'Delivered' }
      ]
    };
    
    return this.analyzeLabCases(mockLabData, query);
  }
  
  /**
   * Analyzes lab case data and generates tasks
   */
  private analyzeLabCases(labData: LabCaseData, query: string): LabCaseAnalysis {
    // Get current date for comparisons
    const currentDate = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(currentDate.getDate() + 1);
    
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(currentDate.getDate() + 7);
    
    console.log(`Analyzing lab cases based on query: "${query}"`);
    
    // In a real implementation, we would parse the query to determine:
    // - If looking for specific lab cases (by patient, type, lab, etc.)
    // - If requesting specific timeframe analysis
    // - If asking about specific actions (overdue, ready for delivery, etc.)
    
    // Identify overdue cases and ones due soon
    const overdueCases = labData.pendingCases.filter(c => {
      if (!c.dueDate) return false;
      return new Date(c.dueDate) < currentDate;
    });
    
    const dueSoonCases = labData.pendingCases.filter(c => {
      if (!c.dueDate) return false;
      const dueDate = new Date(c.dueDate);
      return dueDate >= currentDate && dueDate <= sevenDaysLater;
    });
    
    // Generate tasks for cases that need attention
    const pendingTasks: LabTask[] = [];
    
    // Tasks for overdue cases (highest priority)
    overdueCases.forEach(c => {
      pendingTasks.push({
        caseId: c.id,
        taskType: 'call-lab',
        description: `Follow up with ${c.lab} about overdue case for ${c.patient} (${c.type})`,
        dueDate: this.formatDate(tomorrow),
        priority: 'high'
      });
    });
    
    // Tasks for cases due within a week
    dueSoonCases.forEach(c => {
      pendingTasks.push({
        caseId: c.id,
        taskType: 'check-status',
        description: `Check status of ${c.type} for ${c.patient} with ${c.lab}, due ${c.dueDate}`,
        dueDate: this.formatDate(tomorrow),
        priority: 'medium'
      });
    });
    
    // Tasks for cases that are ready for delivery
    labData.receivedCases.forEach(c => {
      pendingTasks.push({
        caseId: c.id,
        taskType: 'call-patient',
        description: `Call ${c.patient} to schedule appointment for ${c.type} delivery`,
        dueDate: this.formatDate(tomorrow),
        priority: 'medium'
      });
    });
    
    // Generate distribution statistics
    const caseDistribution = {
      byType: this.countByCriteria(labData, 'type'),
      byLab: this.countByCriteria(labData, 'lab'),
      byStatus: this.countByCriteria(labData, 'status')
    };
    
    // Generate summary
    const summary = this.generateSummary(
      labData, 
      overdueCases.length, 
      dueSoonCases.length,
      pendingTasks
    );
    
    return {
      summary,
      overdueCount: overdueCases.length,
      dueSoonCount: dueSoonCases.length,
      pendingTasks,
      caseDistribution
    };
  }
  
  /**
   * Counts lab cases by a specified criteria (type, lab, status)
   */
  private countByCriteria(
    data: LabCaseData, 
    criteria: keyof LabCase
  ): Record<string, number> {
    const result: Record<string, number> = {};
    
    // Count across all case types
    const countCase = (c: LabCase) => {
      const value = c[criteria] as string;
      if (value) {
        result[value] = (result[value] || 0) + 1;
      }
    };
    
    // Process all case lists
    data.pendingCases.forEach(countCase);
    data.receivedCases.forEach(countCase);
    data.completedCases.forEach(countCase);
    
    return result;
  }
  
  /**
   * Generates a summary of lab case status
   */
  private generateSummary(
    data: LabCaseData,
    overdueCount: number,
    dueSoonCount: number,
    pendingTasks: LabTask[]
  ): string {
    const total = data.pendingCases.length + data.receivedCases.length + data.completedCases.length;
    
    let summary = `Lab Case Summary (${total} total cases):\n\n`;
    
    summary += `${data.pendingCases.length} cases pending, `;
    summary += `${data.receivedCases.length} received and ready for delivery, `;
    summary += `${data.completedCases.length} completed.\n\n`;
    
    if (overdueCount > 0) {
      summary += `ATTENTION: ${overdueCount} overdue case${overdueCount > 1 ? 's' : ''} requiring immediate follow-up.\n`;
    }
    
    if (dueSoonCount > 0) {
      summary += `${dueSoonCount} case${dueSoonCount > 1 ? 's' : ''} due within the next 7 days.\n`;
    }
    
    if (pendingTasks.length > 0) {
      summary += `\n${pendingTasks.length} pending task${pendingTasks.length > 1 ? 's' : ''} that require attention.\n`;
      const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high').length;
      if (highPriorityTasks > 0) {
        summary += `  - ${highPriorityTasks} high priority task${highPriorityTasks > 1 ? 's' : ''}\n`;
      }
    }
    
    return summary;
  }
  
  /**
   * Helper to format date as string
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}