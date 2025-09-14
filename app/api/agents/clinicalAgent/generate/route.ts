import { NextRequest, NextResponse } from 'next/server';
import { mastra } from '@/src/mastra';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, imageData, imageDataUri, imageType, clinicalContext } = body;

    // Get the clinical agent from Mastra
    const agent = mastra.getAgent('clinicalAgent');
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Clinical agent not found' },
        { status: 404 }
      );
    }

    // Prepare the input for the agent
    const userMessage = messages?.[0]?.content || '';
    let input = userMessage;

    // If there's image data, include it in the context
    if (imageData || imageDataUri) {
      input = clinicalContext || `${userMessage} - Medical image analysis requested. Image type: ${imageType || 'Unknown'}`;
    }

    // Generate response using the agent
    const result = await agent.generate(input, {
      ...(imageData && { imageData }),
      ...(imageDataUri && { imageDataUri }),
      ...(imageType && { imageType }),
    });

    return NextResponse.json({
      text: result.text || 'Analysis completed successfully.',
      steps: result.steps || [],
      complete: true
    });

  } catch (error) {
    console.error('Clinical agent error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process clinical query',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
