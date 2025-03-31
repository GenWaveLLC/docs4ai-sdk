const { Docs4AI, Docs4AIError } = require('../index.js');

describe('Docs4AI SDK', () => {
  let sdk;

  beforeEach(() => {
    sdk = new Docs4AI({ apiKey: 'test-key' });
  });

  describe('constructor', () => {
    it('should throw if apiKey is not provided', () => {
      expect(() => new Docs4AI({})).toThrow('API key is required');
      expect(() => new Docs4AI()).toThrow('API key is required');
    });

    it('should use default baseUrl if not provided', () => {
      expect(sdk.baseUrl).toBe('http://localhost:3000');
    });

    it('should use custom baseUrl if provided', () => {
      const customSdk = new Docs4AI({ apiKey: 'test-key', baseUrl: 'https://custom.url' });
      expect(customSdk.baseUrl).toBe('https://custom.url');
    });
  });

  describe('API methods', () => {
    global.fetch = jest.fn();

    beforeEach(() => {
      fetch.mockClear();
    });

    it('should get frameworks', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve([{ name: 'react', versions: ['17.0.0'] }]) };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const result = await sdk.getFrameworks();
      expect(result).toEqual([{ name: 'react', versions: ['17.0.0'] }]);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/docs/frameworks',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should get chapters', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve([{ title: 'Introduction', chapterId: 'intro' }]) };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const result = await sdk.getChapters('react', '17.0.0');
      expect(result).toEqual([{ title: 'Introduction', chapterId: 'intro' }]);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/docs/react/17.0.0/chapters',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should get doc content', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ title: 'Intro', content: 'Content' }) };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const result = await sdk.getDocContent('react', '17.0.0', 'intro');
      expect(result).toEqual({ title: 'Intro', content: 'Content' });
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/docs/react/17.0.0/intro',
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should search docs', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve([{ title: 'Result', snippet: 'Text' }]) };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const params = { framework: 'react', version: '17.0.0', q: 'hooks' };
      const result = await sdk.search(params);
      expect(result).toEqual([{ title: 'Result', snippet: 'Text' }]);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/docs/search?framework=react&version=17.0.0&q=hooks'),
        expect.objectContaining({
          method: 'GET'
        })
      );
    });

    it('should handle API errors', async () => {
      const mockResponse = { 
        ok: false, 
        status: 400,
        json: () => Promise.resolve({ message: 'Bad Request' }) 
      };
      global.fetch.mockResolvedValueOnce(mockResponse);

      await expect(sdk.getFrameworks()).rejects.toThrow(Docs4AIError);
      global.fetch.mockResolvedValueOnce(mockResponse);
      await expect(sdk.getFrameworks()).rejects.toMatchObject({
        code: 'API_ERROR',
        status: 400
      });
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network failed'));

      await expect(sdk.getFrameworks()).rejects.toThrow(Docs4AIError);
      await expect(sdk.getFrameworks()).rejects.toMatchObject({
        code: 'NETWORK_ERROR'
      });
    });
  });
});
