const fetch = require('node-fetch');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;

console.log('API Key:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 5));
console.log('\n🔍 Checking what models your API key can access...\n');

async function listAvailableModels() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    console.log('Fetching from:', url.replace(apiKey, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    
    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('\n❌ ERROR Response:');
      console.log(errorText);
      
      if (response.status === 403) {
        console.log('\n🔧 DIAGNOSIS:');
        console.log('→ Generative Language API is NOT ENABLED for your project');
        console.log('→ Solution: Enable it at: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
      }
      
      return;
    }
    
    const data = await response.json();
    
    if (!data.models || data.models.length === 0) {
      console.log('\n❌ No models available.');
      console.log('→ API is enabled but no models are accessible');
      console.log('→ Wait 2-3 minutes and try again');
      return;
    }
    
    console.log(`\n✅ SUCCESS! Found ${data.models.length} available models:\n`);
    
    data.models.forEach((model, index) => {
      const modelName = model.name.replace('models/', '');
      console.log(`${index + 1}. ${modelName}`);
      console.log(`   Display Name: ${model.displayName || 'N/A'}`);
      console.log(`   Supports generateContent: ${model.supportedGenerationMethods?.includes('generateContent') ? '✅ YES' : '❌ NO'}`);
      console.log();
    });
    
    // Find first model that supports generateContent
    const workingModel = data.models.find(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );
    
    if (workingModel) {
      const modelName = workingModel.name.replace('models/', '');
      console.log(`\n🎯 RECOMMENDED MODEL: ${modelName}`);
      console.log(`\nUpdate your .env:\nAI_MODEL=${modelName}`);
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('→ Network issue. Check your internet connection.');
    }
  }
}

listAvailableModels();
