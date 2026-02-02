const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

console.log('API Key loaded:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
console.log('\nTesting different model versions...\n');

const modelsToTest = [
  'gemini-pro',              // Older stable model
  'gemini-1.5-pro',          // Latest pro model
  'gemini-1.5-flash',        // Latest flash model
  'gemini-1.0-pro',          // Specific version
];

async function testModel(modelName) {
  try {
    console.log(`Testing model: ${modelName}...`);
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent('Say hello in 3 words');
    const response = result.response.text();
    
    console.log(`✅ SUCCESS with ${modelName}!`);
    console.log(`Response: ${response}\n`);
    return modelName;
  } catch (error) {
    console.log(`❌ FAILED with ${modelName}`);
    console.log(`Error: ${error.message}\n`);
    return null;
  }
}

async function findWorkingModel() {
  console.log('='.repeat(50) + '\n');
  
  for (const modelName of modelsToTest) {
    const result = await testModel(modelName);
    if (result) {
      console.log('='.repeat(50));
      console.log(`\n🎯 WORKING MODEL FOUND: ${result}`);
      console.log(`\nUpdate your .env file with:\nAI_MODEL=${result}\n`);
      return;
    }
  }
  
  console.log('='.repeat(50));
  console.log('\n❌ No working model found. Your API key might not have access to Gemini models yet.');
}

findWorkingModel();
