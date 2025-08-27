const express = require('express');
const router = express.Router();
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const { isLoggedin } = require("../utils/middleware.js");
const entries = require("../models/schema.js");
const MockTTSService = require("../utils/mockTTS.js");

// Initialize the TTS client only when needed
let client = null;
let useMockService = true; // Default to mock service

function initializeTTSClient() {
    try {
        if (useMockService) {
            console.log('Using mock TTS service for development');
            if (!client) {
                client = new MockTTSService();
            }
            return client;
        } else {
            if (!client) {
                client = new textToSpeech.TextToSpeechClient();
            }
            return client;
        }
    } catch (error) {
        console.error('Failed to initialize TTS client:', error.message);
        console.log('Falling back to mock TTS service for development');
        useMockService = true;
        client = new MockTTSService();
        return client;
    }
}

// Create audio directory if it doesn't exist
const audioDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
}

// Route to generate TTS for a specific entry
router.post('/generate/:id', isLoggedin, async (req, res) => {
    console.log('TTS Route Hit - Entry ID:', req.params.id);
    console.log('User authenticated:', !!req.user);
    console.log('User ID:', req.user ? req.user._id : 'None');
    
    try {
        const { id } = req.params;
        
        console.log('Searching for entry with ID:', id);
        
        // Find the entry and verify ownership
        const entry = await entries.findById(id);
        
        console.log('Entry found:', !!entry);
        
        if (!entry) {
            console.log('Entry not found in database');
            return res.status(404).json({ error: 'Entry not found' });
        }
        
        console.log('Entry owner:', entry.owner);
        console.log('Current user:', req.user._id);
        
        if (entry.owner.toString() !== req.user._id.toString()) {
            console.log('Unauthorized - user does not own this entry');
            return res.status(403).json({ error: 'Unauthorized' });
        }

        console.log('Authorization passed - generating TTS');

        // Initialize TTS client
        const ttsClient = initializeTTSClient();

        // Create filmy Hindi introduction and conclusion
        const filmyIntro = "Kya kahani hai yaar... aaj ki diary mein... ";
        const filmyOutro = " ...bas yahi thi aaj ki dil ki baat. Kya emotional journey raha hai na bhai!";
        
        // Combine content with filmy narration
        const fullText = filmyIntro + entry.content + filmyOutro;
        
        console.log('Full text length:', fullText.length);
        
        let response;
        
        if (useMockService) {
            // Use mock service for development
            console.log('Using browser TTS service for development');
            const request = { input: { text: fullText } };
            [response] = await ttsClient.synthesizeSpeech(request);
            
            // Check if this is browser TTS
            if (response.browserTTSData) {
                console.log('Browser TTS data generated');
                res.json({ 
                    success: true, 
                    useBrowserTTS: true,
                    text: response.browserTTSData.text,
                    voice: response.browserTTSData.voice,
                    message: 'Browser TTS ready! Listen to the Hindi voiceover 🎤' 
                });
                return;
            }
        } else {
            // Configure the TTS request for Hindi/Hinglish with dramatic voice
            const request = {
                input: { text: fullText },
                voice: {
                    languageCode: 'hi-IN', // Hindi language
                    name: 'hi-IN-Standard-C', // Female voice with dramatic tone
                    ssmlGender: 'FEMALE',
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: 0.9, // Slightly slower for dramatic effect
                    pitch: 0.0,
                    volumeGainDb: 2.0, // Boost volume for dramatic effect
                },
            };

            // Generate speech
            [response] = await ttsClient.synthesizeSpeech(request);
        }
        
        // Save audio file
        const audioFileName = `entry_${id}_${Date.now()}.mp3`;
        const audioFilePath = path.join(audioDir, audioFileName);
        
        console.log('Saving audio file to:', audioFilePath);
        
        fs.writeFileSync(audioFilePath, response.audioContent, 'binary');
        
        console.log('Audio file saved successfully');
        
        // Update entry with audio file path
        entry.audioFile = `/audio/${audioFileName}`;
        await entry.save();
        
        console.log('Entry updated with audio file path');
        
        res.json({ 
            success: true, 
            audioUrl: `/audio/${audioFileName}`,
            message: useMockService ? 
                'Mock voiceover created for development!' : 
                'Filmy voiceover ready hai bhai!' 
        });
        
        console.log('TTS response sent successfully');
        
    } catch (error) {
        console.error('TTS Error:', error);
        console.error('Error stack:', error.stack);
        
        // Check if it's a credentials error
        if (error.message.includes('credentials') || error.message.includes('authentication')) {
            res.status(503).json({ 
                error: 'TTS service temporarily unavailable', 
                details: 'Google Cloud authentication not configured. Using mock service for development.' 
            });
        } else {
            res.status(500).json({ 
                error: 'TTS generation failed yaar', 
                details: error.message 
            });
        }
    }
});

// Route to get audio for an entry
router.get('/audio/:id', isLoggedin, async (req, res) => {
    try {
        const { id } = req.params;
        const entry = await entries.findById(id);
        
        if (!entry || entry.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({ error: 'Entry not found' });
        }
        
        if (entry.audioFile) {
            res.json({ audioUrl: entry.audioFile });
        } else {
            res.json({ audioUrl: null });
        }
        
    } catch (error) {
        console.error('Audio fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch audio' });
    }
});

module.exports = router;
