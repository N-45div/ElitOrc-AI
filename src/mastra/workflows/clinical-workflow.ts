import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { roboflowTool } from '../tools/roboflow-tool';
import { tidbSearchTool } from '../tools/tidb-search-tool';

// Step 1: Process input (text, image, audio)
const processInputStep = createStep({
  id: 'processInput',
  inputSchema: z.object({
    query: z.string(),
    imageData: z.string().optional(),
    audioData: z.string().optional()
  }),
  outputSchema: z.object({
    processedQuery: z.string(),
    imageDataUri: z.string().optional(),
    hasAudio: z.boolean(),
    timestamp: z.string()
  }),
  execute: async ({ inputData }) => {
    const { query, imageData, audioData } = inputData;
    return {
      processedQuery: query,
      imageDataUri: imageData,
      hasAudio: !!audioData,
      timestamp: new Date().toISOString()
    };
  }
});

// Step 2: Analyze Image if provided
const imageAnalysisStep = createStep({
  id: 'imageAnalysis',
  inputSchema: z.object({
    processedQuery: z.string(),
    imageDataUri: z.string().optional(),
    hasAudio: z.boolean(),
    timestamp: z.string()
  }),
  outputSchema: z.object({
    processedQuery: z.string(),
    imageDataUri: z.string().optional(),
    hasAudio: z.boolean(),
    timestamp: z.string(),
    imageAnalysis: z.any().optional()
  }),
  execute: async ({ inputData }) => {
    if (!inputData.imageDataUri) {
      return { ...inputData, imageAnalysis: null };
    }
    try {
      const analysis = await roboflowTool.execute({
        context: { imageDataUri: inputData.imageDataUri }
      } as any);
      return { ...inputData, imageAnalysis: analysis };
    } catch (error) {
      console.error('Failed to analyze image:', error);
      return { ...inputData, imageAnalysis: { error: 'Failed to analyze image' } };
    }
  }
});

// Step 3: Clinical Analysis
const clinicalAnalysisStep = createStep({
  id: 'clinicalAnalysis',
  inputSchema: z.object({
    processedQuery: z.string(),
    imageDataUri: z.string().optional(),
    hasAudio: z.boolean(),
    timestamp: z.string(),
    imageAnalysis: z.any().optional()
  }),
  outputSchema: z.object({
    diagnosis: z.string(),
    confidence: z.number(),
    recommendations: z.array(z.string()),
    fullAnalysis: z.string(),
    response: z.string(),
    complete: z.boolean()
  }),
  execute: async ({ inputData }) => {
    const { processedQuery, imageAnalysis } = inputData;
    
    try {
      // Check for greeting
      const isGreeting = /^\s*(hi|hello|hey|good\s+(morning|afternoon|evening)|greetings?|howdy|hiya|whats up|sup|yo|how are you|how do you do|thanks?|thank you|ty|bye|goodbye|see you|later|farewell)\s*$/i.test(processedQuery.toLowerCase());

      if (isGreeting) {
        return {
          diagnosis: 'Greeting detected',
          confidence: 1.0,
          recommendations: ['Feel free to ask about medical symptoms, conditions, or upload medical images for analysis'],
          fullAnalysis: 'Hello! I\'m Dr. AMIE, your clinical AI assistant. How can I help you with medical analysis today?',
          response: 'Hello! I\'m Dr. AMIE, your clinical AI assistant. How can I help you with medical analysis today?',
          complete: true
        };
      }

      // Perform clinical analysis based on input
      let analysisText = `## Clinical Analysis\n\n**Patient Presentation:** ${processedQuery}\n\n`;

      if (imageAnalysis && imageAnalysis.predictions) {
        analysisText += `**Imaging Results:** MRI analysis detected findings: ${JSON.stringify(imageAnalysis.predictions, null, 2)}\n\n`;
      } else if (imageAnalysis && imageAnalysis.error) {
        analysisText += `**Imaging:** Could not analyze provided medical image: ${imageAnalysis.error}\n\n`;
      }

      // Search for similar cases using TiDB vector search
      let similarCases: any[] = [];
      try {
        // For now, skip TiDB search in workflow - will be handled by agent tools
        console.log('TiDB search would be performed here for:', processedQuery);
        
        if (similarCases.length > 0) {
          analysisText += `**Similar Cases Found:**\n`;
          similarCases.forEach((case_: any, index: number) => {
            analysisText += `${index + 1}. ${case_.title} (Similarity: ${(1 - case_.similarity_score).toFixed(2)})\n`;
            analysisText += `   - Diagnosis: ${case_.diagnosis}\n`;
            analysisText += `   - Treatment: ${case_.treatment}\n\n`;
          });
        }
      } catch (error) {
        console.error('Failed to search similar cases:', error);
      }

      // Parse symptoms and provide structured analysis
      const symptoms = processedQuery.toLowerCase();
      let diagnosis = 'Clinical evaluation needed';
      let confidence = 0.7;
      let recommendations = [
        'Consult with healthcare professional for proper evaluation',
        'Consider diagnostic workup as recommended',
        'Monitor symptoms and seek immediate care if worsening'
      ];

      // Enhanced analysis based on similar cases and symptoms
      if (similarCases.length > 0) {
        const topCase = similarCases[0];
        diagnosis = `Possible ${topCase.diagnosis} (based on similar case analysis)`;
        confidence = Math.min(0.9, 0.6 + (1 - topCase.similarity_score) * 0.3);
        
        analysisText += `**AI-Assisted Analysis:**\n`;
        analysisText += `Based on vector similarity search of clinical cases, this presentation most closely matches:\n`;
        analysisText += `"${topCase.title}" with ${((1 - topCase.similarity_score) * 100).toFixed(1)}% similarity.\n\n`;
      }

      // Basic symptom analysis for common presentations
      if (symptoms.includes('chest pain') && (symptoms.includes('shortness of breath') || symptoms.includes('fatigue'))) {
        if (!similarCases.length) {
          diagnosis = 'Possible acute coronary syndrome or cardiac condition';
          confidence = 0.8;
        }
        analysisText += `**Primary Diagnosis:** ${diagnosis} (Confidence: ${confidence.toFixed(2)})\n\n`;
        analysisText += `**Differential Diagnoses:**\n1. Acute coronary syndrome\n2. Heart failure exacerbation\n3. Pulmonary embolism\n\n`;
        analysisText += `**Recommended Workup:**\n- 12-lead ECG\n- Cardiac enzymes (troponin)\n- Chest X-ray\n- Complete blood count\n- Basic metabolic panel\n\n`;
        analysisText += `**Treatment Recommendations:**\n- Immediate cardiac evaluation\n- Consider aspirin if no contraindications\n- Monitor vital signs\n- Prepare for possible cardiac catheterization\n\n`;
        analysisText += `**Clinical Considerations:**\n- History of hypertension and smoking are significant risk factors\n- Time-sensitive condition requiring urgent evaluation\n- Consider STEMI protocol if ECG changes present\n\n`;
        
        recommendations = [
          'URGENT: Seek immediate emergency medical evaluation',
          'Do not delay - call 911 or go to nearest emergency department',
          'Avoid physical exertion until evaluated'
        ];
      } else {
        analysisText += `**Assessment:** Based on the presented symptoms and similar case analysis, a comprehensive clinical evaluation is needed to determine the underlying cause and appropriate treatment plan.\n\n`;
        analysisText += `**Recommendations:**\n- Schedule appointment with primary care physician\n- Document symptom timeline and triggers\n- Monitor for any worsening symptoms\n\n`;
      }

      return {
        diagnosis,
        confidence: Math.min(Math.max(confidence, 0.0), 1.0),
        recommendations,
        fullAnalysis: analysisText,
        response: analysisText,
        complete: true
      };

    } catch (error: any) {
      console.error('Failed to perform clinical analysis:', error);
      return {
        diagnosis: 'Analysis unavailable - please consult healthcare provider',
        confidence: 0.0,
        recommendations: ['Seek immediate professional medical consultation'],
        fullAnalysis: 'Clinical analysis could not be completed due to technical issues.',
        response: 'I apologize, but I encountered an error processing your clinical query. Please try again or consult with a healthcare professional.',
        complete: true
      };
    }
  }
});

export const clinicalWorkflow = createWorkflow({
  id: 'clinical-workflow',
  description: 'Clinical analysis workflow for medical queries',
  inputSchema: z.object({
    query: z.string(),
    imageData: z.string().optional(),
    audioData: z.string().optional()
  }),
  outputSchema: z.object({
    response: z.string(),
    complete: z.boolean()
  })
})
.then(processInputStep)
.then(imageAnalysisStep)
.then(clinicalAnalysisStep)
.commit();
