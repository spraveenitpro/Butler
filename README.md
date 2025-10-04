# Butler - AI-Powered Text Rewriter Chrome Extension

Butler is a Chrome extension that leverages AI to automatically improve and rewrite text content on web pages. It uses the Rewriter API to enhance text quality, fix grammar and spelling errors, and make content more constructive and professional.

## 🚀 Features

-   **Automatic Text Enhancement**: Automatically detects and improves text content in textarea elements
-   **Grammar & Spelling Correction**: Fixes spelling mistakes and grammar errors
-   **Content Tone Improvement**: Makes negative or toxic content more constructive
-   **Smart Processing**: Only processes text longer than 10 characters to avoid unnecessary API calls
-   **User-Friendly Notifications**: Shows success/error notifications to users
-   **API Testing Suite**: Includes comprehensive testing for both Rewriter and LanguageModel APIs

## 📁 Project Structure

```
butler/
├── manifest.json          # Chrome extension manifest
├── background.js          # Service worker for extension button handling
├── content.js            # Main content script with text processing logic
├── apiTest.js            # API testing and demonstration code
├── test.html             # Test page for extension functionality
├── testindex.html        # API testing page
└── README.md             # This file
```

## 🛠️ Installation

### Prerequisites

-   Chrome browser (version 88 or higher)
-   Access to the Rewriter API (requires trial tokens in manifest)

### Setup

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd butler
    ```

2. **Load the extension in Chrome**

    - Open Chrome and navigate to `chrome://extensions/`
    - Enable "Developer mode" in the top right
    - Click "Load unpacked" and select the butler directory
    - The Butler extension should now appear in your extensions list

3. **Test the extension**
    - Open `test.html` in your browser
    - Click the Butler extension button in the Chrome toolbar
    - Watch as text content gets automatically improved!

## 🎯 How It Works

### Extension Flow

1. **User clicks the Butler extension button** in the Chrome toolbar
2. **Background script** (`background.js`) handles the click event
3. **Content script** (`content.js`) is injected into the active tab
4. **Text processing** begins:
    - Scans for `textarea` elements on the page
    - Filters out empty or very short text (< 10 characters)
    - Uses the Rewriter API to improve text quality
    - Updates the page with improved content
    - Shows user notification with results

### API Integration

The extension uses two main APIs:

#### Rewriter API

-   **Purpose**: Text improvement and rewriting
-   **Features**: Grammar correction, tone improvement, content enhancement
-   **Configuration**: Casual tone, plain text format, shorter length

#### LanguageModel API

-   **Purpose**: Advanced language processing and conversation
-   **Features**: Session management, prompt generation, streaming responses
-   **Use Case**: Testing and advanced text generation

## 🧪 Testing

### Extension Testing

1. **Load the test page**: Open `test.html` in your browser
2. **Add content**: Type or paste text into the textarea elements
3. **Activate extension**: Click the Butler extension button
4. **Observe results**: Watch as text gets automatically improved
5. **Check console**: Open browser dev tools to see detailed logs

### API Testing

1. **Load the API test page**: Open `testindex.html`
2. **Run tests**: Click "Run Tests" button or check console
3. **Monitor output**: Watch console for API availability, session creation, and prompt generation

### Test Cases

The `test.html` includes several test scenarios:

-   **Negative reviews**: Harsh product/service reviews
-   **Angry messages**: Toxic or aggressive communication
-   **Empty fields**: Ensures empty textareas are skipped
-   **Short text**: Verifies minimum length requirements

## ⚙️ Configuration

### Extension Settings

The extension can be configured in `content.js`:

```javascript
const options = {
    tone: 'more-casual', // Tone: 'more-casual', 'more-formal', etc.
    format: 'plain-text', // Format: 'plain-text', 'markdown', etc.
    length: 'shorter', // Length: 'shorter', 'longer', etc.
}
```

### Permissions

The extension requires minimal permissions:

-   `activeTab`: Access to the currently active tab
-   `scripting`: Ability to inject and execute scripts

## 🔧 Development

### Key Files

-   **`manifest.json`**: Extension configuration and permissions
-   **`background.js`**: Service worker for extension lifecycle management
-   **`content.js`**: Main logic for text processing and API integration
-   **`apiTest.js`**: Comprehensive API testing and demonstration

### API Usage Examples

#### Basic Rewriter Usage

```javascript
const rewriter = await Rewriter.create({
    tone: 'more-casual',
    format: 'plain-text',
    length: 'shorter',
})

const result = await rewriter.rewrite(text, {
    context: 'Fix grammar and spelling errors',
})
```

#### LanguageModel Session

```javascript
const session = await LanguageModel.create({
    language: ['en'],
    initialPrompts: [...]
});

const response = await session.prompt('Your question here');
```

## 🐛 Troubleshooting

### Common Issues

1. **Extension not working**

    - Check that developer mode is enabled
    - Verify the extension is loaded without errors
    - Check browser console for error messages

2. **API not available**

    - Ensure you have valid trial tokens in `manifest.json`
    - Check API availability status in console
    - Verify network connectivity

3. **Text not being processed**
    - Ensure text is in `textarea` elements
    - Check that text is longer than 10 characters
    - Verify the element hasn't already been processed

### Debug Mode

Enable detailed logging by opening browser dev tools (F12) and checking the console for:

-   Extension activation messages
-   API availability status
-   Text processing progress
-   Error messages and stack traces

## 📝 API Reference

### Rewriter API Methods

-   `Rewriter.availability()`: Check if the API is available
-   `Rewriter.create(options)`: Create a new rewriter instance
-   `rewriter.rewrite(text, context)`: Rewrite text with given context

### LanguageModel API Methods

-   `LanguageModel.availability()`: Check API availability
-   `LanguageModel.params()`: Get API parameters
-   `LanguageModel.create(config)`: Create a new session
-   `session.prompt(text)`: Generate a response
-   `session.promptStreaming(text)`: Stream responses
-   `session.destroy()`: Clean up session resources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with both test pages
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

-   Built using Chrome Extension Manifest V3
-   Powered by the Rewriter API for text enhancement
-   Uses LanguageModel API for advanced language processing

---

**Note**: This extension requires valid API trial tokens to function. Make sure to configure them in the `manifest.json` file before testing.
