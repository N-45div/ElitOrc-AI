const baseUrl = process.env.NODE_ENV === 'production' 
  ? '' // Use relative URLs in production (same domain)
  : 'http://localhost:3000'; // Next.js dev server 

export const clinicalAPI = {
  async executeWorkflow(query: string, files: File[] = []) {
    try {
      let imageData: string | undefined;
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onerror = reject;
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      console.log('🔍 Sending request to:', `${baseUrl}/api/agents/clinicalAgent/generate`);
      console.log('📝 Query:', query);
      console.log('🖼️ Has image:', !!imageData);
      
      // Use agent endpoint since workflow execution endpoint doesn't exist
      const response = await fetch(`${baseUrl}/api/agents/clinicalAgent/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { 
              role: 'user', 
              content: query
            }
          ],
          ...(imageData && {
            imageData: imageData,
            imageDataUri: imageData,
            imageType: 'MRI',
            clinicalContext: `${query} - IMPORTANT: Please use BOTH medicalImageAnalyzer AND roboflow-mri-analysis tools for complete analysis.`
          })
        }),
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract the response text from the agent response format
      const responseText = result.steps?.[result.steps.length - 1]?.text || result.text || result.content || 'Analysis completed successfully.';
      
      return {
        response: responseText,
        complete: true
      };
    } catch (error) {
      console.error('Clinical workflow error:', error);
      throw error;
    }
  },

  async chat(messages: Array<{ role: string; content: string }>) {
    try {
      const query = messages.length > 0 ? messages[0].content : '';

      // Mastra agent generate endpoint
      const response = await fetch(`${baseUrl}/api/agents/clinicalAgent/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: query }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },

  async healthCheck() {
    try {
      // Check Mastra server health by listing agents
      const response = await fetch(`${baseUrl}/api/agents`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }
};