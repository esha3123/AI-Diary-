const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Multiple model fallbacks in case one is overloaded
const getAvailableModel = async () => {
    const modelOptions = [
        'gemini-2.5-flash',
        'gemini-pro-latest',
        'gemini-flash-latest',
        'gemini-2.0-flash'
    ];
    
    for (const modelName of modelOptions) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            // Test with a simple prompt
            await model.generateContent("test");
            console.log(`✅ Using model: ${modelName}`);
            return model;
        } catch (error) {
            console.log(`❌ Model ${modelName} unavailable:`, error.message.split('\n')[0]);
            continue;
        }
    }
    
    // If all models fail, return the default and let it fail gracefully
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
};

// Generate AI insights for diary entry
router.post('/generate', async (req, res) => {
    try {
        const { diaryContent, insightType = 'general' } = req.body;
        
        // Validate input
        if (!diaryContent || diaryContent.trim().length === 0) {
            return res.json({ 
                success: false, 
                error: 'Please provide diary content to analyze!' 
            });
        }

        // Check if API key exists and is valid
        if (!process.env.GEMINI_API_KEY || 
            process.env.GEMINI_API_KEY === 'your_gemini_api_key_here' || 
            process.env.GEMINI_API_KEY === 'paste_your_actual_gemini_api_key_here' ||
            process.env.GEMINI_API_KEY.length < 30) {
            return res.json({ 
                success: false, 
                error: 'Gemini API key not configured. Please check your .env file!' 
            });
        }

        // Different types of insights based on request
        let systemPrompt = '';
        let userPrompt = '';

        switch (insightType) {
            case 'mood':
                systemPrompt = `You are a empathetic AI friend who analyzes emotions in Hinglish. 
                Use words like "yaar", "bhai", "dil se" naturally. Be supportive and understanding. 
                Focus on mood analysis and emotional support. Keep response under 150 words.`;
                userPrompt = `Iss diary entry ka mood analyze kar aur emotional support de yaar: "${diaryContent}"`;
                break;
            
            case 'growth':
                systemPrompt = `You are a personal development coach who speaks Hinglish naturally. 
                Use motivational Bollywood references and desi wisdom. Focus on growth opportunities. 
                Use words like "champion", "hero", "zindagi". Keep response under 150 words.`;
                userPrompt = `Iss diary entry mein growth opportunities aur positive patterns batao: "${diaryContent}"`;
                break;
            
            case 'reflection':
                systemPrompt = `You are a thoughtful companion who asks meaningful questions in Hinglish. 
                Use philosophical yet simple language. Mix Hindi and English naturally. 
                Provide perspective and reflection questions. Keep response under 150 words.`;
                userPrompt = `Iss diary entry pe deep reflection aur meaningful questions de: "${diaryContent}"`;
                break;
            
            default: // general insights
                systemPrompt = `You are a desi AI friend who gives insights in Hinglish (Hindi + English mix). 
                Be supportive, understanding, and use popular Bollywood/filmy references when appropriate. 
                Use words like "yaar", "bhai", "dil se", "tension mat le", "sab theek hoga" naturally. 
                Keep it casual and friendly like talking to a best friend. Write in Roman script (English letters) 
                but use Hindi words mixed in naturally. Keep response under 150 words and be encouraging.`;
                userPrompt = `Iss diary entry ke baare mein kuch achha insights do yaar, filmy style mein: "${diaryContent}"`;
        }

        // Call Gemini API with fallback model support
        const prompt = `${systemPrompt}\n\n${userPrompt}`;
        
        let insights;
        let modelUsed;
        
        try {
            // Try with the default model first
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            insights = response.text();
            modelUsed = "gemini-2.5-flash";
        } catch (primaryError) {
            console.log('Primary model failed, trying fallbacks...');
            
            // If primary model fails, try fallbacks
            const fallbackModels = ['gemini-pro-latest', 'gemini-flash-latest', 'gemini-2.0-flash'];
            
            for (const modelName of fallbackModels) {
                try {
                    const fallbackModel = genAI.getGenerativeModel({ model: modelName });
                    const result = await fallbackModel.generateContent(prompt);
                    const response = await result.response;
                    insights = response.text();
                    modelUsed = modelName;
                    console.log(`✅ Success with fallback model: ${modelName}`);
                    break;
                } catch (fallbackError) {
                    console.log(`❌ Fallback model ${modelName} failed:`, fallbackError.message.split('\n')[0]);
                    continue;
                }
            }
            
            // If all models fail, throw the original error
            if (!insights) {
                throw primaryError;
            }
        }
        
        // Log usage for monitoring
        console.log(`AI Insight generated - Model: ${modelUsed}, Type: ${insightType}, Characters: ~${diaryContent.length + insights.length}`);
        
        res.json({ 
            success: true, 
            insights: insights,
            type: insightType,
            model: modelUsed
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        
        // Handle different types of errors with user-friendly messages
        let errorMessage = 'Something went wrong. Please try again!';
        
        if (error.message?.includes('API_KEY_INVALID')) {
            errorMessage = 'Invalid API key. Please check your Gemini credentials!';
        } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
            errorMessage = 'Too many requests! Please wait a moment and try again.';
        } else if (error.message?.includes('QUOTA_EXCEEDED')) {
            errorMessage = 'API quota exhausted. Please check your Gemini billing!';
        } else if (error.message?.includes('overloaded') || error.status === 503) {
            errorMessage = 'AI service is busy right now. Please try again in a few seconds!';
        } else if (error.message?.includes('404') || error.message?.includes('not found')) {
            errorMessage = 'AI model temporarily unavailable. Please try again later!';
        } else if (error.message?.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again!';
        }
        
        res.json({ 
            success: false, 
            error: errorMessage,
            technical: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Test route to check if Gemini is working
router.get('/test', async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.json({ 
                status: 'error', 
                message: 'API key missing in .env file!' 
            });
        }

        // Test multiple models to see which ones work
        const modelOptions = [
            'gemini-2.5-flash',
            'gemini-pro-latest',
            'gemini-flash-latest',
            'gemini-2.0-flash'
        ];
        
        const results = {};
        
        for (const modelName of modelOptions) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Say 'Hello yaar!' in Hinglish");
                const response = await result.response;
                const text = response.text();
                
                results[modelName] = {
                    status: 'working',
                    response: text
                };
            } catch (error) {
                results[modelName] = {
                    status: 'failed',
                    error: error.message.split('\n')[0]
                };
            }
        }

        res.json({ 
            status: 'test_complete',
            message: 'Model availability check completed',
            models: results
        });
        
    } catch (error) {
        res.json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

module.exports = router;
