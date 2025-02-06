import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera as CameraIcon, Loader2 } from 'lucide-react';
import { analyzeImage } from '../lib/gemini';
import { Solution } from './Solution';

const WEBCAM_CONFIG = {
  width: 1920,
  height: 1080,
  facingMode: 'environment',
  screenshotQuality: 0.92,
  aspectRatio: 16 / 9,
};

export function Camera() {
  const webcamRef = useRef<Webcam>(null);
  const [solution, setSolution] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [preference, setPreference] = useState<string>(''); // State for user preference
  const [showPreference, setShowPreference] = useState(false); // State to control showing preference input

  const capture = useCallback(async () => {
    setError('');
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      setError('Failed to capture image. Please try again.');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Use preference when calling analyzeImage
      const result = await analyzeImage(imageSrc, preference);
      setSolution(result);
      setShowPreference(true); // Show preference input after getting the solution
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [webcamRef, preference]); // Dependency on preference

  const handleApplyPreference = () => {
    // Whenever the user applies preference, re-analyze the image
    if (preference) {
      capture();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      {/* Webcam Feed */}
      <div className="relative w-full h-[70vh] bg-gray-900">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="absolute top-0 left-0 w-full h-full object-cover"
          videoConstraints={WEBCAM_CONFIG}
        />
      </div>

      {/* Capture & Analyze Button */}
      <button
        onClick={capture}
        disabled={isAnalyzing}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <CameraIcon className="w-5 h-5" />
            Capture & Analyze
          </>
        )}
      </button>

      {/* Solution Display */}
      {solution && !error && (
        <Solution
          solution={solution}
          isSpeaking={isSpeaking}
          onToggleSpeech={setIsSpeaking}
          onUpdatePreference={function (preference: string): void {
            throw new Error('Function not implemented.');
          }}
        />
      )}

      {/* Error Message */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Preference Input */}
      {showPreference && !error && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Enter preference (short/crisp/detailed)"
            value={preference}
            onChange={(e) => setPreference(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleApplyPreference}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            disabled={!preference}
          >
            Apply Preference
          </button>
        </div>
      )}
    </div>
  );
}
