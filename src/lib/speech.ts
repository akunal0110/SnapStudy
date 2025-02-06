let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, onEnd: () => void, preference: string) {
  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;

  // Set language to Hindi if the text is in Hindi
  if (isHindi(text)) {
    utterance.lang = 'hi-IN'; // Hindi language code
  } else {
    utterance.lang = 'en-US'; // English language code
  }

  utterance.onend = () => {
    currentUtterance = null;
    onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

// Helper function to check if the text is in Hindi
function isHindi(text: string): boolean {
  const hindiRegex = /[\u0900-\u097F]/; // Range for Devanagari script (Hindi)
  return hindiRegex.test(text);
}
