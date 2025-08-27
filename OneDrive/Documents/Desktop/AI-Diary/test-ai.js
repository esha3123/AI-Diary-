// Test AI functionality - CONVERTED TO GEMINI API
// Run this file to test Gemini integration

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function testAI() {
    try {
        console.log('🚀 Testing Gemini API...');
        
        // Check if API key exists
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            console.log('❌ API key missing! Please add GEMINI_API_KEY to .env file');
            return;
        }
        
        const prompt = `You are a desi AI friend who speaks Hinglish. Respond with 'yaar' and be supportive. 
        User says: "Test kar raha hun API, kya haal hai?"
        Give a short, friendly response in Hinglish.`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Success! AI Response:');
        console.log(text);
        console.log('\n🎯 API Status: Working perfectly!');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.message?.includes('API_KEY_INVALID')) {
            console.log('🔑 Invalid API key - check your Gemini credentials');
        } else if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
            console.log('⏰ Rate limit exceeded - wait and try again');
        } else if (error.message?.includes('QUOTA_EXCEEDED')) {
            console.log('💳 Quota exhausted - check Gemini billing');
        } else {
            console.log('🔧 General error - check network and API key');
        }
    }
}

// Run test
console.log('🧪 Starting Gemini AI Test...');
testAI();
