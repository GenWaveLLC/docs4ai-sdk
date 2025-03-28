// Types
interface Docs4AIConfig {
  apiKey: string;
  baseUrl?: string;
}

interface SearchParams {
  framework: string;
  version: string;
  query: string;
}

interface FrameworkInfo {
  name: string;
  versions: string[];
}

interface ChapterInfo {
  title: string;
  chapterId: string;
}

interface DocContent {
  title: string;
  content: string;
}

interface SearchResult {
  title: string;
  snippet: string;
  chapterId: string;
}

interface QueryRequest {
  framework: string;
  version: string;
  question: string;
}

interface QueryResponse {
  content: string;
  sources: any[];
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  n?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

interface ChatResponse {
  id: string;
  choices: {
    message: ChatMessage;
    finish_reason: string;
  }[];
}

interface RequestOptions {
  method?: string;
  params?: Record<string, any>;
  body?: Record<string, any>;
}

// Error class
export class Docs4AIError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'Docs4AIError';
  }
}

// Main SDK Class
export class Docs4AI {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Docs4AIConfig) {
    if (!config.apiKey) {
      throw new Docs4AIError('CONFIG_ERROR', 'API key is required');
    }
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
  }

  /**
   * Get list of supported frameworks and their versions
   */
  async getFrameworks(): Promise<FrameworkInfo[]> {
    return this.request('/docs/frameworks');
  }

  /**
   * Get chapters for a specific framework version
   */
  async getChapters(framework: string, version: string): Promise<ChapterInfo[]> {
    return this.request(`/docs/${framework}/${version}/chapters`);
  }

  /**
   * Get documentation content for a specific chapter
   */
  async getDocContent(framework: string, version: string, chapterId: string): Promise<DocContent> {
    return this.request(`/docs/${framework}/${version}/${chapterId}`);
  }

  /**
   * Search documentation
   */
  async search(params: SearchParams): Promise<SearchResult[]> {
    return this.request('/docs/search', { params });
  }

  /**
   * Query documentation using AI
   */
  async query(params: QueryRequest): Promise<QueryResponse> {
    return this.request('/ai-docs/query', {
      method: 'POST',
      body: params
    });
  }

  /**
   * Chat completions
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.request('/chat/completions', {
      method: 'POST',
      body: request
    });
  }

  /**
   * Make HTTP request to the API
   */
  private async request(endpoint: string, options: RequestOptions = {}): Promise<any> {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      // Add query parameters if any
      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const response = await fetch(url.toString(), {
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bearer your-jwt-token`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Docs4AIError(
          'API_ERROR',
          error.message || 'API request failed',
          response.status,
          error
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof Docs4AIError) throw error;
      throw new Docs4AIError(
        'NETWORK_ERROR',
        error instanceof Error ? error.message : 'Network request failed'
      );
    }
  }
}
