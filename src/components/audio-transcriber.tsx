"use client";

import { useState } from "react";
import { transcribeAudio, TranscriptionResult } from "@/app/actions/transcribe";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AudioTranscriber() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null); // Clear previous results
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const transcriptionResult = await transcribeAudio(formData);
      setResult(transcriptionResult);
    } catch (error) {
      setResult({
        success: false,
        error: "An unexpected error occurred"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Audio Transcription</h2>
        
        {/* File Upload */}
        <div className="mb-6">
          <label htmlFor="audio-upload" className="block text-sm font-medium mb-2">
            Choose Audio File
          </label>
          <input
            id="audio-upload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported formats: MP3, MP4, WAV, WEBM, M4A, OGG, FLAC (Max 25MB)
          </p>
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm">
              <strong>File:</strong> {selectedFile.name}
            </p>
            <p className="text-sm">
              <strong>Size:</strong> {formatFileSize(selectedFile.size)}
            </p>
            <p className="text-sm">
              <strong>Type:</strong> {selectedFile.type}
            </p>
          </div>
        )}

        {/* Transcribe Button */}
        <Button
          onClick={handleTranscribe}
          disabled={!selectedFile || isLoading}
          className="w-full mb-6"
        >
          {isLoading ? "Transcribing..." : "Transcribe Audio"}
        </Button>

        {/* Results */}
        {result && (
          <div className="mt-6">
            {result.success ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Transcription Result:</h3>
                <div className="bg-white p-3 rounded border">
                  <p className="whitespace-pre-wrap">{result.text}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing audio...
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
