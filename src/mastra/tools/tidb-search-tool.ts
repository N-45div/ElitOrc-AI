import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { tidb } from '../config/tidb';
import { embeddingService } from '../services/embeddingService';

export const tidbSearchTool = createTool({
  id: 'tidbSearchTool',
  description: 'Search for similar clinical cases using TiDB Serverless vector search',
  inputSchema: z.object({
    query: z.string().describe('Clinical query or symptoms to search for'),
    limit: z.number().optional().default(5).describe('Maximum number of similar cases to return')
  }),
  outputSchema: z.object({
    similarCases: z.array(z.object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      symptoms: z.string(),
      diagnosis: z.string(),
      treatment: z.string(),
      outcome: z.string(),
      patient_age: z.number(),
      patient_gender: z.string(),
      medical_history: z.string(),
      similarity_score: z.number()
    })),
    searchComplete: z.boolean(),
    totalFound: z.number()
  }),
  execute: async ({ context }: { context: any }) => {
    try {
      const { query, limit } = context;
      
      console.log(`🔍 Searching TiDB for similar cases: "${query}"`);
      
      // Connect to TiDB
      await tidb.connect();
      
      // Generate query embedding
      const queryEmbedding = await embeddingService.generateQueryEmbedding(query);
      
      // Search for similar cases using vector similarity
      const similarCases = await tidb.searchSimilarCases(queryEmbedding, limit);
      
      // Disconnect from TiDB
      await tidb.disconnect();
      
      console.log(`✅ Found ${similarCases.length} similar cases`);
      
      return {
        similarCases: similarCases.map(case_ => ({
          id: case_.id,
          title: case_.title,
          description: case_.description,
          symptoms: case_.symptoms,
          diagnosis: case_.diagnosis,
          treatment: case_.treatment,
          outcome: case_.outcome,
          patient_age: case_.patient_age,
          patient_gender: case_.patient_gender,
          medical_history: case_.medical_history,
          similarity_score: (case_ as any).similarity_score || 0
        })),
        searchComplete: true,
        totalFound: similarCases.length
      };
      
    } catch (error) {
      console.error('❌ TiDB search failed:', error);
      return {
        similarCases: [],
        searchComplete: false,
        totalFound: 0
      };
    }
  }
});
