// Type definitions for Docs4AI SDK

export interface Docs4AIConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface SearchParams {
  framework: string;
  version: string;
  query: string;
}

export interface FrameworkInfo {
  name: string;
  versions: string[];
}

export interface ChapterInfo {
  title: string;
  chapterId: string;
}

export interface DocContent {
  title: string;
  content: string;
}

export interface SearchResult {
  title: string;
  snippet: string;
  chapterId: string;
}

export interface QueryRequest {
  framework: string;
  version: string;
  question: string;
}

export interface QueryResponse {
  content: string;
  sources: any[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

export interface ChatResponse {
  id: string;
  choices: {
    message: ChatMessage;
    finish_reason: string;
  }[];
}

export interface RequestOptions {
  method?: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
}

export declare class Docs4AIError extends Error {
  code: string;
  status?: number;
  data?: any;
  constructor(code: string, message: string, status?: number, data?: any);
}

export declare class Docs4AI {
  constructor(config: Docs4AIConfig);
  
  getFrameworks(): Promise<FrameworkInfo[]>;
  getChapters(framework: string, version: string): Promise<ChapterInfo[]>;
  getDocContent(framework: string, version: string, chapterId: string): Promise<DocContent>;
  search(params: SearchParams): Promise<SearchResult[]>;
  query(params: QueryRequest): Promise<QueryResponse>;
  chat(request: ChatRequest): Promise<ChatResponse>;

  private request(endpoint: string, options?: RequestOptions): Promise<any>;
}
