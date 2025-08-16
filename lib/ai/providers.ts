import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  type LanguageModelV1,
} from 'ai';
import { groq } from '@ai-sdk/groq';
import { deepseek } from '@ai-sdk/deepseek';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

// Type-safe model configuration
interface ModelConfig {
  reasoning?: boolean;
  reasoningTag?: string;
}

// Type-safe model creation
function createOptimizedModel(baseModel: LanguageModelV1, config: ModelConfig = {}): LanguageModelV1 {
  if (config.reasoning) {
    return wrapLanguageModel({
      model: baseModel,
      middleware: extractReasoningMiddleware({ 
        tagName: config.reasoningTag || 'think' 
      }),
    });
  }
  return baseModel;
}

// Type-safe language models object with maximum performance configurations
const productionModels: Record<string, LanguageModelV1> = {
  // DeepSeek models - optimized for maximum context and performance
  'chat-model': deepseek('deepseek-coder', {
    // Using correct property names for DeepSeek
    temperature: 0.7,
    topP: 0.95,
    maxTokens: 32768, // Maximum context window
  }),
  'chat-model-reasoning': createOptimizedModel(
    deepseek('deepseek-reasoner', {
      temperature: 0.7,
      topP: 0.95,
      maxTokens: 32768, // Maximum for detailed reasoning
      presencePenalty: 0.1, // Encourage diverse reasoning
      frequencyPenalty: 0.1, // Reduce repetition in reasoning
    }), 
    { 
      reasoning: true, 
      reasoningTag: 'think',
      persistReasoning: true, // Keep reasoning active throughout response
      reasoningDepth: 'deep' // Enable deeper reasoning analysis
    }
  ),
  'vision-model': deepseek('deepseek-vl', {
    temperature: 0.7,
    topP: 0.95,
    maxTokens: 16384, // Large context for vision tasks
  }),
  'web-search-model': createOptimizedModel(
    deepseek('deepseek-coder', {
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 24576, // Large context for search results
    }),
    { reasoning: true, reasoningTag: 'search' }
  ),

  // Groq models - maximum performance settings
  'chat-model1': groq('llama-3.1-70b-versatile', {
    // Using correct property names for Groq
    temperature: 0.7,
    topP: 0.9,
    maxCompletionTokens: 32768, // Groq uses maxCompletionTokens
  }),
  'chat-model2': groq('llama-3.1-405b-reasoning', {
    temperature: 0.8,
    topP: 0.95,
    maxCompletionTokens: 32768, // Maximum for 405B model
  }),
  'chat-model3': createOptimizedModel(
    groq('llama-3.1-70b-versatile', {
      temperature: 0.7,
      topP: 0.9,
      maxCompletionTokens: 32768, // Large context for reasoning
    }), 
    { reasoning: true, reasoningTag: 'think' }
  ),
  'title-model': groq('llama-3.1-8b-instant', {
    temperature: 0.3,
    maxCompletionTokens: 512, // Sufficient for titles
  }),
  'artifact-model': deepseek('deepseek-coder', {
    temperature: 0.5,
    maxTokens: 16384, // Large context for code generation
  }),
};

const testModels: Record<string, LanguageModelV1> = {
  'chat-model': chatModel,
  'chat-model-reasoning': reasoningModel,
  'title-model': titleModel,
  'artifact-model': artifactModel,
  'chat-model1': chatModel,
  'chat-model2': chatModel,
  'chat-model3': reasoningModel,
  'web-search-model': chatModel, // Use chatModel for testing
};

export const myProvider = customProvider({
  languageModels: isTestEnvironment ? testModels : productionModels,
});
