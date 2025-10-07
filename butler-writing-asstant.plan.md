# Butler - Complete Writing Assistant Transformation

## Architecture Overview

Refactor existing codebase into a modular architecture:

-   **manifest.json**: Add side_panel permission, update branding
-   **background.js**: Enhance to manage side panel, context menus, and message routing
-   **content.js**: Refactor into content script manager with inline UI injection
-   **sidepanel.html/js**: New side panel for corrections list and chat interface
-   **New modules**: TextDetector, GrammarChecker, TextRewriter, InlineUI, ChatManager

## Phase 1: Spell & Grammar Correction

### 1.1 Text Detection System

Create `modules/textDetector.js`:

-   Monitor all editable elements: textarea, input[type="text"], contenteditable divs
-   Special handling for Google Docs (contenteditable with complex DOM)
-   Use MutationObserver for dynamic content
-   Debounce text changes (500ms) to avoid excessive API calls
-   Track element state to avoid duplicate processing

### 1.2 Grammar Engine Integration

Create `modules/grammarChecker.js`:

-   Use LanguageModel API with specialized prompts for grammar/spell checking
-   Create persistent session with grammar-focused system prompts
-   Return structured error objects: {type, position, suggestion, severity}
-   Cache results per text chunk to optimize performance

### 1.3 Inline UI System

Create `modules/inlineUI.js`:

-   Inject custom CSS for underline styles (red for spelling, blue for grammar)
-   Position absolute overlay divs for underlines
-   Create popup card component that appears on hover/click
-   Handle z-index management for complex pages
-   Provide "Accept", "Ignore", "Ignore All" actions

### 1.4 Side Panel - Corrections View

Create `sidepanel/corrections.html` and `sidepanel/corrections.js`:

-   List all detected issues grouped by severity
-   Show context snippet for each issue
-   One-click navigation to issue location in page
-   Bulk "Accept All" functionality
-   Real-time sync with inline UI state

Key files to modify:

-   `content.js`: Import and initialize TextDetector + InlineUI
-   `background.js`: Add message handlers for correction actions
-   `manifest.json`: Add "side_panel" permission

## Phase 2: Text Rewriting Features

### 2.1 Rewrite Engine

Create `modules/textRewriter.js`:

-   Integrate existing Rewriter API (already in content.js)
-   Add LanguageModel API for advanced rewrites
-   Preset modes: Formal, Casual, Concise, Expand, Simplify, Professional
-   Custom prompt support for user-defined rewrites

### 2.2 Context Menu Integration

Update `background.js`:

-   Add context menu on text selection: "Butler → Rewrite as..."
-   Submenu with preset options
-   Send selected text to content script for processing

### 2.3 Inline Rewrite UI

Extend `modules/inlineUI.js`:

-   Show floating toolbar on text selection
-   Quick access buttons for common rewrites
-   Preview rewrite before applying
-   "Undo" functionality to restore original

### 2.4 Side Panel - Rewrite History

Extend `sidepanel/corrections.html`:

-   Add "Rewrites" tab showing history
-   Store before/after pairs
-   Allow reverting previous rewrites
-   Export rewrite history

## Phase 3: Full LLM Chat Experience

### 3.1 Chat Interface

Create `sidepanel/chat.html` and `sidepanel/chat.js`:

-   Clean chat UI with message bubbles
-   Input area with send button
-   Streaming response support (use LanguageModel.promptStreaming)
-   Context awareness: can reference current page content
-   Chat history persistence (localStorage)

### 3.2 Chat Manager

Create `modules/chatManager.js`:

-   Manage LanguageModel session lifecycle
-   Handle message history and context
-   Implement streaming message display
-   Quick actions: "Improve this text", "Explain selection", "Summarize page"

### 3.3 Context Integration

Update `content.js`:

-   Add message listener for "Get selected text"
-   Add "Get page context" (title, main content)
-   Allow chat to insert generated text at cursor position

### 3.4 Chat Features

-   System prompts emphasizing privacy and local processing
-   Quick templates: "Help me write...", "Check this text...", "Rewrite as..."
-   Citation of sources (from page content when relevant)
-   Clear session button to start fresh

## UI/UX Enhancements

### Branding Updates

-   Update extension name to "Butler - Private AI Writing Assistant"
-   Create icon set (16x16, 32x32, 48x48, 128x128)
-   Consistent color scheme: Professional blues/grays
-   Add tagline: "Your private, local writing assistant"

### Side Panel Tabs

Create tabbed interface in sidepanel:

1. **Issues Tab**: Grammar/spelling corrections
2. **Rewrites Tab**: Rewrite history and quick actions
3. **Chat Tab**: Full LLM conversation interface
4. **Settings Tab**: Preferences and configuration

### Settings & Preferences

Create `sidepanel/settings.html`:

-   Toggle inline corrections on/off
-   Select default rewrite tone
-   Configure aggressiveness of grammar checking
-   Clear chat history
-   About section emphasizing privacy

## Technical Implementation Details

### Manifest Changes

```json
{
    "name": "Butler - Private AI Writing Assistant",
    "permissions": [
        "activeTab",
        "scripting",
        "contextMenus",
        "storage",
        "sidePanel"
    ],
    "side_panel": {
        "default_path": "sidepanel/index.html"
    }
}
```

### Message Architecture

Implement structured messaging between components:

-   content.js ↔ background.js: Grammar checks, rewrite requests
-   sidepanel ↔ background.js: Issue list sync, chat context requests
-   Use chrome.runtime.sendMessage with action types

### Performance Optimizations

-   Lazy load LanguageModel sessions (only create when needed)
-   Debounce text analysis (500ms after typing stops)
-   Virtual scrolling for large issue lists
-   Cache grammar check results (5min TTL)
-   Limit simultaneous API calls (max 3 concurrent)

### Google Docs Compatibility

Special handling in `textDetector.js`:

-   Detect Google Docs by URL pattern
-   Find contenteditable elements with role="textbox"
-   Handle Docs' complex DOM structure (span-per-character)
-   Extract clean text from Docs format
-   Apply corrections via document.execCommand or Docs API

## Testing Strategy

Update test files:

-   `test.html`: Add contenteditable div tests
-   Create `test-googledocs.html`: Mock Google Docs structure
-   Create `test-chat.html`: Test chat interface standalone
-   Add error handling test cases

## File Structure

```
butler/
├── manifest.json (updated)
├── background.js (enhanced)
├── content.js (refactored)
├── modules/
│   ├── textDetector.js (new)
│   ├── grammarChecker.js (new)
│   ├── textRewriter.js (new)
│   ├── inlineUI.js (new)
│   └── chatManager.js (new)
├── sidepanel/
│   ├── index.html (new, tabbed interface)
│   ├── styles.css (new)
│   ├── corrections.js (new)
│   ├── rewrites.js (new)
│   ├── chat.js (new)
│   └── settings.js (new)
├── icons/ (new)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── styles/
│   └── inline.css (new, injected into pages)
└── tests/
    ├── test.html (updated)
    ├── test-googledocs.html (new)
    └── test-chat.html (new)
```

## Privacy & Marketing Points

Emphasize in UI and README:

-   ✓ 100% local processing (Built-in Chrome AI)
-   ✓ Zero network calls
-   ✓ No data collection
-   ✓ No account required
-   ✓ Works offline
-   ✓ Free forever (no subscriptions)
-   ✓ "Grammarly killer" positioning
