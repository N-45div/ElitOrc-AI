import { NextResponse } from 'next/server';
import { mastra } from '@/src/mastra';

export async function GET() {
  try {
    // List available agents
    const agents = mastra.getAgents();
    const agentNames = Object.keys(agents);
    
    return NextResponse.json({
      agents: agentNames,
      status: 'healthy'
    });

  } catch (error) {
    console.error('Agents API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to list agents',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
