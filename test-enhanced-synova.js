// test-enhanced-synova.js
import SynovaBrainLLM from './synova-brain-llm-wrapper.js';

const synova = new SynovaBrainLLM('http://localhost:3000');

async function testAllFeatures() {
  console.log('🧪 Testing Enhanced Synova Brain Features...');
  
  // Test 1: Basic Chat
  console.log('1️⃣ Testing Basic Chat...');
  try {
    const basicResponse = await synova.chat({
      messages: [{ role: 'user', content: 'Design modern office' }]
    });
    console.log('✅ Basic Chat:', basicResponse.choices[0].message.content);
  } catch (error) {
    console.log('❌ Basic Chat failed:', error.message);
  }
  
  // Test 2: Streaming
  console.log('2️⃣ Testing Streaming...');
  try {
    let streamingChunks = 0;
    const streamResponse = await synova.streamChat({
      messages: [{ role: 'user', content: 'Create luxury mansion' }],
      onChunk: (chunk) => {
        streamingChunks++;
        console.log(`📡 Chunk ${streamingChunks}:`, chunk);
      }
    });
    console.log('✅ Streaming Complete:', streamResponse.choices[0].message.content);
  } catch (error) {
    console.log('❌ Streaming failed:', error.message);
  }
  
  // Test 3: Function Calling
  console.log('3️⃣ Testing Function Calling...');
  try {
    const functionResult = await synova.functionCall('Build warehouse');
    console.log('✅ Function Call:', functionResult);
  } catch (error) {
    console.log('❌ Function Call failed:', error.message);
  }
  
  // Test 4: Multimodal
  console.log('4️⃣ Testing Multimodal...');
  try {
    const multimodalResult = await synova.multimodal(
      'Analyze building design',
      ['test.jpg']
    );
    console.log('✅ Multimodal:', multimodalResult);
  } catch (error) {
    console.log('❌ Multimodal failed:', error.message);
  }
  
  // Test 5: Code Generation
  console.log('5️⃣ Testing Code Generation...');
  try {
    const codeResult = await synova.generateCode(
      'Create React component',
      'react'
    );
    console.log('✅ Code Generation:', codeResult);
  } catch (error) {
    console.log('❌ Code Generation failed:', error.message);
  }
  
  // Test 6: Advanced Reasoning
  console.log('6️⃣ Testing Advanced Reasoning...');
  try {
    const reasoningResult = await synova.reasoning(
      'Compare architectural styles',
      { preference: 'modern' }
    );
    console.log('✅ Advanced Reasoning:', reasoningResult);
  } catch (error) {
    console.log('❌ Advanced Reasoning failed:', error.message);
  }
  
  // Test 7: Memory
  console.log('7️⃣ Testing Memory...');
  try {
    const memoryResult = await synova.memory([
      { role: 'user', content: 'I like modern design' }
    ]);
    console.log('✅ Memory:', memoryResult);
  } catch (error) {
    console.log('❌ Memory failed:', error.message);
  }
  
  console.log('🎉 All Enhanced Features Tested!');
}

testAllFeatures();
