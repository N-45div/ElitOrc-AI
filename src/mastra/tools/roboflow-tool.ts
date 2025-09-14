import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const roboflowTool = createTool({
  id: 'roboflow-mri-analysis',
  description: 'Analyzes an MRI scan image using a Roboflow model to detect abnormalities.',
  inputSchema: z.object({
    imageDataUri: z.string().describe('The MRI scan image as a data URI.'),
  }),
  outputSchema: z.object({
    predictions: z.array(z.any()).optional(),
    error: z.string().optional(),
    success: z.boolean(),
    analysis: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { imageDataUri } = context;
    const apiKey = process.env.ROBOFLOW_API_KEY;
    const modelId = process.env.ROBOFLOW_MODEL_ID;
    const modelVersion = process.env.ROBOFLOW_MODEL_VERSION;

    if (!apiKey || !modelId || !modelVersion) {
      return { 
        success: false,
        error: 'Roboflow environment variables are not configured.',
        analysis: 'Unable to analyze image - missing API configuration'
      };
    }

    console.log('🔬 Roboflow Analysis Starting...');
    console.log('📋 Model ID:', modelId);
    console.log('🔑 API Key present:', !!apiKey);

    const url = `https://detect.roboflow.com/${modelId}/${modelVersion}?api_key=${apiKey}`;

    console.log('📷 Image Data URI length:', imageDataUri?.length || 0);
    console.log('📷 Image Data URI prefix:', imageDataUri?.substring(0, 50) || 'undefined');

    // Handle different image data formats
    let base64Image: string;
    
    if (imageDataUri.startsWith('data:')) {
      // Standard data URI format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
      const parts = imageDataUri.split(',');
      if (parts.length !== 2) {
        return {
          success: false,
          error: 'Invalid data URI format - missing comma separator',
          analysis: 'Image data URI is malformed'
        };
      }
      base64Image = parts[1];
    } else {
      // Assume it's already base64 encoded
      base64Image = imageDataUri;
    }

    if (!base64Image || base64Image.length < 100) {
      return {
        success: false,
        error: 'Invalid or empty base64 image data',
        analysis: 'Image data is too short or empty'
      };
    }

    console.log('✅ Base64 image extracted, length:', base64Image.length);

    try {
      console.log('📡 Sending request to Roboflow API...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: base64Image
      });

      console.log('📊 Roboflow Response Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Roboflow API Error:', errorText);
        return { 
          success: false,
          error: `Roboflow API error: ${response.status} ${errorText}`,
          analysis: 'Failed to analyze image with Roboflow model'
        };
      }

      const data = await response.json() as any;
      console.log('✅ Roboflow Analysis Complete');
      console.log('🔍 Predictions found:', data.predictions?.length || 0);

      const analysis = data.predictions?.length > 0 
        ? `Roboflow detected ${data.predictions.length} findings in the MRI scan`
        : 'No abnormalities detected by Roboflow model';

      return { 
        success: true,
        predictions: data.predictions,
        analysis
      };
    } catch (error: any) {
      console.error('❌ Roboflow Tool Error:', error.message);
      return { 
        success: false,
        error: `Failed to call Roboflow API: ${error.message}`,
        analysis: 'Network or processing error during image analysis'
      };
    }
  },
});
