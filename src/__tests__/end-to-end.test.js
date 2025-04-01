// Load environment variables from the .env file
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Load the API keys from the JSON file dynamically
const apiKeysPath = process.env.API_KEYS_PATH;
const resolvedPath = path.resolve(apiKeysPath);
const apiKeys = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));

const { Docs4AI } = require('../index.js');

describe('End-to-End Tests', () => {
  // Increase timeout for real API calls
  jest.setTimeout(10000);

  // For debugging API key issues
  console.log('Using API Key:', apiKeys.basic);
  
  const sdk = new Docs4AI({ 
    apiKey: apiKeys.basic,
    baseUrl: 'http://localhost:3000' 
  });

  // Log the API key header that will be used
  console.log('x-api-key header:', apiKeys.basic);

  it('should get list of frameworks', async () => {
    try {
      console.log('Making request to:', `${sdk.baseUrl}/docs/frameworks`);
      const frameworks = await sdk.getFrameworks();
      console.log('hello-Frameworks:', frameworks);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        url: `${sdk.baseUrl}/docs/frameworks`
      });
      throw error;
    }
  });

  it('should get chapters for a framework version', async () => {
    try {
      console.log('Making request to:', `${sdk.baseUrl}/docs/react/18/chapters`);
      const chapters = await sdk.getChapters('react', '18');
      console.log('Chapters:', chapters);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        url: `${sdk.baseUrl}/docs/react/18/chapters`
      });
      throw error;
    }
  });

  it('should get documentation content', async () => {
    try {
      console.log('Making request to:', `${sdk.baseUrl}/docs/react/18/hooks_intro`);
      const content = await sdk.getDocContent('react', '18', 'hooks_intro');
      console.log('Content:', content);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        url: `${sdk.baseUrl}/docs/react/18/hooks_intro`
      });
      throw error;
    }
  });

  it('should search documentation', async () => {
    const searchUrl = `${sdk.baseUrl}/docs/search?framework=react&version=18&q=hooks`;
    try {
      console.log('Making request to:', searchUrl);
      const results = await sdk.search({
        framework: 'react',
        version: '18',
        q: 'hooks'
      });
      console.log('Search Results:', results);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        status: error.status,
        url: searchUrl
      });
      throw error;
    }
  });

  describe('AI-Docs Tests', () => {
    const aiDocsSDK = new Docs4AI({ 
      apiKey: apiKeys['ai-docs'],
      baseUrl: 'http://localhost:3000'
    });

    // Log the API key being used
    console.log('Using AI-Docs API Key:', apiKeys['ai-docs']);

    it('should perform AI query about React hooks', async () => {
      try {
        console.log('Making request to:', `${aiDocsSDK.baseUrl}/ai-docs/query`);
        const response = await aiDocsSDK.query({
          framework: 'react',
          version: '18',
          question: 'How do React hooks work?'
        });
        console.log('AI Query Response:', response);
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          status: error.status,
          url: `${aiDocsSDK.baseUrl}/ai-docs/query`
        });
        throw error;
      }
    });
  });

  describe('AI-Docs Pro Tests', () => {
    const aiDocsProSDK = new Docs4AI({ 
      apiKey: apiKeys['ai-docs-pro'],
      baseUrl: 'http://localhost:3000'
    });

    // Log the API key being used
    console.log('Using AI-Docs Pro API Key:', apiKeys['ai-docs-pro']);

    it('should use chat completion', async () => {
      try {
        console.log('Making request to:', `${aiDocsProSDK.baseUrl}/chat/completions`);
        const response = await aiDocsProSDK.chat({
          model: 'gpt-4',
          messages: [
            { role: 'user', content: 'Explain React hooks briefly' }
          ]
        });
        console.log('Chat Response:', response);
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          status: error.status,
          url: `${aiDocsProSDK.baseUrl}/chat/completions`
        });
        throw error;
      }
    });
  });
});