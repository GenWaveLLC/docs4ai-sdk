const { Docs4AI, Docs4AIError } = require('../index');

describe('Docs4AI SDK - JavaScript', () => {
  let mockFetch;
  
  beforeEach(() => {
    console.log('\n🔧 Setting up test environment...');
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    console.log('🧹 Cleaning up test environment...');
    jest.resetAllMocks();
  });

  describe('Constructor', () => {
    test('should initialize with valid config', () => {
      console.log('🔑 Testing SDK initialization with valid API key...');
      const sdk = new Docs4AI({ apiKey: 'test-key' });
      expect(sdk).toBeInstanceOf(Docs4AI);
      console.log('✅ SDK initialized successfully');
    });

    test('should throw error without API key', () => {
      console.log('❌ Testing SDK initialization without API key...');
      expect(() => new Docs4AI({})).toThrow(Docs4AIError);
      console.log('✅ Error thrown as expected');
    });

    test('should throw error if apiKey is not a string', () => {
      console.log('❌ Testing SDK initialization with invalid API key type...');
      expect(() => new Docs4AI({ apiKey: 123 })).toThrow(Docs4AIError);
      console.log('✅ Error thrown as expected');
    });
  });

  describe('API Methods', () => {
    let sdk;
    const mockResponse = { ok: true, json: jest.fn() };

    beforeEach(() => {
      sdk = new Docs4AI({ apiKey: 'test-key' });
      mockFetch.mockResolvedValue(mockResponse);
    });

    describe('getFrameworks', () => {
      test('should fetch frameworks list', async () => {
        const mockData = [{ name: 'react', versions: ['18.0.0'] }];
        mockResponse.json.mockResolvedValue(mockData);

        console.log('📚 Testing getFrameworks API call...');
        const result = await sdk.getFrameworks();

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/docs/frameworks',
          expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
              'Authorization': 'Bearer your-jwt-token',
              'Content-Type': 'application/json'
            })
          })
        );
        expect(result).toEqual(mockData);
        console.log('✅ Framework data retrieved successfully');
      });
    });

    describe('getChapters', () => {
      test('should fetch chapters for framework version', async () => {
        const mockData = [{ title: 'Introduction', chapterId: 'intro' }];
        mockResponse.json.mockResolvedValue(mockData);

        console.log('📖 Testing getChapters API call...');
        const result = await sdk.getChapters('react', '18.0.0');

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/docs/react/18.0.0/chapters',
          expect.any(Object)
        );
        expect(result).toEqual(mockData);
        console.log('✅ Chapter data retrieved successfully');
      });
    });

    describe('search', () => {
      test('should search documentation with params', async () => {
        const mockData = [{ title: 'Result', snippet: 'content', chapterId: 'ch1' }];
        mockResponse.json.mockResolvedValue(mockData);

        const searchParams = {
          framework: 'react',
          version: '18.0.0',
          query: 'hooks'
        };

        console.log('🔍 Testing search API call...');
        const result = await sdk.search(searchParams);

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/docs/search?'),
          expect.any(Object)
        );
        expect(result).toEqual(mockData);
        console.log('✅ Search completed successfully');
      });
    });

    describe('query', () => {
      test('should send AI query request', async () => {
        const mockData = { content: 'Answer', sources: [] };
        mockResponse.json.mockResolvedValue(mockData);

        const queryParams = {
          framework: 'react',
          version: '18.0.0',
          question: 'What are hooks?'
        };

        console.log('🤖 Testing AI query API call...');
        const result = await sdk.query(queryParams);

        expect(mockFetch).toHaveBeenCalledWith(
          'http://localhost:3000/ai-docs/query',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(queryParams)
          })
        );
        expect(result).toEqual(mockData);
        console.log('✅ AI query completed successfully');
      });
    });
  });

  describe('Error Handling', () => {
    let sdk;

    beforeEach(() => {
      sdk = new Docs4AI({ apiKey: 'test-key' });
    });

    test('should handle API errors', async () => {
      const errorResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({
          message: 'Invalid request'
        })
      };
      mockFetch.mockResolvedValue(errorResponse);

      console.log('⚠️ Testing API error handling...');
      await expect(sdk.getFrameworks()).rejects.toThrow(Docs4AIError);
      console.log('✅ API error handled correctly');
    });

    test('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      console.log('🌐 Testing network error handling...');
      await expect(sdk.getFrameworks()).rejects.toThrow(Docs4AIError);
      console.log('✅ Network error handled correctly');
    });

    test('should include error details in thrown error', async () => {
      const errorData = {
        message: 'Invalid request',
        code: 'VALIDATION_ERROR'
      };
      const errorResponse = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(errorData)
      };
      mockFetch.mockResolvedValue(errorResponse);

      console.log('📝 Testing error details in thrown error...');
      try {
        await sdk.getFrameworks();
      } catch (error) {
        expect(error).toBeInstanceOf(Docs4AIError);
        expect(error.status).toBe(400);
        expect(error.data).toEqual(errorData);
        console.log('✅ Error details verified successfully');
      }
    });
  });
});
