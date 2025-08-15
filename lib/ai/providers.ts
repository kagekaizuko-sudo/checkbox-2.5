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

// Type-safe language models object
const productionModels: Record<string, LanguageModelV1> = {
  // DeepSeek models
  'chat-model': deepseek('deepseek-coder'),
  'chat-model-reasoning': createOptimizedModel(
    deepseek('deepseek-reasoner'), 
    { reasoning: true, reasoningTag: 'think' }
  ),
  'vision-model': deepseek('deepseek-vl'),
  'web-search-model': createOptimizedModel(
    deepseek('deepseek-coder'),
    { reasoning: true, reasoningTag: 'search' }
  ), // New model for web search

  // Groq models
  'chat-model1': groq('openai/gpt-oss-120b'),
  'chat-model2': groq('meta-llama/llama-4-scout-17b-16e-instruct'),
  'chat-model3': createOptimizedModel(
    groq('qwen/qwen3-32b'), 
    { reasoning: true, reasoningTag: 'think' }
  ),
  'title-model': groq('meta-llama/llama-3.2-3b-instruct'),
  'artifact-model': deepseek('deepseek-coder'),
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