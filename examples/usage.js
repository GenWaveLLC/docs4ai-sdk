// JavaScript Usage Example
const { Docs4AI } = require('../src/javascript');

async function javaScriptExample() {
  // Initialize the SDK
  const docs4ai = new Docs4AI({
    apiKey: 'YOUR_API_KEY'
  });

  try {
    // Get list of frameworks
    const frameworks = await docs4ai.getFrameworks();
    console.log('Available Frameworks:', frameworks);

    // Get chapters for React 18
    const chapters = await docs4ai.getChapters('react', '18');
    console.log('React Chapters:', chapters);

    // Get specific chapter content
    const content = await docs4ai.getDocContent('react', '18', 'hooks_usestate');
    console.log('useState Hook Documentation:', content);

    // Search documentation
    const searchResults = await docs4ai.search({
      framework: 'react',
      version: '18',
      query: 'useState hook usage'
    });
    console.log('Search Results:', searchResults);

    // AI Query
    const queryResult = await docs4ai.query({
      framework: 'react',
      version: '18',
      question: 'How do I use useState hook?'
    });
    console.log('AI Query Response:', queryResult.content);
    console.log('Sources:', queryResult.sources);

    // Chat completion
    const chatResponse = await docs4ai.chat({
      model: 'ai-docs-pro-1.0',
      messages: [
        {
          role: 'system',
          content: 'You are an expert React developer.'
        },
        {
          role: 'user',
          content: 'Explain useEffect with dependencies array.'
        }
      ],
      max_tokens: 300,
      temperature: 0.3
    });
    console.log('Chat Response:', chatResponse.choices[0].message.content);
  } catch (error) {
    if (error.name === 'Docs4AIError') {
      console.error('SDK Error:', error.message);
      console.error('Error Code:', error.code);
      console.error('Status:', error.status);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// ESM version usage:
/*
import { Docs4AI } from '../dist/javascript/index.mjs';
// Rest of the code remains the same
*/

javaScriptExample();
