/**
 * @typedef {import('./index').Docs4AIConfig} Docs4AIConfig
 * @typedef {import('./index').SearchParams} SearchParams
 * @typedef {import('./index').QueryRequest} QueryRequest
 * @typedef {import('./index').ChatRequest} ChatRequest
 * @typedef {import('./index').RequestOptions} RequestOptions
 * @typedef {import('./index').FrameworkInfo} FrameworkInfo
 * @typedef {import('./index').ChapterInfo} ChapterInfo
 * @typedef {import('./index').DocContent} DocContent
 * @typedef {import('./index').SearchResult} SearchResult
 * @typedef {import('./index').QueryResponse} QueryResponse
 * @typedef {import('./index').ChatResponse} ChatResponse
 */

// Error class
export class Docs4AIError extends Error {
  /**
   * @param {string} code 
   * @param {string} message 
   * @param {number} [status=500]
   * @param {any} [data=null]
   */
  constructor(code, message, status = 500, data = null) {
    super(message);
    this.name = 'Docs4AIError';
    this.code = code;
    this.status = status;
    this.data = data;
  }
}

// Main SDK Class
export class Docs4AI {
  /**
   * @param {Docs4AIConfig} config
   */
  constructor(config) {
    this.baseUrl = config?.baseUrl || 'http://localhost:3000';
  }

  /**
   * Get list of supported frameworks and their versions
   * @returns {Promise<FrameworkInfo[]>}
   */
  async getFrameworks() {
    return this.request('/docs/frameworks');
  }

  /**
   * Get chapters for a specific framework version
   * @param {string} framework
   * @param {string} version
   * @returns {Promise<ChapterInfo[]>}
   */
  async getChapters(framework, version) {
    if (!framework || !version) {
      throw new Docs4AIError('VALIDATION_ERROR', 'Framework and version are required');
    }
    return this.request(`/docs/${framework}/${version}/chapters`);
  }

  /**
   * Get documentation content for a specific chapter
   * @param {string} framework
   * @param {string} version
   * @param {string} chapterId
   * @returns {Promise<DocContent>}
   */
  async getDocContent(framework, version, chapterId) {
    if (!framework || !version || !chapterId) {
      throw new Docs4AIError('VALIDATION_ERROR', 'Framework, version and chapterId are required');
    }
    return this.request(`/docs/${framework}/${version}/${chapterId}`);
  }

  /**
   * Search documentation
   * @param {SearchParams} params
   * @returns {Promise<SearchResult[]>}
   */
  async search(params) {
    if (!params || typeof params !== 'object') {
      throw new Docs4AIError('VALIDATION_ERROR', 'Search parameters must be an object');
    }
    if (!params.q || !params.framework || !params.version) {
      throw new Docs4AIError('VALIDATION_ERROR', 'Search requires query, framework and version parameters');
    }
    return this.request('/docs/search', { params });
  }

  /**
   * Query documentation using AI
   * @param {QueryRequest} params
   * @returns {Promise<QueryResponse>}
   */
  async query(params) {
    if (!params || typeof params !== 'object') {
      throw new Docs4AIError('VALIDATION_ERROR', 'Query parameters must be an object');
    }
    if (!params.question || !params.framework || !params.version) {
      throw new Docs4AIError('VALIDATION_ERROR', 'Query requires question, framework and version parameters');
    }
    return this.request('/ai-docs/query', {
      method: 'POST',
      body: params
    });
  }

  /**
   * Chat completions
   * @param {ChatRequest} request
   * @returns {Promise<ChatResponse>}
   */
  async chat(request) {
    if (!request || typeof request !== 'object') {
      throw new Docs4AIError('VALIDATION_ERROR', 'Chat request must be an object');
    }
    if (!request.messages || !Array.isArray(request.messages) || request.messages.length === 0) {
      throw new Docs4AIError('VALIDATION_ERROR', 'Chat request must include non-empty messages array');
    }
    if (!request.model) {
      throw new Docs4AIError('VALIDATION_ERROR', 'Chat request must include model parameter');
    }
    return this.request('/chat/completions', {
      method: 'POST',
      body: request
    });
  }

  /**
   * Make HTTP request to the API
   * @param {string} endpoint
   * @param {RequestOptions} [options={}]
   * @returns {Promise<any>}
   * @private
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
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        /** @type {{ message?: string }} */
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // If JSON parsing fails, use a generic error
          errorData = { message: 'Invalid response from server' };
        }
        
        throw new Docs4AIError(
          'API_ERROR',
          errorData.message || 'API request failed',
          response.status,
          errorData
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
