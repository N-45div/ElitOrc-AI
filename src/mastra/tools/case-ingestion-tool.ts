import { Tool } from '@mastra/core';
import { z } from 'zod';
import { tidb } from '../config/tidb';
import { embeddingService } from '../services/embeddingService';

export const caseIngestionTool = new Tool({
  id: 'case-ingestion',
  description: 'Ingest and index new clinical cases into TiDB Serverless with vector embeddings',
  inputSchema: z.object({
    title: z.string().describe('Case title'),
    description: z.string().describe('Case description'),
    symptoms: z.string().describe('Patient symptoms'),
    diagnosis: z.string().describe('Clinical diagnosis'),
    treatment: z.string().describe('Treatment plan'),
    outcome: z.string().describe('Treatment outcome'),
    patient_age: z.number().describe('Patient age'),
    patient_gender: z.enum(['male', 'female', 'other']).describe('Patient gender'),
    medical_history: z.string().describe('Patient medical history')
  }),
  outputSchema: z.object({
    success: z.boolean(),
    caseId: z.number().optional(),
    message: z.string()
  }),
  execute: async ({ context }) => {
    try {
      const caseData = context;
      
      console.log(`📥 Ingesting new clinical case: "${caseData.title}"`);
      
      // Connect to TiDB
      await tidb.connect();
      
      // Initialize tables if needed
      await tidb.initializeTables();
      
      // Create combined text for embedding
      const caseText = embeddingService.createCaseText(caseData);
      
      // Generate embedding
      const embedding = await embeddingService.generateEmbedding(caseText);
      
      // Insert case with embedding
      const caseId = await tidb.insertClinicalCase({
        ...caseData,
        embedding
      });
      
      // Disconnect from TiDB
      await tidb.disconnect();
      
      console.log(`✅ Successfully ingested case with ID: ${caseId}`);
      
      return {
        success: true,
        caseId,
        message: `Successfully ingested clinical case "${caseData.title}" with ID ${caseId}`
      };
      
    } catch (error) {
      console.error('❌ Case ingestion failed:', error);
      return {
        success: false,
        message: `Failed to ingest clinical case: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});
