// Error class
export class Docs4AIError extends Error {
  constructor(code, message, status, data) {
    super(message);
    this.name = 'Docs4AIError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

// Main SDK Class
export class Docs4AI {
  constructor(config) {
    // Runtime validation
    if (!config || typeof config.apiKey !== 'string') {
      throw new Docs4AIError('CONFIG_ERROR', 'API key is required');
    }
    
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'http://localhost:3000';
  }

  /**
   * Get list of supported frameworks and their versions
   */
  async getFrameworks() {
    return this.request('/docs/frameworks');
  }

  /**
   * Get chapters for a specific framework version
   */
  async getChapters(framework, version) {
    return this.request(`/docs/${framework}/${version}/chapters`);
  }

  /**
   * Get documentation content for a specific chapter
   */
  async getDocContent(framework, version, chapterId) {
    return this.request(`/docs/${framework}/${version}/${chapterId}`);
  }

  /**
   * Search documentation
   */
  async search(params) {
    return this.request('/docs/search', { params });
  }

  /**
   * Query documentation using AI
   */
  async query(params) {
    return this.request('/ai-docs/query', {
      method: 'POST',
      body: params
    });
  }

  /**
   * Chat completions
   */
  async chat(request) {
    return this.request('/chat/completions', {
      method: 'POST',
      body: request
    });
  }

  /**
   * Make HTTP request to the API
   */
  async request(endpoint, options = {}) {
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
