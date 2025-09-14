#!/usr/bin/env tsx
import dotenv from 'dotenv';
import { tidb } from '../mastra/config/tidb';
import { embeddingService } from '../mastra/services/embeddingService';

dotenv.config();

async function testTiDBConnection() {
  console.log('🧪 Testing TiDB Connection...\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`- TIDB_HOST: ${process.env.TIDB_HOST ? '✅ Set' : '❌ Missing'}`);
  console.log(`- TIDB_USER: ${process.env.TIDB_USER ? '✅ Set' : '❌ Missing'}`);
  console.log(`- TIDB_PASSWORD: ${process.env.TIDB_PASSWORD ? '✅ Set' : '❌ Missing'}`);
  console.log(`- TIDB_DATABASE: ${process.env.TIDB_DATABASE ? '✅ Set' : '❌ Missing'}`);
  console.log(`- COHERE_API_KEY: ${process.env.COHERE_API_KEY ? '✅ Set' : '❌ Missing'}\n`);
  
  if (!process.env.TIDB_HOST || !process.env.TIDB_USER || !process.env.TIDB_PASSWORD) {
    console.log('❌ Missing TiDB credentials. Please update your .env file with:');
    console.log('TIDB_HOST=your_tidb_host');
    console.log('TIDB_USER=your_username');
    console.log('TIDB_PASSWORD=your_password');
    console.log('TIDB_DATABASE=your_database');
    return;
  }
  
  if (!process.env.COHERE_API_KEY) {
    console.log('❌ Missing Cohere API key. Please update your .env file with:');
    console.log('COHERE_API_KEY=your_cohere_api_key');
    return;
  }
  
  try {
    // Test TiDB connection
    console.log('🔌 Testing TiDB connection...');
    await tidb.connect();
    console.log('✅ TiDB connection successful!\n');
    
    // Test table initialization
    console.log('🏗️ Testing table initialization...');
    await tidb.initializeTables();
    console.log('✅ Tables initialized successfully!\n');
    
    // Test Cohere embeddings
    console.log('🧠 Testing Cohere embeddings...');
    const testText = "Patient presents with chest pain and shortness of breath";
    const embedding = await embeddingService.generateEmbedding(testText);
    console.log(`✅ Generated embedding with ${embedding.length} dimensions\n`);
    
    // Test inserting a sample case
    console.log('💾 Testing case insertion...');
    const sampleCase = {
      title: "Test Case - Chest Pain",
      description: "Test patient with chest pain symptoms",
      symptoms: "Chest pain, shortness of breath",
      diagnosis: "Test diagnosis",
      treatment: "Test treatment",
      outcome: "Test outcome",
      patient_age: 45,
      patient_gender: "male" as const,
      medical_history: "Test medical history",
      embedding: embedding
    };
    
    const caseId = await tidb.insertClinicalCase(sampleCase);
    console.log(`✅ Inserted test case with ID: ${caseId}\n`);
    
    // Test vector search
    console.log('🔍 Testing vector search...');
    const queryEmbedding = await embeddingService.generateQueryEmbedding("chest pain symptoms");
    const similarCases = await tidb.searchSimilarCases(queryEmbedding, 3);
    console.log(`✅ Found ${similarCases.length} similar cases\n`);
    
    if (similarCases.length > 0) {
      console.log('📋 Similar cases found:');
      similarCases.forEach((caseItem: any, index: number) => {
        console.log(`${index + 1}. ${caseItem.title} (Similarity: ${caseItem.similarity_score?.toFixed(4)})`);
      });
    }
    
    await tidb.disconnect();
    console.log('\n🎉 All TiDB tests passed successfully!');
    
  } catch (error) {
    console.error('\n❌ TiDB test failed:', error);
    process.exit(1);
  }
}

async function main() {
  try {
    await testTiDBConnection();
    process.exit(0);
  } catch (error) {
    console.error('Test script failed:', error);
    process.exit(1);
  }
}

main();
