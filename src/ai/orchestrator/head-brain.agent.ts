import { DataRetrievalAgent } from '../data-retrieval/data-retrieval.agent';
import { DataAnalysisAgent, KPIAnalysis } from '../data-analysis/data-analysis.agent';
import { RecommendationAgent, Recommendation } from '../recommendation/recommendation.agent';
import { LabCaseManagerAgent, LabCaseAnalysis } from '../lab-case-manager/lab-case-manager.agent';
import { DeepSeekClient } from '../deep-seek/deepSeekUtils';

/**
 * Section types for HeadBrainResponse
 */
type TextSection = {
  type: 'text';
  title: string;
  content: string;
};

type KpiAnalysisSection = {
  type: 'kpi-analysis';
  title: string;
  content: KPIAnalysis;
};

type RecommendationsSection = {
  type: 'recommendations';
  title: string;
  content: Recommendation[];
};

type LabCasesSection = {
  type: 'lab-cases';
  title: string;
  content: LabCaseAnalysis;
};

type DeepSeekContextSection = {
  type: 'deep-seek-context';
  title: string;
  content: string;
};

type ResponseSection =
  | TextSection
  | KpiAnalysisSection
  | RecommendationsSection
  | LabCasesSection
  | DeepSeekContextSection;

/**
 * Response from the Head Brain Consultant
 */
export interface HeadBrainResponse {
  answer: string;
  sections: ResponseSection[];
  sources?: string[];
}

/**
 * Head Brain Consultant (Orchestrator)
 * Coordinates between specialized sub-agents to handle user queries
 */
export class HeadBrainConsultant {
  private dataRetrievalAgent: DataRetrievalAgent;
  private dataAnalysisAgent: DataAnalysisAgent;
  private recommendationAgent: RecommendationAgent;
  private labCaseManagerAgent: LabCaseManagerAgent;
  private deepSeekClient: DeepSeekClient;

  constructor() {
    this.dataRetrievalAgent = new DataRetrievalAgent();
    this.dataAnalysisAgent = new DataAnalysisAgent();
    this.recommendationAgent = new RecommendationAgent();
    this.labCaseManagerAgent = new LabCaseManagerAgent();
    this.deepSeekClient = new DeepSeekClient();
  }

  /**
   * Main entry point for user queries
   * @param userQuery The question or request from the user
   * @returns Unified, aggregated response
   */
  public async handleQuery(userQuery: string): Promise<HeadBrainResponse> {
    try {
      console.log(`Head Brain Consultant processing query: "${userQuery}"`);
      
      // 1. First retrieve context from vector DB
      let deepSeekContext: string[] = [];
      console.log("Retrieving deep-seek context...");
      deepSeekContext = await this.deepSeekClient.queryEmbeddings(userQuery, 5);
      
      // 2. Use context to help determine which agents to invoke
      const neededAgents = this.routeToAgents(userQuery, deepSeekContext);
      
      // 3. Initialize response sections
      const sections: HeadBrainResponse['sections'] = [];
      
      // 4. Process each needed agent
      if (neededAgents.includes('labCaseManager')) {
        const labResult = await this.processLabCases(userQuery);
        sections.push({
          type: 'lab-cases',
          title: 'Lab Case Analysis',
          content: labResult
        });
      }
      
      if (neededAgents.includes('dataAnalysis')) {
        const analysisResult = await this.processDataAnalysis(userQuery);
        
        if (analysisResult.analysis) {
          sections.push({
            type: 'kpi-analysis',
            title: 'KPI Analysis',
            content: analysisResult.analysis
          });
        }
        
        if (analysisResult.recommendations && analysisResult.recommendations.length > 0) {
          sections.push({
            type: 'recommendations',
            title: 'Recommendations',
            content: analysisResult.recommendations
          });
        }
      }
      
      // 5. Add Deep Seek context if available
      if (deepSeekContext.length > 0) {
        sections.push({
          type: 'deep-seek-context',
          title: 'Additional Context',
          content: deepSeekContext.join('\n\n')
        });
      }
      
      // 6. Generate a unified response
      const answer = this.generateUnifiedResponse(userQuery, sections);
      
      return {
        answer,
        sections,
        sources: deepSeekContext.length > 0 ? ['Knowledge Base'] : undefined
      };
      
    } catch (error) {
      console.error('Error in HeadBrainConsultant:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        answer: 'Sorry, I encountered an error while processing your request. Please try again or rephrase your question.',
        sections: [{
          type: 'text',
          title: 'Error',
          content: errorMessage
        }]
      };
    }
  }

  /**
   * Determines which agents should handle the query
   * @param query The user's query
   * @param context Optional retrieved context from knowledge base
   * @returns Array of agent IDs that should handle the query
   */
  private routeToAgents(query: string, context: string[] = []): string[] {
    const agentsNeeded: string[] = [];
    
    // Use context to enhance agent selection
    const combinedText = [query, ...context].join(' ').toLowerCase();
    
    // Lab case related queries
    if (
      combinedText.includes('lab') ||
      combinedText.includes('crown') ||
      combinedText.includes('bridge') ||
      combinedText.includes('denture') ||
      combinedText.includes('implant') ||
      combinedText.includes('case')
    ) {
      agentsNeeded.push('labCaseManager');
    }
    
    // KPI and data analysis related queries
    if (
      combinedText.includes('kpi') ||
      combinedText.includes('metric') ||
      combinedText.includes('analysis') ||
      combinedText.includes('production') ||
      combinedText.includes('hygiene') ||
      combinedText.includes('patient') ||
      combinedText.includes('appointment') ||
      combinedText.includes('performance') ||
      combinedText.includes('data') ||
      combinedText.includes('report') ||
      combinedText.includes('recommendation') ||
      combinedText.includes('improve')
    ) {
      agentsNeeded.push('dataAnalysis');
    }
    
    // If the context mentions recommendations, add the recommendation agent
    if (combinedText.includes('recommendation') || combinedText.includes('suggest') || combinedText.includes('advise')) {
      // Include the recommendation agent if not already included through data analysis
      if (!agentsNeeded.includes('dataAnalysis')) {
        agentsNeeded.push('dataAnalysis');
      }
    }
    
    // If no specific agents matched, default to data analysis
    // as a reasonable fallback that can provide general practice insights
    if (agentsNeeded.length === 0) {
      agentsNeeded.push('dataAnalysis');
    }
    
    console.log(`Selected agents: ${agentsNeeded.join(', ')} based on query and context`);
    return agentsNeeded;
  }
  
  // The shouldUseDeepSeek method has been removed because we now always
  // check the knowledge base first to get context before deciding on agents
  
  /**
   * Process lab case management with agent-specific knowledge
   */
  private async processLabCases(query: string) {
    console.log("Processing lab cases...");
    
    // Get lab-case-manager specific knowledge
    const labCaseKnowledge = await this.deepSeekClient.queryEmbeddings(
      query,
      2,
      { agentId: 'lab-case-manager' }
    );
    
    // Log the specialized knowledge found
    if (labCaseKnowledge.length > 0) {
      console.log(`Using ${labCaseKnowledge.length} lab-case-specific knowledge items`);
    }
    
    // Invoke the lab case manager agent
    return await this.labCaseManagerAgent.manageLabCases(query);
  }
  
  /**
   * Process data analysis and recommendations with agent-specific knowledge
   */
  private async processDataAnalysis(query: string) {
    console.log("Processing data analysis...");
    
    // Get data-analysis specific knowledge
    const analysisKnowledge = await this.deepSeekClient.queryEmbeddings(
      query,
      2,
      { agentId: 'data-analysis' }
    );
    
    // Log the specialized knowledge found
    if (analysisKnowledge.length > 0) {
      console.log(`Using ${analysisKnowledge.length} data-analysis-specific knowledge items`);
    }
    
    // 1. Retrieve data
    const rawData = await this.dataRetrievalAgent.fetchDataForAnalysis(query);
    
    // 2. Analyze KPIs
    const analysis = await this.dataAnalysisAgent.analyzeKPI(rawData);
    
    // 3. Generate recommendations if there are areas for improvement
    let recommendations = undefined;
    if (analysis.areasForImprovement.length > 0) {
      // Get recommendation-specific knowledge
      const recommendationKnowledge = await this.deepSeekClient.queryEmbeddings(
        query,
        2,
        { agentId: 'recommendation' }
      );
      
      // Log the specialized knowledge found
      if (recommendationKnowledge.length > 0) {
        console.log(`Using ${recommendationKnowledge.length} recommendation-specific knowledge items`);
      }
      
      // Generate recommendations
      recommendations = await this.recommendationAgent.generateRecommendations(analysis);
    }
    
    return {
      analysis,
      recommendations
    };
  }
  
  /**
   * Generate a unified response based on all agent outputs
   */
  private generateUnifiedResponse(query: string, sections: HeadBrainResponse['sections']): string {
    // Extract key information from sections
    const labSection = sections.find(s => s.type === 'lab-cases');
    const kpiSection = sections.find(s => s.type === 'kpi-analysis');
    const recommendationSection = sections.find(s => s.type === 'recommendations');
    const deepSeekSection = sections.find(s => s.type === 'deep-seek-context');
    
    let response = '';
    
    // Add greeting and overview
    response += `Here's what I found regarding your query about "${query}":\n\n`;
    
    // Add KPI Analysis if available
    if (kpiSection && kpiSection.type === 'kpi-analysis') {
      const analysis = kpiSection.content;
      response += `${analysis.summary}\n\n`;
    }
    
    // Add Lab Case info if available
    if (labSection && labSection.type === 'lab-cases') {
      const labData = labSection.content;
      response += `${labData.summary}\n\n`;
    }
    
    // Add Recommendations overview if available
    if (recommendationSection && recommendationSection.type === 'recommendations') {
      const recommendations = recommendationSection.content;
      response += `Based on the analysis, here are ${recommendations.length} key recommendations:\n`;
      
      recommendations.slice(0, 3).forEach((rec, index) => {
        response += `${index + 1}. ${rec.title}: ${rec.description}\n`;
      });
      
      if (recommendations.length > 3) {
        response += `...and ${recommendations.length - 3} more recommendations.\n`;
      }
      
      response += '\n';
    }
    
    // Add note about deep seek context if used
    if (deepSeekSection) {
      response += 'I\'ve also included additional context from our knowledge base that might be helpful.\n\n';
    }
    
    return response;
  }
}