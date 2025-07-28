# Audio Transcription Feature

This document explains how to set up and use the audio transcription functionality using OpenAI Whisper.

## Quick Start

1. Navigate to `/transcribe` in your browser
2. Either upload an audio file or record directly in the browser
3. Click "Transcribe Audio" to get AI-powered transcription
4. Copy the results to your clipboard

## Setup

1. **Install dependencies** (already done):
   ```bash
   npm install openai
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   - Get your API key from: https://platform.openai.com/api-keys

## Features

### 📁 File Upload
- Drag & drop interface for easy file upload
- Support for all major audio formats
- Real-time file validation and preview
- Visual feedback for file selection

### 🎤 Audio Recording
- Direct browser-based audio recording
- Record, pause, resume, and stop controls
- Real-time recording timer
- Audio playback before transcription
- One-click recording cleanup

### 🤖 AI Transcription
- Powered by OpenAI Whisper
- High-accuracy speech-to-text conversion
- Comprehensive error handling
- Real-time progress indicators

### 📋 Results Management
- Formatted transcription display
- One-click copy to clipboard
- Success/error status indicators
- Detailed error messages for troubleshooting

## Page Components

### Navigation Tabs
- **Upload File**: For pre-recorded audio files
- **Record Audio**: For live audio recording

### Upload Interface
- Drag-and-drop file upload area
- File information display (name, size, type)
- Format validation
- Size limit enforcement (25MB max)

### Recording Interface
- Visual recording indicator with pulse animation
- Recording time display
- Control buttons (Start, Pause, Resume, Stop, Clear)
- Audio playback controls
- Recording status badges

### Transcription Display
- Success/error state management
- Formatted text output
- Copy functionality
- Error message display

## Usage Examples

### Server Action Integration

```typescript
import { transcribeAudio } from "@/app/actions/transcribe";

// Basic usage
const formData = new FormData();
formData.append("audio", audioFile);
const result = await transcribeAudio(formData);

if (result.success) {
  console.log("Transcription:", result.text);
} else {
  console.error("Error:", result.error);
}
```

### Advanced Configuration

```typescript
import { transcribeAudioAdvanced } from "@/app/actions/transcribe";

const result = await transcribeAudioAdvanced(formData, {
  language: "en", // Specify language
  prompt: "This is a meeting about...", // Context prompt
  temperature: 0, // Controls randomness (0-1)
  responseFormat: "text" // "json" | "text" | "srt" | "verbose_json" | "vtt"
});
```

### Component Usage in Other Pages

```typescript
import AudioTranscriber from "@/components/audio-transcriber";

export default function MyPage() {
  return (
    <div>
      <AudioTranscriber />
    </div>
  );
}
```

## Supported File Types

- **MP3** (.mp3) - Most common audio format
- **MP4** (.mp4, .m4a) - Apple and modern formats
- **WAV** (.wav) - Uncompressed audio
- **WEBM** (.webm) - Web-optimized format
- **OGG** (.ogg) - Open-source format
- **FLAC** (.flac) - Lossless compression

## Technical Specifications

### File Size Limits
- **Maximum file size**: 25MB (OpenAI Whisper limit)
- **Recommended size**: Under 10MB for optimal performance
- **For larger files**: Consider splitting or compression

### Recording Specifications
- **Sample Rate**: Browser default (typically 44.1kHz)
- **Bit Depth**: Browser default (typically 16-bit)
- **Format**: WebM (preferred) or MP4 fallback
- **Channels**: Mono recording for optimal transcription

### Browser Compatibility
- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile browsers**: Limited recording support

## Error Handling

The application includes comprehensive error handling for:

### File-related Errors
- Invalid file types
- File size exceeding limits
- Corrupted audio files
- Empty file uploads

### API-related Errors
- Missing or invalid OpenAI API key
- Rate limiting from OpenAI
- Network connectivity issues
- Server timeout errors

### Browser-related Errors
- Microphone permission denied
- Unsupported browser features
- Audio recording failures

## Performance Optimization

### Best Practices
1. **Audio Quality**: Use clear, noise-free recordings
2. **File Format**: Prefer MP3 or M4A for smaller file sizes
3. **Recording Length**: Keep recordings under 10 minutes
4. **Internet Connection**: Ensure stable connection for upload

### Troubleshooting Tips
1. **Slow transcription**: Check file size and internet connection
2. **Poor accuracy**: Ensure clear audio and minimal background noise
3. **Recording issues**: Check browser permissions and microphone access
4. **Upload failures**: Verify file format and size limits

## Response Formats

The transcription service supports different response formats:

- **text**: Plain text transcription (default)
- **json**: JSON with text and basic metadata
- **srt**: SubRip subtitle format with timestamps
- **vtt**: WebVTT subtitle format
- **verbose_json**: Detailed JSON with timestamps and confidence scores

## Integration with Other Features

### Database Storage
```typescript
// Example: Save transcription to database
const transcription = await transcribeAudio(formData);
if (transcription.success) {
  await saveToDatabase({
    text: transcription.text,
    timestamp: new Date(),
    userId: currentUser.id
  });
}
```

### Task Generation
```typescript
// Example: Convert transcription to tasks
const transcription = await transcribeAudio(formData);
if (transcription.success) {
  const tasks = await generateTasks(transcription.text);
  // Process generated tasks...
}
```

## Security Considerations

1. **API Key Protection**: Never expose OpenAI API key in client-side code
2. **File Validation**: Server-side validation of all uploaded files
3. **Rate Limiting**: Implement user-based rate limiting for API calls
4. **Data Privacy**: Consider audio file storage and deletion policies

## Future Enhancements

### Planned Features
- Multiple language detection
- Speaker identification
- Real-time transcription streaming
- Transcription history
- Export to various formats
- Integration with calendar and task apps

### Advanced Options
- Custom vocabulary/terminology
- Industry-specific models
- Batch processing for multiple files
- Advanced audio preprocessing
