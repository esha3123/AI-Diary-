// Test AI functionality
// Run this file to test OpenAI integration

require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function testAI() {
    try {
        console.log('🚀 Testing OpenAI API...');
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a desi AI friend. Respond in Hinglish with 'yaar' and be supportive."
                },
                {
                    role: "user",
                    content: "Test kar raha hun API, kya haal hai?"
                }
            ],
            max_tokens: 100
        });

        console.log('✅ Success! AI Response:');
        console.log(completion.choices[0].message.content);
        console.log('\n💰 Tokens used:', completion.usage?.total_tokens || 'Unknown');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        if (error.status === 401) {
            console.log('🔑 API key problem - check .env file');
        } else if (error.status === 429) {
            console.log('⏰ Rate limit - wait and try again');
        } else if (error.status === 403) {
            console.log('💳 Billing issue - check OpenAI dashboard');
        }
    }
}

// Run test
testAI();
