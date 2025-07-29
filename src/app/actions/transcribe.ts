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
  "audio/x-m4a"
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (OpenAI Whisper limit)

export interface KeyPoint {
  point: string;
  importance: "high" | "medium" | "low";
  category?: string;
}

export interface Task {
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  deadline?: string;
  category: "work" | "personal" | "meeting" | "follow-up" | "research" | "other";
  completed: boolean;
}

export interface ProcessedAudioResult {
  success: boolean;
  summary?: string;
  tags?: string[];
  keyPoints?: KeyPoint[];
  tasks?: Task[];
  rawTranscript?: string; // Keep for future use
  metadata?: {
    duration?: number;
    fileSize: number;
    fileName: string;
    processedAt: string;
  };
  error?: string;
}

// Legacy interface for backward compatibility
export interface TranscriptionResult {
  success: boolean;
  text?: string;
  error?: string;
}

// Helper function to process raw transcript into summary, tags, key points, and tasks
async function processTranscript(transcript: string): Promise<{
  summary: string;
  tags: string[];
  keyPoints: KeyPoint[];
  tasks: Task[];
}> {
  const prompt = `Analyze the following voice recording transcript and provide:

1. A concise, professional summary (2-3 sentences) that captures the key points and main purpose
2. Relevant professional tags (5-8 tags) that categorize the content (e.g., meeting, idea, task, reminder, project, etc.)
3. Key points extracted from the content - important insights, decisions, or information mentioned
4. Actionable tasks or to-dos mentioned in the recording

Transcript:
"${transcript}"

Please respond in the following JSON format:
{
  "summary": "Your concise summary here",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "keyPoints": [
    {
      "point": "Key insight or information",
      "importance": "high|medium|low",
      "category": "decision|insight|fact|idea"
    }
  ],
  "tasks": [
    {
      "title": "Task title",
      "description": "Optional detailed description",
      "priority": "high|medium|low", 
      "deadline": "YYYY-MM-DD if mentioned or null",
      "category": "work|personal|meeting|follow-up|research|other",
      "completed": false
    }
  ]
}

Instructions:
- Extract 3-7 key points that capture the most important information
- Only include tasks that are explicitly mentioned or clearly implied as action items
- Set priority based on urgency/importance mentioned in the recording
- Use null for deadline if no specific date/time is mentioned
- If no tasks are mentioned, return an empty array`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional assistant that helps organize and categorize voice recordings. Always respond with valid JSON in the exact format requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);
    
    return {
      summary: parsed.summary || "Unable to generate summary",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : []
    };

  } catch (error) {
    console.error("Error processing transcript:", error);
    
    // Fallback: generate basic summary and tags
    const words = transcript.split(" ");
    const summary = words.length > 50 
      ? words.slice(0, 50).join(" ") + "..."
      : transcript;
    
    const basicTags = ["voice-note", "unprocessed"];
    
    return {
      summary: summary || "Voice recording captured",
      tags: basicTags,
      keyPoints: [],
      tasks: []
    };
  }
}

export async function processAudio(formData: FormData): Promise<ProcessedAudioResult> {
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

    // Step 1: Transcribe the audio using OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fileForOpenAI,
      model: "whisper-1",
      response_format: "text",
    });

    const rawTranscript = transcription as string;

    // Step 2: Process the transcript to generate summary, tags, key points, and tasks
    const processed = await processTranscript(rawTranscript);

    // Step 3: Return structured result
    return {
      success: true,
      summary: processed.summary,
      tags: processed.tags,
      keyPoints: processed.keyPoints,
      tasks: processed.tasks,
      rawTranscript: rawTranscript,
      metadata: {
        fileSize: file.size,
        fileName: file.name,
        processedAt: new Date().toISOString(),
      }
    };

  } catch (error) {
    console.error("Audio processing error:", error);
    
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
      error: "Failed to process audio. Please try again."
    };
  }
}

// Legacy function for backward compatibility
export async function transcribeAudio(formData: FormData): Promise<TranscriptionResult> {
  const result = await processAudio(formData);
  
  return {
    success: result.success,
    text: result.summary, // Return summary as text for backward compatibility
    error: result.error
  };
}

// Advanced processing function with more options
export async function processAudioAdvanced(
  formData: FormData,
  options?: {
    language?: string;
    prompt?: string;
    temperature?: number;
    responseFormat?: "json" | "text" | "srt" | "verbose_json" | "vtt";
    processingStyle?: "professional" | "casual" | "meeting" | "idea" | "task";
    includeRawTranscript?: boolean;
  }
): Promise<ProcessedAudioResult> {
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

    // Step 1: Transcribe with advanced options
    const transcription = await openai.audio.transcriptions.create({
      file: fileForOpenAI,
      model: "whisper-1",
      language: options?.language,
      prompt: options?.prompt,
      temperature: options?.temperature ?? 0,
      response_format: options?.responseFormat ?? "text",
    });

    const rawTranscript = typeof transcription === "string" ? transcription : (transcription as any).text || "";

    // Step 2: Process with style-specific prompts
    const processed = await processTranscriptWithStyle(rawTranscript, options?.processingStyle);

    // Step 3: Return structured result
    const result: ProcessedAudioResult = {
      success: true,
      summary: processed.summary,
      tags: processed.tags,
      keyPoints: processed.keyPoints,
      tasks: processed.tasks,
      metadata: {
        fileSize: file.size,
        fileName: file.name,
        processedAt: new Date().toISOString(),
      }
    };

    // Optionally include raw transcript
    if (options?.includeRawTranscript !== false) {
      result.rawTranscript = rawTranscript;
    }

    return result;

  } catch (error) {
    console.error("Advanced audio processing error:", error);
    
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
      error: "Failed to process audio. Please try again."
    };
  }
}

// Helper function for style-specific processing
async function processTranscriptWithStyle(
  transcript: string, 
  style: "professional" | "casual" | "meeting" | "idea" | "task" | undefined = "professional"
): Promise<{ summary: string; tags: string[]; keyPoints: KeyPoint[]; tasks: Task[] }> {
  const stylePrompts = {
    professional: "Focus on key business insights, decisions, and actionable items. Use professional language and structure.",
    casual: "Summarize in a friendly, conversational tone. Highlight main points and interesting ideas.",
    meeting: "Extract meeting outcomes, decisions made, action items, and next steps. Include participant insights if mentioned.",
    idea: "Focus on creative concepts, innovative thoughts, and potential opportunities. Highlight the core idea and its implications.",
    task: "Identify specific tasks, deadlines, priorities, and requirements. Structure as actionable items."
  };

  const styleTagSets = {
    professional: ["business", "professional", "decision", "strategy", "analysis"],
    casual: ["conversation", "idea", "casual", "discussion", "thoughts"],
    meeting: ["meeting", "action-item", "decision", "team", "discussion", "follow-up"],
    idea: ["idea", "creative", "innovation", "concept", "brainstorm", "opportunity"],
    task: ["task", "todo", "deadline", "priority", "action", "assignment"]
  };

  const prompt = `Analyze the following voice recording transcript with a ${style} focus.

${stylePrompts[style]}

Transcript:
"${transcript}"

Please respond in the following JSON format:
{
  "summary": "Your ${style} summary here (2-3 sentences)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  "keyPoints": [
    {
      "point": "Key insight or information",
      "importance": "high|medium|low",
      "category": "decision|insight|fact|idea"
    }
  ],
  "tasks": [
    {
      "title": "Task title",
      "description": "Optional detailed description",
      "priority": "high|medium|low", 
      "deadline": "YYYY-MM-DD if mentioned or null",
      "category": "work|personal|meeting|follow-up|research|other",
      "completed": false
    }
  ]
}

Include relevant tags from this suggested set but feel free to add others: ${styleTagSets[style].join(", ")}
Extract 3-7 key points and only include explicitly mentioned tasks.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional assistant specializing in ${style} content analysis. Always respond with valid JSON in the exact format requested.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: style === "idea" ? 0.7 : 0.3, // More creativity for idea processing
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    
    return {
      summary: parsed.summary || "Unable to generate summary",
      tags: Array.isArray(parsed.tags) ? parsed.tags : styleTagSets[style],
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : []
    };

  } catch (error) {
    console.error("Error processing transcript with style:", error);
    
    // Fallback with style-specific defaults
    const words = transcript.split(" ");
    const summary = words.length > 50 
      ? words.slice(0, 50).join(" ") + "..."
      : transcript;
    
    return {
      summary: summary || "Voice recording captured",
      tags: styleTagSets[style] || ["voice-note", "unprocessed"],
      keyPoints: [],
      tasks: []
    };
  }
}

// Alternative function with more configuration options - kept for backward compatibility
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
