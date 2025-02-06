import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speak, stopSpeaking } from '../lib/speech';

interface SolutionProps {
  solution: string;
  onToggleSpeech: (speaking: boolean) => void;
  isSpeaking: boolean;
  onUpdatePreference: (preference: string) => void;
}

export function Solution({ solution, onToggleSpeech, isSpeaking, onUpdatePreference }: SolutionProps) {
  const [preference, setPreference] = useState("");
  const [appliedPreference, setAppliedPreference] = useState("");  
  const [showPreferenceInput, setShowPreferenceInput] = useState(true);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      onToggleSpeech(false);
    } else {
      // Pass the preferred language to the speak function
      speak(solution, () => onToggleSpeech(false), preference);
      onToggleSpeech(true);
    }
  };

  const handleApplyPreference = () => {
    onUpdatePreference(preference);
    setAppliedPreference(preference);  
    setShowPreferenceInput(false);
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Solution:</h2>
        <button
          onClick={handleToggleSpeech}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          aria-label={isSpeaking ? "Stop speaking" : "Start speaking"}
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Solution Display */}
      <div className="prose dark:prose-invert max-w-none">
        {solution.split('\n').map((line, i) => (
          <p key={i} className="mb-2 dark:text-gray-300">{line}</p>
        ))}
      </div>

      

      {/* Applied Preference Display */}
      {appliedPreference && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <p className="text-sm dark:text-white">Applied Preference: {appliedPreference}</p>
        </div>
      )}
    </div>
  );
}
