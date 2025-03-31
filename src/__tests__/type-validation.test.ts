import { expectType } from 'tsd';
import { Docs4AI, Docs4AIError } from '../index.js';
import type {
  Docs4AIConfig,
  FrameworkInfo,
  ChapterInfo,
  DocContent,
  SearchParams,
  SearchResult,
  QueryRequest,
  QueryResponse,
  ChatRequest,
  ChatResponse
} from '../index';

// Create a proper Response object for mocking
const createMockResponse = <T>(data: T): Response => {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  return new Response(blob, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Properly typed mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

global.fetch = mockFetch;

describe('Type Definitions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should properly type the SDK constructor', () => {
    const config: Docs4AIConfig = {
      apiKey: 'test-key',
      baseUrl: 'https://test.com'
    };
    const sdk = new Docs4AI(config);
    expectType<Docs4AI>(sdk);
  });

  it('should properly type API responses', async () => {
    const sdk = new Docs4AI({ apiKey: 'test-key' });

    // Mock frameworks response
    const frameworksData: FrameworkInfo[] = [{ name: 'react', versions: ['17.0.0'] }];
    mockFetch.mockResolvedValueOnce(createMockResponse(frameworksData));
    const frameworks = await sdk.getFrameworks();
    expectType<FrameworkInfo[]>(frameworks);

    // Mock chapters response
    const chaptersData: ChapterInfo[] = [{ title: 'Introduction', chapterId: 'intro' }];
    mockFetch.mockResolvedValueOnce(createMockResponse(chaptersData));
    const chapters = await sdk.getChapters('react', '17.0.0');
    expectType<ChapterInfo[]>(chapters);

    // Mock content response
    const contentData: DocContent = { title: 'Introduction', content: 'Content here' };
    mockFetch.mockResolvedValueOnce(createMockResponse(contentData));
    const content = await sdk.getDocContent('react', '17.0.0', 'intro');
    expectType<DocContent>(content);

    // Mock search response
    const searchData: SearchResult[] = [{ title: 'Hooks', snippet: 'About hooks', chapterId: 'hooks' }];
    mockFetch.mockResolvedValueOnce(createMockResponse(searchData));
    const searchParams: SearchParams = {
      framework: 'react',
      version: '17.0.0',
      q: 'hooks'
    };
    const searchResults = await sdk.search(searchParams);
    expectType<SearchResult[]>(searchResults);

    // Mock query response
    const queryData: QueryResponse = { content: 'Answer about hooks', sources: [] };
    mockFetch.mockResolvedValueOnce(createMockResponse(queryData));
    const queryRequest: QueryRequest = {
      framework: 'react',
      version: '17.0.0',
      question: 'How do hooks work?'
    };
    const queryResponse = await sdk.query(queryRequest);
    expectType<QueryResponse>(queryResponse);

    // Mock chat response
    const chatData: ChatResponse = {
      id: '123',
      choices: [{
        message: { role: 'assistant', content: 'Help with hooks' },
        finish_reason: 'stop'
      }]
    };
    mockFetch.mockResolvedValueOnce(createMockResponse(chatData));
    const chatRequest: ChatRequest = {
      model: 'gpt-4',
      messages: [
        { role: 'user', content: 'Help with React hooks' }
      ]
    };
    const chatResponse = await sdk.chat(chatRequest);
    expectType<ChatResponse>(chatResponse);
  });

  it('should properly type error handling', () => {
    const error = new Docs4AIError('TEST_ERROR', 'Test message', 400);
    expectType<Docs4AIError>(error);
    expectType<string>(error.code);
    expectType<number | undefined>(error.status);
  });
});
