"use client";

import { useState, useRef, useEffect } from "react";
import { processAudio, ProcessedAudioResult, Task, KeyPoint } from "@/app/actions/transcribe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/app/components/header";

interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioUrl: string | null;
}

export default function TranscribePage() {
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Recording state
  const [recorder, setRecorder] = useState<{
    isRecording: boolean;
    isPaused: boolean;
    recordingTime: number;
    audioBlob: Blob | null;
    audioUrl: string | null;
  }>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioBlob: null,
    audioUrl: null,
  });

  // Transcription state
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [processedResult, setProcessedResult] = useState<ProcessedAudioResult | null>(null);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<"upload" | "record">("upload");

  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (recorder.audioUrl) {
        URL.revokeObjectURL(recorder.audioUrl);
      }
    };
  }, [recorder.audioUrl]);

  // File upload handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProcessedResult(null);
      // Clear recording if switching to upload
      if (recorder.audioBlob) {
        setRecorder(prev => ({
          ...prev,
          audioBlob: null,
          audioUrl: prev.audioUrl ? (URL.revokeObjectURL(prev.audioUrl), null) : null,
        }));
      }
    }
  };

  // Recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setRecorder(prev => ({
          ...prev,
          audioBlob,
          audioUrl,
          isRecording: false,
          isPaused: false,
        }));

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      
      setRecorder(prev => ({
        ...prev,
        isRecording: true,
        recordingTime: 0,
      }));

      // Clear selected file if switching to recording
      setSelectedFile(null);
      setProcessedResult(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecorder(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);

    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recorder.isRecording) {
      mediaRecorderRef.current.pause();
      setRecorder(prev => ({ ...prev, isPaused: true }));
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recorder.isPaused) {
      mediaRecorderRef.current.resume();
      setRecorder(prev => ({ ...prev, isPaused: false }));
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecorder(prev => ({
          ...prev,
          recordingTime: prev.recordingTime + 1,
        }));
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const clearRecording = () => {
    if (recorder.audioUrl) {
      URL.revokeObjectURL(recorder.audioUrl);
    }
    setRecorder({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      audioBlob: null,
      audioUrl: null,
    });
  };

  // Transcription handler
  const handleTranscribe = async () => {
    let audioFile: File | null = null;

    if (activeTab === "upload" && selectedFile) {
      audioFile = selectedFile;
    } else if (activeTab === "record" && recorder.audioBlob) {
      // Convert blob to file
      audioFile = new File([recorder.audioBlob], `recording_${Date.now()}.webm`, {
        type: recorder.audioBlob.type,
      });
    }

    if (!audioFile) return;

    setIsTranscribing(true);
    setProcessedResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioFile);

      const result = await processAudio(formData);
      setProcessedResult(result);
    } catch (error) {
      console.error("Processing error:", error);
      setProcessedResult({
        success: false,
        error: "An unexpected error occurred during processing"
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  // Utility functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const canTranscribe = (activeTab === "upload" && selectedFile) || 
                       (activeTab === "record" && recorder.audioBlob && !recorder.isRecording);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Audio Analysis
          </h1>
          <p className="text-gray-600">
            Upload an audio file or record directly to get AI-powered summaries, key points, and actionable task lists
          </p>
        </div>

        <Card className="p-8">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "upload"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setActiveTab("record")}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === "record"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Record Audio
              </button>
            </div>
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <div>
                <label htmlFor="audio-upload" className="block text-sm font-medium mb-3">
                  Choose Audio File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="audio-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="text-lg font-medium text-gray-700">
                      Click to upload audio file
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      MP3, WAV, M4A, WEBM, OGG, FLAC (Max 25MB)
                    </span>
                  </label>
                </div>
              </div>

              {selectedFile && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 mb-2">Selected File</h4>
                      <div className="space-y-1 text-sm text-blue-700">
                        <p><strong>Name:</strong> {selectedFile.name}</p>
                        <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                        <p><strong>Type:</strong> {selectedFile.type}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Ready
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Record Tab */}
          {activeTab === "record" && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gray-100 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-6">
                  {recorder.isRecording ? (
                    <div className="w-12 h-12 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-sm"></div>
                    </div>
                  ) : (
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  )}
                </div>

                {recorder.isRecording && (
                  <div className="mb-4">
                    <div className="text-2xl font-mono font-bold text-red-600 mb-2">
                      {formatTime(recorder.recordingTime)}
                    </div>
                    <Badge variant="destructive" className="animate-pulse">
                      {recorder.isPaused ? "PAUSED" : "RECORDING"}
                    </Badge>
                  </div>
                )}

                <div className="flex justify-center space-x-4">
                  {!recorder.isRecording && !recorder.audioBlob && (
                    <Button onClick={startRecording} size="lg" className="bg-red-500 hover:bg-red-600">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                      Start Recording
                    </Button>
                  )}

                  {recorder.isRecording && !recorder.isPaused && (
                    <>
                      <Button onClick={pauseRecording} variant="outline" size="lg">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="4" width="4" height="16"/>
                          <rect x="14" y="4" width="4" height="16"/>
                        </svg>
                        Pause
                      </Button>
                      <Button onClick={stopRecording} variant="destructive" size="lg">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12"/>
                        </svg>
                        Stop
                      </Button>
                    </>
                  )}

                  {recorder.isPaused && (
                    <>
                      <Button onClick={resumeRecording} size="lg" className="bg-green-500 hover:bg-green-600">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <polygon points="5,3 19,12 5,21"/>
                        </svg>
                        Resume
                      </Button>
                      <Button onClick={stopRecording} variant="destructive" size="lg">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12"/>
                        </svg>
                        Stop
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {recorder.audioBlob && recorder.audioUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-green-900">Recording Complete</h4>
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {formatTime(recorder.recordingTime)}
                      </Badge>
                      <Button
                        onClick={clearRecording}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <audio
                    controls
                    src={recorder.audioUrl}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Transcribe Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={handleTranscribe}
              disabled={!canTranscribe || isTranscribing}
              size="lg"
              className="min-w-48"
            >
              {isTranscribing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing Audio...
                </>
              ) : (
                "Process Audio"
              )}
            </Button>
          </div>

          {/* Results */}
          {processedResult && (
            <div className="mt-8">
              {processedResult.success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-800">
                      Audio Processing Complete
                    </h3>
                    <Badge className="bg-green-100 text-green-800">
                      Success
                    </Badge>
                  </div>

                  {/* Summary Section */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-green-900 mb-2">Summary</h4>
                    <div className="bg-white border border-green-200 rounded-md p-4">
                      <p className="text-gray-800 leading-relaxed">
                        {processedResult.summary}
                      </p>
                    </div>
                  </div>

                  {/* Tags Section */}
                  {processedResult.tags && processedResult.tags.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-green-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {processedResult.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Points Section */}
                  {processedResult.keyPoints && processedResult.keyPoints.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-green-900 mb-2">Key Points</h4>
                      <div className="bg-white border border-green-200 rounded-md p-4">
                        <div className="space-y-3">
                          {processedResult.keyPoints.map((keyPoint, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  keyPoint.importance === 'high' ? 'bg-red-500' :
                                  keyPoint.importance === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`}></div>
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-800 text-sm">{keyPoint.point}</p>
                                <div className="flex items-center mt-1 space-x-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      keyPoint.importance === 'high' ? 'border-red-200 text-red-700' :
                                      keyPoint.importance === 'medium' ? 'border-yellow-200 text-yellow-700' :
                                      'border-green-200 text-green-700'
                                    }`}
                                  >
                                    {keyPoint.importance}
                                  </Badge>
                                  {keyPoint.category && (
                                    <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                                      {keyPoint.category}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tasks Section */}
                  {processedResult.tasks && processedResult.tasks.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-green-900 mb-2">Tasks & Action Items</h4>
                      <div className="bg-white border border-green-200 rounded-md p-4">
                        <div className="space-y-3">
                          {processedResult.tasks.map((task, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md">
                              <div className="flex-shrink-0 mt-1">
                                <input
                                  type="checkbox" 
                                  checked={task.completed}
                                  onChange={(e) => {
                                    // Update task completion status
                                    const updatedTasks = [...(processedResult.tasks || [])];
                                    updatedTasks[index] = { ...task, completed: e.target.checked };
                                    setProcessedResult(prev => prev ? {
                                      ...prev,
                                      tasks: updatedTasks
                                    } : null);
                                  }}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                                />
                              </div>
                              <div className="flex-1">
                                <h5 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                  {task.title}
                                </h5>
                                {task.description && (
                                  <p className={`text-xs mt-1 ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center mt-2 space-x-2">
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      task.priority === 'high' ? 'border-red-200 text-red-700 bg-red-50' :
                                      task.priority === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                                      'border-green-200 text-green-700 bg-green-50'
                                    }`}
                                  >
                                    {task.priority} priority
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                                    {task.category}
                                  </Badge>
                                  {task.deadline && (
                                    <Badge variant="outline" className="text-xs border-purple-200 text-purple-700 bg-purple-50">
                                      Due: {new Date(task.deadline).toLocaleDateString()}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* Tasks Summary */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>
                              {processedResult.tasks.filter(t => t.completed).length} of {processedResult.tasks.length} completed
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => {
                                  const taskText = processedResult.tasks?.map(task => 
                                    `${task.completed ? '✅' : '☐'} ${task.title}${task.description ? ` - ${task.description}` : ''} (${task.priority} priority)`
                                  ).join('\n');
                                  navigator.clipboard.writeText(taskText || '');
                                }}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                Copy Tasks
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Metadata Section */}
                  {processedResult.metadata && (
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-green-900 mb-2">File Information</h4>
                      <div className="bg-white border border-green-200 rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">File:</span>
                            <span className="ml-2 text-gray-600">{processedResult.metadata.fileName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Size:</span>
                            <span className="ml-2 text-gray-600">{formatFileSize(processedResult.metadata.fileSize)}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Processed:</span>
                            <span className="ml-2 text-gray-600">{new Date(processedResult.metadata.processedAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => navigator.clipboard.writeText(processedResult.summary || "")}
                      variant="outline"
                      size="sm"
                    >
                      Copy Summary
                    </Button>
                    
                    {processedResult.keyPoints && processedResult.keyPoints.length > 0 && (
                      <Button
                        onClick={() => {
                          const keyPointsText = processedResult.keyPoints?.map(kp => 
                            `• ${kp.point} (${kp.importance}${kp.category ? `, ${kp.category}` : ''})`
                          ).join('\n');
                          navigator.clipboard.writeText(keyPointsText || '');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Copy Key Points
                      </Button>
                    )}

                    {processedResult.tasks && processedResult.tasks.length > 0 && (
                      <Button
                        onClick={() => {
                          const tasksText = processedResult.tasks?.map(task => 
                            `${task.completed ? '✅' : '☐'} ${task.title}${task.description ? ` - ${task.description}` : ''} (${task.priority} priority${task.deadline ? `, due: ${task.deadline}` : ''})`
                          ).join('\n');
                          navigator.clipboard.writeText(tasksText || '');
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Copy Tasks
                      </Button>
                    )}
                    {processedResult.rawTranscript && (
                      <Button
                        onClick={() => {
                          const modal = document.createElement('div');
                          modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
                          modal.innerHTML = `
                            <div class="bg-white rounded-lg max-w-4xl max-h-96 overflow-auto p-6">
                              <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold">Raw Transcript</h3>
                                <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                  </svg>
                                </button>
                              </div>
                              <div class="bg-gray-50 rounded p-4 text-sm">
                                <pre class="whitespace-pre-wrap">${processedResult.rawTranscript}</pre>
                              </div>
                              <div class="mt-4 flex gap-2">
                                <button onclick="navigator.clipboard.writeText('${processedResult.rawTranscript?.replace(/'/g, "\\'")}'); this.textContent='Copied!'; setTimeout(() => this.textContent='Copy Raw Transcript', 2000)" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                  Copy Raw Transcript
                                </button>
                                <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                                  Close
                                </button>
                              </div>
                            </div>
                          `;
                          document.body.appendChild(modal);
                        }}
                        variant="outline"
                        size="sm"
                      >
                        View Raw Transcript
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        const exportData = {
                          summary: processedResult.summary,
                          tags: processedResult.tags,
                          keyPoints: processedResult.keyPoints,
                          tasks: processedResult.tasks,
                          metadata: processedResult.metadata,
                          rawTranscript: processedResult.rawTranscript
                        };
                        navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Export JSON
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-red-800">
                      Processing Error
                    </h3>
                    <Badge variant="destructive">
                      Error
                    </Badge>
                  </div>
                  <p className="text-red-700">{processedResult.error}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
      </div>
    </>
  );
}