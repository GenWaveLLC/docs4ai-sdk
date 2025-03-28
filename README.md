# Docs4AI SDK

A unified SDK for accessing framework documentation, with support for both TypeScript and JavaScript.

## Installation

```bash
npm install @docs4ai/sdk
```

## Features

- Framework documentation retrieval
- Chapter listing
- Content search
- TypeScript support with full type definitions
- JavaScript support with runtime validation
- Zero dependencies
- Works in both Node.js and browser environments

## Usage

### TypeScript

```typescript
import { Docs4AI } from '@docs4ai/sdk';

const docs4ai = new Docs4AI({
  apiKey: 'YOUR_API_KEY'
});

// Get list of frameworks
const frameworks = await docs4ai.getFrameworks();

// Get chapters for a framework
const chapters = await docs4ai.getChapters('react', '18');

// Get specific documentation
const content = await docs4ai.getDocContent('react', '18', 'hooks_usestate');

// Search documentation
const results = await docs4ai.search({
  framework: 'react',
  version: '18',
  query: 'useState hook usage'
});
```

### JavaScript

```javascript
const { Docs4AI } = require('@docs4ai/sdk');
// Or using ES modules:
// import { Docs4AI } from '@docs4ai/sdk';

const docs4ai = new Docs4AI({
  apiKey: 'YOUR_API_KEY'
});

// Rest of the usage is identical to TypeScript
```

## API Reference

### Configuration

```typescript
interface Docs4AIConfig {
  apiKey: string;    // Your API key (required)
  baseUrl?: string;  // Optional custom base URL
}
```

### Methods

#### `getFrameworks()`
Returns a list of supported frameworks and their versions.

#### `getChapters(framework: string, version: string)`
Returns a list of chapters for the specified framework version.

#### `getDocContent(framework: string, version: string, chapterId: string)`
Returns documentation content for a specific chapter.

#### `search(params: SearchParams)`
Searches documentation across framework versions.

```typescript
interface SearchParams {
  framework: string;  // Framework name
  version: string;   // Framework version
  query: string;     // Search query
}
```

## Error Handling

The SDK throws `Docs4AIError` for any errors that occur:

```typescript
try {
  await docs4ai.getFrameworks();
} catch (error) {
  if (error.name === 'Docs4AIError') {
    console.error('SDK Error:', error.message);
    console.error('Error Code:', error.code);
    console.error('Status:', error.status);
  }
}
```

## Next.js Integration

```typescript
// app/api/docs.ts
import { Docs4AI } from '@docs4ai/sdk';

export const docsClient = new Docs4AI({
  apiKey: process.env.DOCS4AI_API_KEY
});
```

## Development

```bash
# Install dependencies
npm install

# Build the SDK
npm run build

# Run tests
npm test

# Format code
npm run format

# Lint code
npm run lint
```

## License

MIT

## Support

For questions or issues, please open an issue on GitHub.
