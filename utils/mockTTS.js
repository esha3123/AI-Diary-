// Browser-based TTS service using Web Speech API
const fs = require('fs');
const path = require('path');

class MockTTSService {
    constructor() {
        this.audioDir = path.join(__dirname, '../public/audio');
        if (!fs.existsSync(this.audioDir)) {
            fs.mkdirSync(this.audioDir, { recursive: true });
        }
    }

    async synthesizeSpeech(request) {
        console.log('Browser TTS: Processing request...');
        console.log('Browser TTS: Text to speak:', request.input.text.substring(0, 100) + '...');
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Instead of creating an audio file, we'll return instructions for browser TTS
        const browserTTSData = {
            text: request.input.text,
            useBrowserTTS: true,
            voice: {
                lang: 'hi-IN', // Hindi language
                pitch: 0.8,
                rate: 0.9,
                volume: 1.0
            }
        };

        console.log('Browser TTS: Ready for browser speech synthesis');

        return [{
            audioContent: null, // No actual audio file needed
            browserTTSData: browserTTSData
        }];
    }

    isAvailable() {
        return true;
    }
}

module.exports = MockTTSService;
