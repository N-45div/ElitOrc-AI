import { CohereClientV2 } from 'cohere-ai';

export class EmbeddingService {
  private cohere: CohereClientV2 | null = null;

  private getClient(): CohereClientV2 {
    if (!this.cohere) {
      if (!process.env.COHERE_API_KEY) {
        throw new Error('COHERE_API_KEY environment variable is required');
      }
      this.cohere = new CohereClientV2({
        token: process.env.COHERE_API_KEY,
      });
    }
    return this.cohere;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.getClient().embed({
        model: 'embed-english-v3.0',
        texts: [text],
        inputType: 'search_document',
        embeddingTypes: ['float']
      });

      const embedding = response.embeddings?.float?.[0];
      if (!embedding) {
        throw new Error('No embedding returned from Cohere');
      }

      console.log(`✅ Generated embedding for text (${text.length} chars)`);
      return embedding;
    } catch (error) {
      console.error('❌ Failed to generate embedding:', error);
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const response = await this.getClient().embed({
        model: 'embed-english-v3.0',
        texts: texts,
        inputType: 'search_document',
        embeddingTypes: ['float']
      });

      const embeddings = response.embeddings?.float;
      if (!embeddings) {
        throw new Error('No embeddings returned from Cohere');
      }

      console.log(`✅ Generated ${embeddings.length} embeddings`);
      return embeddings;
    } catch (error) {
      console.error('❌ Failed to generate embeddings:', error);
      throw error;
    }
  }

  async generateQueryEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.getClient().embed({
        model: 'embed-english-v3.0',
        texts: [text],
        inputType: 'search_query',
        embeddingTypes: ['float']
      });

      const embedding = response.embeddings?.float?.[0];
      if (!embedding) {
        throw new Error('No embedding returned from Cohere');
      }

      console.log(`✅ Generated query embedding for text (${text.length} chars)`);
      return embedding;
    } catch (error) {
      console.error('❌ Failed to generate query embedding:', error);
      throw error;
    }
  }

  // Create a combined text representation for medical cases
  createCaseText(caseData: {
    title: string;
    description: string;
    symptoms: string;
    diagnosis: string;
    treatment: string;
    patient_age?: number;
    patient_gender?: string;
    medical_history?: string;
  }): string {
    const parts = [
      `Title: ${caseData.title}`,
      `Description: ${caseData.description}`,
      `Symptoms: ${caseData.symptoms}`,
      `Diagnosis: ${caseData.diagnosis}`,
      `Treatment: ${caseData.treatment}`,
    ];

    if (caseData.patient_age) {
      parts.push(`Age: ${caseData.patient_age}`);
    }
    
    if (caseData.patient_gender) {
      parts.push(`Gender: ${caseData.patient_gender}`);
    }
    
    if (caseData.medical_history) {
      parts.push(`Medical History: ${caseData.medical_history}`);
    }

    return parts.join('\n');
  }
}

// Export singleton instance
export const embeddingService = new EmbeddingService();
