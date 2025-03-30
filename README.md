# Docs4AI SDK

Documentation SDK for framework documentation access. Provides a unified JavaScript implementation with full TypeScript type definitions.

## Installation

```bash
npm install @docs4ai/sdk
```

## Usage

### JavaScript

```javascript
const { Docs4AI } = require('@docs4ai/sdk');

const sdk = new Docs4AI({ 
  apiKey: 'your-api-key',
  baseUrl: 'optional-custom-url' 
});

// Get supported frameworks
const frameworks = await sdk.getFrameworks();

// Search documentation
const results = await sdk.search({
  framework: 'react',
  version: '17.0.0',
  query: 'hooks'
});
```

### TypeScript

```typescript
import { Docs4AI } from '@docs4ai/sdk';
import type { SearchParams, SearchResult } from '@docs4ai/sdk';

const sdk = new Docs4AI({ 
  apiKey: 'your-api-key',
  baseUrl: 'optional-custom-url' 
});

// Get supported frameworks
const frameworks = await sdk.getFrameworks();

// Search documentation with type safety
const params: SearchParams = {
  framework: 'react',
  version: '17.0.0',
  query: 'hooks'
};
const results: SearchResult[] = await sdk.search(params);
```

## Project Structure

```
src/
├── index.js           # Core implementation
├── index.d.ts         # TypeScript type definitions
└── __tests__/
    ├── index.test.js  # Functional tests
    └── type-validation.test.ts  # Type system tests
```

## API Reference

### Constructor

```typescript
new Docs4AI(config: Docs4AIConfig)
```

#### Config Options

- `apiKey` (required): Your API key for authentication
- `baseUrl` (optional): Custom base URL for API requests

### Methods

- `getFrameworks()`: Get list of supported frameworks and versions
- `getChapters(framework: string, version: string)`: Get chapters for a specific framework version
- `getDocContent(framework: string, version: string, chapterId: string)`: Get documentation content
- `search(params: SearchParams)`: Search documentation
- `query(params: QueryRequest)`: Query documentation using AI
- `chat(request: ChatRequest)`: Chat completions

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test          # Run all tests
npm run test:unit # Run unit tests only
npm run test:types # Run type validation tests

# Build
npm run build
```

## License

MIT
