// Test Gemini API key loading
require('dotenv').config();

console.log('Testing environment variables:');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0);
console.log('GEMINI_API_KEY starts with:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 20) + '...' : 'N/A');
console.log('Is it the placeholder?', process.env.GEMINI_API_KEY === 'your_gemini_api_key_here');

// Test Gemini API
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.log('❌ No API key found');
            return;
        }

        console.log('🧪 Testing Gemini API...');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Hello, this is a simple test. Please respond with 'API working!'";
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        
        console.log('✅ Gemini API working! Response:', text);
        
    } catch (error) {
        console.log('❌ Gemini API error:', error.message);
    }
}

testGeminiAPI();
