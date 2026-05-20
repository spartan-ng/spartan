# Spartan UI MCP Server

A comprehensive MCP (Model Context Protocol) server that exposes the entire Spartan Angular UI ecosystem as consumable tools. This server transforms Spartan UI documentation and component information into intelligent development tools for IDEs, AI assistants, and other MCP clients.

## 🎯 Purpose

The server provides comprehensive access to:

- **46+ UI Components** with detailed API specifications (Brain & Helm APIs)
- **Complete Documentation** (installation, theming, accessibility, etc.)
- **Code Generation** capabilities for Angular components
- **Intelligent Search** across components and docs
- **Accessibility Analysis** and WCAG compliance checking
- **Component Relationships** and dependency analysis
- **Health Checks** and CLI utilities

## 🚀 Features

### 🔧 **Code Generation**

- Generate complete Angular component boilerplate
- Create working examples from API specifications
- Validate component prop usage against official APIs

### 🔍 **Intelligent Search & Discovery**

- Full-text search across all components and documentation
- Feature-based component discovery ("multi-selection", "form input", etc.)
- Find related, similar, or alternative components

### 📊 **Component Analysis**

- Analyze component dependencies (npm, Angular CDK, peer components)
- Compare Brain API vs Helm API variants
- Discover component relationships and use cases

### ♿ **Accessibility Tools**

- Comprehensive accessibility feature analysis
- ARIA support detection
- Keyboard navigation and screen reader compatibility
- WCAG compliance checking

### 🎨 **Enhanced API Extraction**

- Structured Brain API and Helm API parsing
- TypeScript interface extraction
- Code examples with context
- Usage patterns and import statements

## 🛠 Usage

### Quick Start (No Installation Required!)

Configure your MCP client (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "spartan-ui-mcp": {
      "command": "npx",
      "args": ["spartan-ui-mcp"]
    }
  }
}
```

**That's it!** The server will automatically download and run when needed.

### Alternative Installation Methods

**Global Installation:**

```bash
npm install -g spartan-ui-mcp
```

```json
{
  "mcpServers": {
    "spartan-ui-mcp": {
      "command": "spartan-ui-mcp"
    }
  }
}
```

### Local MCP Configuration

Add the following to your MCP client config (e.g., Cursor settings):

```json
{
  "mcpServers": {
    "spartan-ui": {
      "command": [
        "node",
        "/path/to/your/spartan-ui-mcp/dist/server.js"
      ],
      "type": "local",
      "enabled": true
    }
  }
}
```

1. Run `npm run build` to compile TypeScript to `dist/`
2. Update the `command` paths to match your Node.js binary and project location
3. Restart your MCP client

### Example Tool Calls

#### **Components, Blocks, and Docs**

```json
// List all known components
{ "tool": "spartan_components_list" }

// Fetch the latest accordion API data
{ "tool": "spartan_components_get", "name": "accordion", "extract": "api" }

// Fetch a docs topic from the live Spartan site
{ "tool": "spartan_docs_get", "topic": "cli", "extract": "headings" }

// List available blocks
{ "tool": "spartan_blocks_list" }

// Fetch a block and its examples
{ "tool": "spartan_blocks_get", "name": "sidebar", "format": "text" }
```

#### **Analysis, Health, and Cache**

```json
// Analyze dependencies
{ "tool": "spartan_components_dependencies", "componentName": "dialog" }

// Run accessibility analysis
{ "tool": "spartan_accessibility_check", "componentName": "accordion", "checkType": "all" }

// Check docs-site availability
{ "tool": "spartan_health_check", "topics": ["installation", "cli"] }

// Inspect cache state
{ "tool": "spartan_cache_status" }
```

Prompt names:

- `spartan-get-started`
- `spartan-compare-apis`
- `spartan-implement-feature`
- `spartan-troubleshoot`
- `spartan-list-components`

## 🛠 Available MCP Surface

### **Tools (17)**

- `spartan_components_list`
- `spartan_components_get`
- `spartan_docs_get`
- `spartan_health_check`
- `spartan_health_instructions`
- `spartan_health_command`
- `spartan_meta`
- `spartan_components_dependencies`
- `spartan_accessibility_check`
- `spartan_cache_status`
- `spartan_cache_clear`
- `spartan_cache_rebuild`
- `spartan_cache_switch_version`
- `spartan_cache_list_versions`
- `spartan_blocks_list`
- `spartan_blocks_get`
- `spartan_blocks_dependencies`

### **Resources (4)**

- `spartan://components/list`
- `spartan://component/{name}/api`
- `spartan://component/{name}/examples`
- `spartan://component/{name}/full`

### **Prompts (5)**

- `spartan-get-started`
- `spartan-compare-apis`
- `spartan-implement-feature`
- `spartan-troubleshoot`
- `spartan-list-components`

## 📊 Output Formats

- **`html`** - Raw HTML from documentation pages
- **`text`** - Clean plain text (HTML tags stripped)
- **`api`** - Structured JSON with Brain/Helm API specifications
- **`code`** - Extracted code blocks with context
- **`headings`** - Section headings for navigation
- **`links`** - Extracted links and references

## ⚡ Performance & Caching

- **Intelligent Caching**: 5-minute TTL with configurable cache via `SPARTAN_CACHE_TTL_MS`
- **Batch Processing**: Efficient handling of multiple component requests
- **Error Resilience**: Graceful handling of failed requests with fallbacks
- **Response Optimization**: Structured outputs for faster AI processing

## 🎯 AI Processing Enhancements

The server includes special features to guide AI models:

- **Processing Instructions**: Clear guidance in every response
- **Structured Outputs**: JSON format with metadata and instructions
- **Enhanced Descriptions**: Detailed tool descriptions with usage examples
- **Error Context**: Comprehensive error messages with suggestions

## 🧪 Testing & Validation

- ✅ All 46 components validated and accessible
- ✅ Complete API extraction testing
- ✅ Code generation validation
- ✅ Search functionality verification
- ✅ Accessibility analysis testing

## 🔧 Configuration

### Environment Variables

- `SPARTAN_CACHE_TTL_MS` - Cache TTL in milliseconds (default: 300000 = 5 minutes)

## 📝 Notes

- **Data Source**: All content fetched from public Spartan UI pages at [spartan.ng](https://www.spartan.ng)
- **Input Validation**: Comprehensive Zod schema validation for all tool inputs
- **Source Attribution**: All responses include source URLs for transparency
- **Error Handling**: Graceful handling of 404s and network issues
- **Type Safety**: Full TypeScript support with proper type annotations


**Built for the Spartan Angular UI community** 🏛️

This MCP server transforms static documentation into intelligent, queryable tools that enhance the developer experience with Spartan UI components.


This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build ui-mcp` to build the library.

## Running unit tests

Run `nx test ui-mcp` to execute the unit tests via [Jest](https://jestjs.io).
