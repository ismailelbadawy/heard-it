"use server";

import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Supported audio file types for Whisper
const SUPPORTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/webm",
  "audio/m4a",
  "audio/ogg",
  "audio/flac",
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (OpenAI Whisper limit)

export interface TranscriptionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export async function transcribeAudio(formData: FormData): Promise<TranscriptionResult> {
  try {
    // Get the uploaded file
    const file = formData.get("audio") as File;
    
    if (!file) {
      return {
        success: false,
        error: "No audio file provided"
      };
    }

    // Validate file type
    if (!SUPPORTED_AUDIO_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported file type: ${file.type}. Supported types: ${SUPPORTED_AUDIO_TYPES.join(", ")}`
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size: 25MB`
      };
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured"
      };
    }

    // Convert File to the format expected by OpenAI
    const fileBuffer = await file.arrayBuffer();
    const fileForOpenAI = new File([fileBuffer], file.name, { type: file.type });

    // Transcribe the audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fileForOpenAI,
      model: "whisper-1",
      response_format: "text",
    });

    return {
      success: true,
      text: transcription
    };

  } catch (error) {
    console.error("Transcription error:", error);
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return {
          success: false,
          error: "Invalid or missing OpenAI API key"
        };
      }
      
      if (error.message.includes("rate limit")) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again later."
        };
      }
    }

    return {
      success: false,
      error: "Failed to transcribe audio. Please try again."
    };
  }
}

// Alternative function with more configuration options
export async function transcribeAudioAdvanced(
  formData: FormData,
  options?: {
    language?: string;
    prompt?: string;
    temperature?: number;
    responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt";
  }
): Promise<TranscriptionResult> {
  try {
    const file = formData.get("audio") as File;
    
    if (!file) {
      return {
        success: false,
        error: "No audio file provided"
      };
    }

    // Validate file type and size (same as above)
    if (!SUPPORTED_AUDIO_TYPES.includes(file.type)) {
      return {
        success: false,
        error: `Unsupported file type: ${file.type}`
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: `File size too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size: 25MB`
      };
    }

    if (!process.env.OPENAI_API_KEY) {
      return {
        success: false,
        error: "OpenAI API key not configured"
      };
    }

    const fileBuffer = await file.arrayBuffer();
    const fileForOpenAI = new File([fileBuffer], file.name, { type: file.type });

    // Transcribe with advanced options
    const transcription = await openai.audio.transcriptions.create({
      file: fileForOpenAI,
      model: "whisper-1",
      language: options?.language,
      prompt: options?.prompt,
      temperature: options?.temperature ?? 0,
      response_format: options?.responseFormat ?? "text",
    });

    return {
      success: true,
      text: typeof transcription === "string" ? transcription : transcription.text
    };

  } catch (error) {
    console.error("Advanced transcription error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return {
          success: false,
          error: "Invalid or missing OpenAI API key"
        };
      }
      
      if (error.message.includes("rate limit")) {
        return {
          success: false,
          error: "Rate limit exceeded. Please try again later."
        };
      }
    }

    return {
      success: false,
      error: "Failed to transcribe audio. Please try again."
    };
  }
}
