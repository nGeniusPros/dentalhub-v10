import { KPIAnalysis } from '../data-analysis/data-analysis.agent';

/**
 * Recommendation object containing advice and action items
 */
export interface Recommendation {
  category: 'production' | 'hygiene' | 'scheduling' | 'patient-retention' | 'marketing' | 'team' | 'general';
  title: string;
  description: string;
  actionItems: string[];
  priority: 'high' | 'medium' | 'low';
  impact: 'immediate' | 'short-term' | 'long-term';
  resources?: string[];
}

/**
 * Recommendation Agent
 * Generates targeted recommendations based on data analysis
 */
export class RecommendationAgent {
  /**
   * Generates recommendations based on KPI analysis
   * @param analysis The KPI analysis results
   * @returns Array of recommendations
   */
  public async generateRecommendations(analysis: KPIAnalysis): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];
    
    // Generate recommendations for each area needing improvement
    for (const area of analysis.areasForImprovement) {
      switch (area) {
        case 'production':
          recommendations.push(this.getProductionRecommendation(analysis));
          break;
        case 'hygiene':
          recommendations.push(this.getHygieneRecommendation(analysis));
          break;
        case 'newPatients':
          recommendations.push(this.getNewPatientsRecommendation(analysis));
          break;
        case 'activePatients':
          recommendations.push(this.getPatientRetentionRecommendation(analysis));
          break;
        case 'recallConfirmations':
          recommendations.push(this.getRecallRecommendation(analysis));
          break;
        case 'noShows':
          recommendations.push(this.getNoShowRecommendation(analysis));
          break;
        case 'cancellations':
          recommendations.push(this.getCancellationRecommendation(analysis));
          break;
      }
    }
    
    // Add general recommendations if we have few specific ones
    if (recommendations.length <= 1) {
      recommendations.push(this.getGeneralRecommendation(analysis));
    }
    
    return recommendations;
  }

  /**
   * Generates a recommendation for improving production numbers
   */
  private getProductionRecommendation(analysis: KPIAnalysis): Recommendation {
    const gap = analysis.metrics.production.gap || 0;
    
    return {
      category: 'production',
      title: 'Increase Overall Production',
      description: `Production is at ${analysis.metrics.production.performance.toFixed(1)}% of target with a gap of $${gap.toLocaleString()}.`,
      actionItems: [
        'Review treatment presentation acceptance rate and enhance communication',
        'Schedule a team meeting to review production goals and strategies',
        'Identify incomplete treatment plans and schedule follow-up calls',
        'Consider adjusting fee schedule if it hasn\'t been updated recently'
      ],
      priority: 'high',
      impact: 'short-term',
      resources: [
        'Treatment Presentation Guide',
        'Fee Schedule Analysis Tool'
      ]
    };
  }

  /**
   * Generates a recommendation for improving hygiene numbers
   */
  private getHygieneRecommendation(analysis: KPIAnalysis): Recommendation {
    const gap = analysis.metrics.hygiene.gap || 0;
    
    return {
      category: 'hygiene',
      title: 'Boost Hygiene Department Production',
      description: `Hygiene production is at ${analysis.metrics.hygiene.performance.toFixed(1)}% of target with a gap of $${gap.toLocaleString()}.`,
      actionItems: [
        'Review hygiene schedule for open slots and optimize booking',
        'Implement a recall reactivation campaign for overdue patients',
        'Consider adding additional hygiene days if capacity is limited',
        'Ensure hygienists are performing thorough perio assessments'
      ],
      priority: 'high',
      impact: 'immediate',
      resources: [
        'Hygiene Department Optimization Guide',
        'Recall Reactivation Scripts'
      ]
    };
  }

  /**
   * Generates a recommendation for improving new patient numbers
   */
  private getNewPatientsRecommendation(analysis: KPIAnalysis): Recommendation {
    return {
      category: 'marketing',
      title: 'Increase New Patient Acquisition',
      description: `New patient count is at ${analysis.metrics.newPatients.performance.toFixed(1)}% of target.`,
      actionItems: [
        'Review marketing budget allocation and ROI by channel',
        'Enhance online presence through Google Business Profile optimization',
        'Implement a referral incentive program for existing patients',
        'Engage with local businesses for cross-promotion opportunities'
      ],
      priority: 'medium',
      impact: 'short-term',
      resources: [
        'Marketing Channel ROI Calculator',
        'Google Business Profile Optimization Guide',
        'Referral Program Templates'
      ]
    };
  }

  /**
   * Generates a recommendation for improving patient retention
   */
  private getPatientRetentionRecommendation(analysis: KPIAnalysis): Recommendation {
    return {
      category: 'patient-retention',
      title: 'Enhance Patient Retention Strategy',
      description: `Active patient count is at ${analysis.metrics.activePatients.performance.toFixed(1)}% of target.`,
      actionItems: [
        'Implement systematic post-appointment follow-up calls',
        'Create a patient reactivation workflow for patients not seen in 12+ months',
        'Review patient experience and identify improvement opportunities',
        'Consider patient appreciation events or loyalty programs'
      ],
      priority: 'medium',
      impact: 'long-term',
      resources: [
        'Patient Reactivation Workflow',
        'Patient Experience Survey Template'
      ]
    };
  }

  /**
   * Generates a recommendation for improving recall effectiveness
   */
  private getRecallRecommendation(analysis: KPIAnalysis): Recommendation {
    return {
      category: 'scheduling',
      title: 'Optimize Recall Confirmation Process',
      description: `Recall confirmation rate is at ${analysis.metrics.recallConfirmations.performance.toFixed(1)}% of target.`,
      actionItems: [
        'Implement multi-channel recall reminders (text, email, phone)',
        'Set up automated recall confirmation system',
        'Train team on effective recall scripts and objection handling',
        'Analyze optimal timing for recall messages'
      ],
      priority: 'high',
      impact: 'immediate',
      resources: [
        'Recall Optimization Guide',
        'Multi-Channel Communication Templates'
      ]
    };
  }

  /**
   * Generates a recommendation for reducing no-shows
   */
  private getNoShowRecommendation(analysis: KPIAnalysis): Recommendation {
    return {
      category: 'scheduling',
      title: 'Reduce Appointment No-Shows',
      description: `No-show rate is higher than target (${analysis.metrics.noShows.actual} vs goal of ${analysis.metrics.noShows.goal}).`,
      actionItems: [
        'Implement 48-hour and 24-hour appointment confirmations',
        'Create a clear no-show policy and communicate it to patients',
        'Consider implementing a small reservation fee for appointments',
        'Analyze no-show patterns (days, times, providers) to identify trends'
      ],
      priority: 'medium',
      impact: 'immediate',
      resources: [
        'No-Show Policy Template',
        'Appointment Confirmation Workflow'
      ]
    };
  }

  /**
   * Generates a recommendation for reducing cancellations
   */
  private getCancellationRecommendation(analysis: KPIAnalysis): Recommendation {
    return {
      category: 'scheduling',
      title: 'Reduce Last-Minute Cancellations',
      description: `Cancellation rate is higher than target (${analysis.metrics.cancellations.actual} vs goal of ${analysis.metrics.cancellations.goal}).`,
      actionItems: [
        'Reinforce the value of appointments during scheduling',
        'Create a cancellation policy requiring 24-48 hour notice',
        'Train front desk on handling cancellation calls and rebooking',
        'Implement a standby list to quickly fill cancelled appointments'
      ],
      priority: 'medium',
      impact: 'immediate',
      resources: [
        'Cancellation Management Protocol',
        'Front Desk Training Guide'
      ]
    };
  }

  /**
   * Generates a general recommendation when no specific improvements needed
   */
  private getGeneralRecommendation(analysis: KPIAnalysis): Recommendation {
    // Find strongest performing area
    let topArea = 'general';
    let topPerformance = 0;
    
    for (const [key, data] of Object.entries(analysis.metrics)) {
      if (data.performance > topPerformance) {
        topPerformance = data.performance;
        topArea = key;
      }
    }
    
    return {
      category: 'general',
      title: 'Maintain Practice Excellence',
      description: `Overall practice performance is strong, with ${topArea} being a standout area at ${topPerformance.toFixed(1)}% of target.`,
      actionItems: [
        'Conduct quarterly KPI review sessions with the full team',
        'Document successful strategies to replicate best practices',
        'Invest in team education and development to enhance skills',
        'Explore new service opportunities based on patient demographics'
      ],
      priority: 'low',
      impact: 'long-term',
      resources: [
        'Quarterly KPI Review Template',
        'Team Development Resources'
      ]
    };
  }
}