const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI with API key from environment
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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

        // Check if API key exists
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-key-here') {
            return res.json({ 
                success: false, 
                error: 'OpenAI API key not configured. Please check your .env file!' 
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

        // Call OpenAI API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 200,
            temperature: 0.8, // Higher creativity for filmy responses
        });

        const insights = completion.choices[0].message.content;
        
        // Log usage for monitoring (optional)
        console.log(`AI Insight generated - Type: ${insightType}, Tokens used: ~${diaryContent.length + insights.length}`);
        
        res.json({ 
            success: true, 
            insights: insights,
            type: insightType 
        });

    } catch (error) {
        console.error('OpenAI API Error:', error);
        
        // Handle different types of errors
        if (error.status === 401) {
            res.json({ 
                success: false, 
                error: 'Invalid API key. Please check your OpenAI credentials!' 
            });
        } else if (error.status === 429) {
            res.json({ 
                success: false, 
                error: 'Rate limit exceeded. Please wait a moment and try again!' 
            });
        } else if (error.status === 403) {
            res.json({ 
                success: false, 
                error: 'Credits exhausted. Please check your OpenAI billing!' 
            });
        } else {
            res.json({ 
                success: false, 
                error: 'Something went wrong. Please try again!' 
            });
        }
    }
});

// Test route to check if OpenAI is working
router.get('/test', async (req, res) => {
    try {
        if (!process.env.OPENAI_API_KEY) {
            return res.json({ 
                status: 'error', 
                message: 'API key missing in .env file!' 
            });
        }

        // Simple test call
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Say 'Hello yaar!' in Hinglish" }],
            max_tokens: 20
        });

        res.json({ 
            status: 'success', 
            message: 'OpenAI working perfectly!',
            response: completion.choices[0].message.content 
        });
    } catch (error) {
        res.json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

module.exports = router;
