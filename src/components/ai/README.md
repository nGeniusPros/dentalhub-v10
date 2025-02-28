# DentalHub AI Feedback System

The DentalHub AI Feedback System is a comprehensive solution for collecting, analyzing, and leveraging user feedback to improve AI agent performance through a reinforcement learning approach.

## Components

### 1. AI Response Feedback Component (`AIResponseFeedback.tsx`)

A versatile React component that collects user feedback on AI-generated responses:

- 👍/👎 reaction buttons
- Optional comments field
- Configurable for different agent types
- Tracks user role and feedback context

```jsx
<AIResponseFeedback 
  responseId="123e4567-e89b-12d3-a456-426614174000"
  agentType="consultant"
  userRole="dentist"
  feedbackContext="treatment-planning"
  onFeedbackSubmit={(feedback) => console.log(feedback)}
/>
```

### 2. AI Feedback Hook (`useAIFeedback.ts`)

A custom React hook for managing feedback submission:

- Handles Supabase database interaction
- Manages loading/error states
- Tracks analytics events
- Ensures data validation

```jsx
const { submitFeedback, loading, error } = useAIFeedback();

// Submit feedback
submitFeedback({
  responseId: "unique-id",
  wasHelpful: true,
  comment: "This was very helpful for explaining the treatment to my patient",
  agentType: "assistant",
  userRole: "dentist"
});
```

### 3. AI Feedback Dashboard (`AIFeedbackDashboard.tsx`)

An administrative interface for reviewing and managing feedback:

- Semantic search capabilities
- Advanced filtering options
- Feedback validation workflow
- Training data selection

### 4. AI Feedback Analytics (`AIFeedbackAnalytics.tsx`)

A visual analytics dashboard to track AI performance:

- Agent performance metrics
- Feedback trends over time
- User role distribution analysis
- Helpfulness scoring

## Database Structure

The feedback system uses Supabase with the following tables:

### `ai_response_feedback`

| Column           | Type      | Description                              |
|------------------|-----------|------------------------------------------|
| id               | UUID      | Primary key                              |
| response_id      | UUID      | ID of the AI response                    |
| was_helpful      | boolean   | Whether the response was helpful         |
| comment          | text      | Optional user comment                    |
| agent_type       | string    | Type of AI agent (consultant, assistant) |
| user_role        | string    | Role of the user providing feedback      |
| feedback_type    | string    | Category of feedback                     |
| feedback_context | string    | Context in which feedback was given      |
| is_validated     | boolean   | Whether feedback has been validated      |
| embedding        | vector    | Vector embedding for semantic search     |
| created_at       | timestamp | Creation timestamp                       |
| updated_at       | timestamp | Last update timestamp                    |

### `ai_training_datasets`

| Column           | Type      | Description                        |
|------------------|-----------|------------------------------------|
| id               | UUID      | Primary key                        |
| name             | string    | Dataset name                       |
| description      | text      | Dataset description                |
| created_by       | UUID      | User who created the dataset       |
| metadata         | jsonb     | Additional dataset metadata        |
| created_at       | timestamp | Creation timestamp                 |
| updated_at       | timestamp | Last update timestamp              |

## Usage Guidelines

### Security Considerations

- Row-level security is implemented in Supabase
- Input sanitization is performed on all user inputs
- Role-based access control for administrative features

### Implementation Best Practices

1. **Tracking Response IDs**: Each AI response should have a unique ID for tracking feedback
2. **Consistent Agent Types**: Use the same agent type identifiers throughout the application
3. **Comprehensive Feedback Context**: Include relevant context with each feedback submission
4. **Regular Validation**: Regularly review and validate feedback for training data quality

## Reinforcement Learning Workflow

1. **Collection**: Gather user feedback on AI responses
2. **Validation**: Review and validate feedback for quality
3. **Analysis**: Identify patterns and areas for improvement
4. **Dataset Creation**: Create curated training datasets
5. **Training**: Fine-tune AI models with validated feedback
6. **Deployment**: Deploy improved models
7. **Monitoring**: Continue monitoring performance and collecting feedback

## Future Improvements

- Enhanced analytics visualizations
- More granular feedback categorization
- Automated feedback classification
- A/B testing of model improvements
- Confidence scoring and thresholds
