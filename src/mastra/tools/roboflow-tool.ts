import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const roboflowTool = createTool({
  id: 'roboflowTool',
  description: 'Analyzes medical images (MRI, CT, X-ray) using a Roboflow model to detect abnormalities and provide diagnostic insights.',
  inputSchema: z.object({
    imageDataUri: z.string().optional().describe('The medical image as a data URI (data:image/jpeg;base64,...)'),
  }),
  outputSchema: z.object({
    predictions: z.array(z.any()).optional(),
    error: z.string().optional(),
    success: z.boolean(),
    analysis: z.string().optional(),
    confidence: z.number().optional(),
  }),
  execute: async ({ context, imageDataUri }: { context: any; imageDataUri?: string }) => {
    console.log('🔬 Roboflow Tool Execute - Parameters received');
    console.log('🔬 Context keys:', Object.keys(context || {}));
    console.log('🔬 ImageDataUri parameter provided:', !!imageDataUri);
    
    // Get image data from parameter or fallback to context
    const finalImageDataUri = imageDataUri || context?.imageDataUri || context?.imageData || context?.image;
    
    console.log('🔬 Final image data found:', !!finalImageDataUri);
    console.log('🔬 Final image data length:', finalImageDataUri?.length || 0);
    
    // Environment variables validation
    const apiKey = process.env.ROBOFLOW_API_KEY;
    const modelId = process.env.ROBOFLOW_MODEL_ID;
    const modelVersion = process.env.ROBOFLOW_MODEL_VERSION;

    console.log('🔬 Roboflow Analysis Starting...');
    console.log('📋 Model ID:', modelId);
    console.log('🔑 API Key present:', !!apiKey);
    console.log('📋 Model Version:', modelVersion);

    if (!apiKey || !modelId || !modelVersion) {
      console.error('❌ Missing Roboflow configuration');
      return { 
        success: false,
        error: 'Roboflow environment variables are not configured. Please check ROBOFLOW_API_KEY, ROBOFLOW_MODEL_ID, and ROBOFLOW_MODEL_VERSION.',
        analysis: 'Unable to analyze image - missing API configuration'
      };
    }

    // Validate input
    if (!finalImageDataUri) {
      return {
        success: false,
        error: 'No image data provided',
        analysis: 'Image data is required for analysis'
      };
    }

    console.log('📷 Image Data URI length:', finalImageDataUri.length);
    console.log('📷 Image Data URI prefix:', finalImageDataUri.substring(0, 50));

    // Handle different image data formats
    let base64Image: string;
    
    try {
      if (finalImageDataUri.startsWith('data:')) {
        // Standard data URI format: data:image/jpeg;base64,/9j/4AAQSkZJRg...
        const parts = finalImageDataUri.split(',');
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
        base64Image = finalImageDataUri;
      }

      if (!base64Image || base64Image.length < 100) {
        return {
          success: false,
          error: 'Invalid or empty base64 image data',
          analysis: 'Image data is too short or empty'
        };
      }

      console.log('✅ Base64 image extracted, length:', base64Image.length);

      // Construct Roboflow API URL
      const url = `https://detect.roboflow.com/${modelId}/${modelVersion}?api_key=${apiKey}`;
      console.log('🌐 Roboflow URL:', url.replace(apiKey, '[REDACTED]'));

      console.log('📡 Sending request to Roboflow API...');
      
      // Make API request with timeout and proper error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'ElitorcAI/1.0'
        },
        body: base64Image,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('📊 Roboflow Response Status:', response.status);
      console.log('📊 Roboflow Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Roboflow API Error Response:', errorText);
        
        let errorMessage = `Roboflow API error: ${response.status}`;
        if (response.status === 401) {
          errorMessage = 'Invalid Roboflow API key';
        } else if (response.status === 404) {
          errorMessage = 'Roboflow model not found - check MODEL_ID and MODEL_VERSION';
        } else if (response.status === 429) {
          errorMessage = 'Roboflow API rate limit exceeded';
        }
        
        return { 
          success: false,
          error: `${errorMessage}: ${errorText}`,
          analysis: 'Failed to analyze image with Roboflow model'
        };
      }

      const data = await response.json() as any;
      console.log('✅ Roboflow Analysis Complete');
      console.log('🔍 Raw response:', JSON.stringify(data, null, 2));
      console.log('🔍 Predictions found:', data.predictions?.length || 0);

      // Process predictions
      const predictions = data.predictions || [];
      let analysis = '';
      let confidence = 0;

      if (predictions.length > 0) {
        const highConfidencePredictions = predictions.filter((p: any) => p.confidence > 0.5);
        confidence = Math.max(...predictions.map((p: any) => p.confidence || 0));
        
        analysis = `Roboflow detected ${predictions.length} findings in the medical image. `;
        if (highConfidencePredictions.length > 0) {
          analysis += `${highConfidencePredictions.length} findings have high confidence (>50%). `;
        }
        analysis += `Highest confidence: ${(confidence * 100).toFixed(1)}%.`;
      } else {
        analysis = 'No abnormalities detected by Roboflow model. The image appears normal based on the trained model.';
        confidence = 0.8; // High confidence in normal finding
      }

      return { 
        success: true,
        predictions: predictions,
        analysis,
        confidence
      };

    } catch (error: any) {
      console.error('❌ Roboflow Tool Error:', error);
      
      let errorMessage = 'Network or processing error during image analysis';
      if (error.name === 'AbortError') {
        errorMessage = 'Roboflow API request timed out';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error connecting to Roboflow API';
      }
      
      return { 
        success: false,
        error: `Failed to call Roboflow API: ${error.message}`,
        analysis: errorMessage
      };
    }
  },
});
