// Test AI functionality - CONVERTED TO GEMINI API
// Run this file to test Gemini integration

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAI() {
    try {
        console.log('🚀 Testing Gemini API...');
        
        // Check if API key exists
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            console.log('❌ API key missing! Please add GEMINI_API_KEY to .env file');
            return;
        }
        
        console.log('🔑 API Key found, length:', process.env.GEMINI_API_KEY.length);
        
        // Initialize Gemini with API key
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // Try the working model names from API
        const modelsToTry = [
            'gemini-2.5-flash',
            'gemini-pro-latest', 
            'gemini-flash-latest',
            'gemini-2.0-flash',
            'gemini-2.5-pro'
        ];
        
        for (const modelName of modelsToTry) {
            try {
                console.log(`\n🧪 Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
                
                const prompt = "Say hello in a friendly way.";
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                console.log(`✅ SUCCESS with ${modelName}!`);
                console.log('📝 Response:', text);
                console.log('\n🎯 Use this model in your app!');
                return modelName; // Return successful model name
                
            } catch (error) {
                console.log(`❌ ${modelName} failed:`, error.message.split('\n')[0]);
            }
        }
        
        console.log('\n❌ All models failed. Check your API key validity.');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check if your API key is correct');
        console.log('2. Make sure you have enabled the Gemini API');
        console.log('3. Check if you have billing enabled');
        console.log('4. Visit: https://makersuite.google.com/app/apikey');
    }
}

// Run test
console.log('🧪 Starting Gemini AI Test...');
testAI();
