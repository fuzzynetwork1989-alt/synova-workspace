# 📚 Synova Nexus API Documentation

Complete API reference for Synova Nexus LLM with all integrated components.

## Table of Contents

- [Core API](#core-api)
- [Supanova Agent API](#supanova-agent-api)
- [Astranova Browser API](#astranova-browser-api)
- [Voice Capabilities API](#voice-capabilities-api)
- [XR Capabilities API](#xr-capabilities-api)
- [Events](#events)
- [Types and Interfaces](#types-and-interfaces)

## Core API

### SynovaNexusMain

Main class for Synova Nexus LLM with all integrated components.

#### Constructor

```typescript
constructor(config: SynovaNexusConfig)
```

**Parameters:**

- `config`: Configuration object for all components

**Example:**

```typescript
const nexus = new SynovaNexusMain({
  model: {
    name: 'Synova Nexus',
    version: '1.0.0',
    context_window: 8192,
    max_tokens: 4096,
    temperature_range: [0.1, 2.0]
  },
  components: {
    supanova: { enabled: true },
    astranova: { enabled: true },
    voice: { enabled: true },
    xr: { enabled: true }
  }
});
```

#### Methods

##### chat()

Generate a response from the LLM with component enhancement.

```typescript
async chat(input: string, options?: any): Promise<any>
```

**Parameters:**

- `input`: Text input for the LLM
- `options`: Optional generation parameters

**Returns:**
Enhanced response object with component data

**Example:**

```typescript
const response = await nexus.chat("What is artificial intelligence?");
console.log(response.text);
console.log(response.supanova_suggestions);
console.log(response.web_results);
```

##### chatStreaming()

Generate a streaming response from the LLM.

```typescript
async *chatStreaming(input: string, options?: any): AsyncGenerator<any>
```

**Parameters:**

- `input`: Text input for the LLM
- `options`: Optional generation parameters

**Returns:**
Async generator yielding response chunks

**Example:**

```typescript
for await (const chunk of nexus.chatStreaming("Explain quantum computing")) {
  console.log(chunk.text);
  if (chunk.supanova_suggestions) {
    console.log('Tools suggested:', chunk.supanova_suggestions);
  }
}
```

##### useSupanova()

Execute a specific Supanova tool.

```typescript
async useSupanova(tool: string, parameters: any): Promise<any>
```

**Parameters:**

- `tool`: Name of the tool to execute
- `parameters`: Parameters for the tool

**Returns:**
Tool execution result

**Example:**

```typescript
const searchResult = await nexus.useSupanova('search', {
  query: 'machine learning',
  limit: 10
});

const summary = await nexus.useSupanova('summarize', {
  content: 'Long text to summarize...',
  format: 'bullet_points'
});
```

##### browseWeb()

Navigate to a URL or search the web.

```typescript
async browseWeb(url?: string, query?: string): Promise<any>
```

**Parameters:**

- `url`: URL to navigate to (optional)
- `query`: Search query (optional)

**Returns:**
Browser session or search results

**Example:**

```typescript
// Navigate to URL
const tab = await nexus.browseWeb('https://example.com');

// Search web
const results = await nexus.browseWeb(query='artificial intelligence');
```

##### speak()

Generate speech from text.

```typescript
async speak(text: string, options?: any): Promise<any>
```

**Parameters:**

- `text`: Text to synthesize
- `options`: Voice synthesis options

**Returns:**
Audio output data

**Example:**

```typescript
const audio = await nexus.speak("Hello, world!", {
  voice: 'neural_en_female',
  emotion: 'happy',
  speed: 1.0,
  pitch: 0.5
});
```

##### listen()

Start speech recognition.

```typescript
async listen(options?: any): Promise<any>
```

**Parameters:**

- `options`: Voice recognition options

**Returns:**
Recognized speech input

**Example:**

```typescript
const voiceInput = await nexus.listen({
  language: 'en',
  continuous: true,
  max_duration: 30000
});
```

##### enterXR()

Start an XR session.

```typescript
async enterXR(deviceId: string, type: 'ar' | 'vr' | 'mr'): Promise<any>
```

**Parameters:**

- `deviceId`: XR device identifier
- `type`: Type of XR session

**Returns:**
XR session object

**Example:**

```typescript
const session = await nexus.enterXR('meta_quest_3', 'vr');
```

##### getStatus()

Get the current status of all components.

```typescript
getStatus(): any
```

**Returns:**
Status object with component states

**Example:**

```typescript
const status = nexus.getStatus();
console.log(status.supanova); // 'active' | 'disabled'
console.log(status.astranova); // 'active' | 'disabled'
```

##### getConfig()

Get the current configuration.

```typescript
getConfig(): SynovaNexusConfig
```

**Returns:**
Current configuration object

## Supanova Agent API

### SupanovaAgent

Advanced AI agent with tool execution capabilities.

#### Methods

##### processInput()

Process user input and generate enhanced response.

```typescript
async processInput(input: string, context?: any): Promise<any>
```

**Parameters:**

- `input`: User input text
- `context`: Optional context data

**Returns:**
Enhanced response with tool results

##### executeTool()

Execute a specific tool.

```typescript
async executeTool(toolName: string, parameters: any): Promise<any>
```

**Parameters:**

- `toolName`: Name of the tool
- `parameters`: Tool parameters

**Returns:**
Tool execution result

##### getActiveTasks()

Get all currently active tasks.

```typescript
getActiveTasks(): SupanovaTask[]
```

**Returns:**
Array of active tasks

##### getContext()

Get current agent context.

```typescript
getContext(): SupanovaContext
```

**Returns:**
Current context object

#### Available Tools

| Tool Name | Description | Parameters | Returns |
|------------|-------------|------------|---------|
| `web_search` | Search the web | `query: string`, `limit: number` | Search results |
| `local_search` | Search local knowledge | `query: string`, `scope: string` | Local results |
| `summarize` | Summarize content | `content: string`, `format: string` | Summary |
| `analyze` | Analyze data | `data: any`, `analysis_type: string` | Analysis |
| `create` | Create entities | `type: string`, `content: any`, `metadata: object` | Created entity |
| `update` | Update entities | `entity_id: string`, `updates: object` | Updated entity |
| `navigate` | Navigate to destinations | `destination: string`, `method: string` | Navigation result |
| `settings` | Manage settings | `action: string`, `key: string`, `value: any` | Settings result |

## Astranova Browser API

### AstranovaBrowser

AI-powered web browser with intelligent search and content extraction.

#### Methods

##### navigateTo()

Navigate to a specific URL.

```typescript
async navigateTo(url: string, options?: any): Promise<BrowserTab>
```

**Parameters:**

- `url`: URL to navigate to
- `options`: Navigation options

**Returns:**
Browser tab object

##### search()

Search the web for information.

```typescript
async search(query: string, engine?: string): Promise<SearchQuery>
```

**Parameters:**

- `query`: Search query
- `engine`: Search engine (optional)

**Returns:**
Search results object

##### extractContent()

Extract content from a URL.

```typescript
async extractContent(url: string): Promise<any>
```

**Parameters:**

- `url`: URL to extract content from

**Returns:**
Extracted content object

##### analyzePage()

Analyze the current page.

```typescript
async analyzePage(tabId: string): Promise<any>
```

**Parameters:**

- `tabId`: Tab identifier

**Returns:**
Page analysis object

##### searchAndExtract()

Combined search and content extraction.

```typescript
async searchAndExtract(query: string): Promise<any>
```

**Parameters:**

- `query`: Search query

**Returns:**
Combined search and extraction results

## Voice Capabilities API

### VoiceCapabilities

Voice input/output system with multi-language support.

#### Methods

##### startListening()

Start speech recognition.

```typescript
async startListening(options?: {
  language?: string;
  continuous?: boolean;
  max_duration?: number;
}): Promise<VoiceInput>
```

**Parameters:**

- `options`: Recognition options

**Returns:**
Voice input object

##### synthesizeSpeech()

Generate speech from text.

```typescript
async synthesizeSpeech(text: string, options?: {
  voice?: string;
  language?: string;
  emotion?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
}): Promise<VoiceOutput>
```

**Parameters:**

- `text`: Text to synthesize
- `options`: Synthesis options

**Returns:**
Voice output object

##### recognizeAudio()

Recognize audio buffer.

```typescript
async recognizeAudio(audioBuffer: Buffer, options?: {
  language?: string;
  format?: string;
  sample_rate?: number;
}): Promise<VoiceInput>
```

**Parameters:**

- `audioBuffer`: Audio data
- `options`: Recognition options

**Returns:**
Voice input object

##### playAudio()

Play audio buffer.

```typescript
async playAudio(audioData: Buffer, options?: {
  volume?: number;
  fade_in?: number;
  fade_out?: number;
}): Promise<void>
```

**Parameters:**

- `audioData`: Audio data
- `options`: Playback options

## XR Capabilities API

### XRCapabilities

Extended reality system with AR/VR/MR support.

#### Methods

##### startSession()

Start an XR session.

```typescript
async startSession(deviceId: string, type: 'ar' | 'vr' | 'mr', options?: any): Promise<XRSession>
```

**Parameters:**

- `deviceId`: Device identifier
- `type`: Session type
- `options`: Session options

**Returns:**
XR session object

##### createObject()

Create a 3D object.

```typescript
createObject(type: 'primitive' | 'model' | 'text' | 'ui' | 'portal', properties: any): XRObject
```

**Parameters:**

- `type`: Object type
- `properties`: Object properties

**Returns:**
XR object

##### analyzeEnvironment()

Analyze the XR environment.

```typescript
async analyzeEnvironment(): Promise<any>
```

**Returns:**
Environment analysis object

##### createPortal()

Create an AR/MR portal.

```typescript
async createPortal(destination: string, position: { x: number; y: number; z: number }): Promise<XRObject>
```

**Parameters:**

- `destination`: Portal destination
- `position`: Portal position

**Returns:**
Portal object

## Events

All components emit events for monitoring and debugging.

### Supanova Events

| Event | Data | Description |
|-------|------|-------------|
| `task_created` | `SupanovaTask` | Task created |
| `task_started` | `SupanovaTask` | Task started |
| `task_completed` | `SupanovaTask` | Task completed |
| `task_failed` | `SupanovaTask` | Task failed |
| `context_updated` | `SupanovaContext` | Context updated |
| `tool_registered` | `SupanovaTool` | Tool registered |

### Astranova Events

| Event | Data | Description |
|-------|------|-------------|
| `tab_created` | `BrowserTab` | Tab created |
| `tab_loaded` | `BrowserTab` | Tab loaded |
| `tab_error` | `{ tab, error }` | Tab error |
| `search_completed` | `SearchQuery` | Search completed |
| `search_error` | `{ query, error }` | Search error |
| `page_analyzed` | `analysis` | Page analyzed |
| `portal_created` | `{ session_id, portal }` | Portal created |

### Voice Events

| Event | Data | Description |
|-------|------|-------------|
| `listening_started` | `{ language, continuous, maxDuration }` | Listening started |
| `speech_recognized` | `VoiceInput` | Speech recognized |
| `recognition_error` | `Error` | Recognition error |
| `listening_stopped` | - | Listening stopped |
| `synthesis_started` | `{ text, voice, language }` | Synthesis started |
| `synthesis_completed` | `VoiceOutput` | Synthesis completed |
| `synthesis_error` | `Error` | Synthesis error |

### XR Events

| Event | Data | Description |
|-------|------|-------------|
| `device_connected` | `XRDevice` | Device connected |
| `device_disconnected` | `XRDevice` | Device disconnected |
| `session_started` | `XRSession` | Session started |
| `session_ended` | `XRSession` | Session ended |
| `space_created` | `{ session_id, space }` | Space created |
| `object_created` | `{ session_id, object }` | Object created |
| `interaction_recorded` | `{ session_id, interaction }` | Interaction recorded |

## Types and Interfaces

### Core Types

```typescript
interface SynovaNexusConfig {
  model: {
    name: string;
    version: string;
    context_window: number;
    max_tokens: number;
    temperature_range: [number, number];
  };
  components: {
    supanova: SupanovaConfig;
    astranova: AstranovaConfig;
    voice: VoiceConfig;
    xr: XRConfig;
  };
  infrastructure: {
    compute: 'cpu' | 'gpu' | 'tpu' | 'hybrid';
    memory: string;
    storage: string;
    networking: string;
  };
}
```

### Supanova Types

```typescript
interface SupanovaTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
  requires_confirmation: boolean;
  category: 'search' | 'analysis' | 'creation' | 'navigation' | 'system';
}

interface SupanovaTask {
  id: string;
  type: string;
  description: string;
  parameters: any;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
  updated_at: string;
}
```

### Astranova Types

```typescript
interface BrowserTab {
  id: string;
  url: string;
  title: string;
  content: string;
  screenshot?: string;
  metadata: {
    load_time: number;
    content_type: string;
    size: number;
    timestamp: string;
  };
  status: 'loading' | 'loaded' | 'error';
}

interface SearchQuery {
  query: string;
  engine: string;
  results: SearchResult[];
  timestamp: string;
}
```

### Voice Types

```typescript
interface VoiceInput {
  text: string;
  confidence: number;
  language: string;
  speaker_id?: string;
  emotion?: string;
  timestamp: string;
  metadata: {
    duration: number;
    sample_rate: number;
    format: string;
    noise_level: number;
  };
}

interface VoiceOutput {
  audio: Buffer;
  text: string;
  voice: string;
  language: string;
  emotion?: string;
  speed: number;
  pitch: number;
  volume: number;
  timestamp: string;
  format: string;
}
```

### XR Types

```typescript
interface XRSession {
  id: string;
  device_id: string;
  type: 'ar' | 'vr' | 'mr';
  active: boolean;
  start_time: string;
  end_time?: string;
  duration?: number;
  spaces: XRSpace[];
  objects: XRObject[];
  interactions: XRInteraction[];
  settings: XRSessionSettings;
}

interface XRObject {
  id: string;
  type: 'primitive' | 'model' | 'text' | 'ui' | 'portal';
  geometry?: any;
  material?: any;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  scale: { x: number; y: number; z: number };
  interactive: boolean;
  visible: boolean;
  metadata: any;
}
```

## Error Handling

All methods throw errors for invalid inputs or system failures. Always wrap calls in try-catch blocks:

```typescript
try {
  const response = await nexus.chat("Hello, world!");
  console.log(response);
} catch (error) {
  console.error('Error:', error.message);
}
```

## Performance Considerations

- Use streaming for long responses
- Cache frequently used data
- Monitor component status
- Handle errors gracefully
- Use appropriate timeouts for network operations

## Security Notes

- Validate all input parameters
- Sanitize web content
- Use secure connections for web requests
- Implement proper authentication for XR devices
- Handle voice data securely
