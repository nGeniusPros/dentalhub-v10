import { PracticeData } from '../data-retrieval/data-retrieval.agent';

/**
 * Analysis result containing KPI evaluations
 */
export interface KPIAnalysis {
  summary: string;
  metrics: {
    [key: string]: {
      actual: number;
      goal: number;
      performance: number; // percentage of goal achieved
      status: 'above-target' | 'on-target' | 'below-target';
      trend?: 'increasing' | 'stable' | 'decreasing';
      gap?: number;
    }
  };
  topPerformers: string[];
  areasForImprovement: string[];
}

/**
 * Data Analysis Agent
 * Responsible for analyzing practice data and identifying KPI patterns
 */
export class DataAnalysisAgent {
  private kpiGoals = {
    production: 155000,
    collections: 147500,
    hygiene: 78000,
    newPatients: 50,
    activePatients: 1300,
    recalls: {
      confirmed: 200
    },
    appointments: {
      noShows: 10, // target maximum
      cancellations: 8 // target maximum
    }
  };

  /**
   * Analyzes practice KPIs against goals
   * @param rawData Practice data to analyze
   * @returns KPI analysis results
   */
  public async analyzeKPI(rawData: PracticeData): Promise<KPIAnalysis> {
    // Calculate metrics performance against goals
    const metrics: KPIAnalysis['metrics'] = {};
    
    // Production KPI
    metrics.production = this.calculateMetric(
      rawData.production, 
      this.kpiGoals.production
    );
    
    // Collections KPI 
    metrics.collections = this.calculateMetric(
      rawData.collections, 
      this.kpiGoals.collections
    );
    
    // Hygiene KPI
    metrics.hygiene = this.calculateMetric(
      rawData.hygiene, 
      this.kpiGoals.hygiene
    );
    
    // New patients KPI
    metrics.newPatients = this.calculateMetric(
      rawData.newPatients, 
      this.kpiGoals.newPatients
    );
    
    // Active patients KPI
    metrics.activePatients = this.calculateMetric(
      rawData.activePatients, 
      this.kpiGoals.activePatients
    );
    
    // Recall confirmations KPI
    metrics.recallConfirmations = this.calculateMetric(
      rawData.recalls.confirmed, 
      this.kpiGoals.recalls.confirmed
    );
    
    // No-shows KPI (lower is better)
    metrics.noShows = this.calculateInverseMetric(
      rawData.appointments.noShows, 
      this.kpiGoals.appointments.noShows
    );
    
    // Cancellations KPI (lower is better)
    metrics.cancellations = this.calculateInverseMetric(
      rawData.appointments.cancellations, 
      this.kpiGoals.appointments.cancellations
    );

    // Identify top performers and areas for improvement
    const topPerformers = this.identifyTopPerformers(metrics);
    const areasForImprovement = this.identifyAreasForImprovement(metrics);
    
    // Generate summary
    const summary = this.generateSummary(metrics, topPerformers, areasForImprovement, rawData.timeframe);
    
    return {
      summary,
      metrics,
      topPerformers,
      areasForImprovement
    };
  }
  
  /**
   * Calculate metric performance (for metrics where higher is better)
   */
  private calculateMetric(actual: number, goal: number) {
    const performance = (actual / goal) * 100;
    const status = performance >= 95
      ? 'on-target' as const
      : performance >= 80
        ? 'below-target' as const
        : 'below-target' as const;
    
    return {
      actual,
      goal,
      performance,
      status,
      gap: actual < goal ? goal - actual : 0
    };
  }
  
  /**
   * Calculate metric performance (for metrics where lower is better)
   */
  private calculateInverseMetric(actual: number, goal: number) {
    // For metrics where lower is better (like no-shows)
    // If actual is lower than goal, we're doing better than the goal
    const performance = actual <= goal
      ? 100
      : (goal / actual) * 100;
    
    const status = performance >= 95
      ? 'on-target' as const
      : performance >= 80
        ? 'below-target' as const
        : 'below-target' as const;
    
    return {
      actual,
      goal,
      performance,
      status,
      gap: actual > goal ? actual - goal : 0
    };
  }
  
  /**
   * Identify top performing metrics
   */
  private identifyTopPerformers(metrics: KPIAnalysis['metrics']): string[] {
    return Object.entries(metrics)
      .filter(([, data]) => data.performance >= 95)
      .map(([key]) => key);
  }
  
  /**
   * Identify areas needing improvement
   */
  private identifyAreasForImprovement(metrics: KPIAnalysis['metrics']): string[] {
    return Object.entries(metrics)
      .filter(([, data]) => data.performance < 80)
      .map(([key]) => key);
  }
  
  /**
   * Generate a textual summary of the analysis
   */
  private generateSummary(
    metrics: KPIAnalysis['metrics'], 
    topPerformers: string[], 
    areasForImprovement: string[],
    timeframe: string
  ): string {
    let summary = `Practice KPI Analysis (${timeframe}):\n\n`;
    
    if (topPerformers.length > 0) {
      summary += `Strong performance in: ${topPerformers.join(', ')}.\n\n`;
    }
    
    if (areasForImprovement.length > 0) {
      summary += `Areas needing attention: ${areasForImprovement.join(', ')}.\n\n`;
    }
    
    // Add specific insights for key metrics
    if (metrics.production) {
      summary += `Production is at ${metrics.production.performance.toFixed(1)}% of target `;
      summary += metrics.production.gap 
        ? `with a gap of $${metrics.production.gap.toLocaleString()}.\n` 
        : `(exceeding target).\n`;
    }
    
    if (metrics.hygiene) {
      summary += `Hygiene production is at ${metrics.hygiene.performance.toFixed(1)}% of target `;
      summary += metrics.hygiene.gap 
        ? `with a gap of $${metrics.hygiene.gap.toLocaleString()}.\n` 
        : `(exceeding target).\n`;
    }
    
    return summary;
  }
}