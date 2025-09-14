"use client";

import { useState, useEffect } from "react";
import { ClinicalChatInput } from "@/components/ui/clinical-chat-input";
import { ChatSidebar } from "@/components/ui/chat-sidebar";
import { clinicalAPI } from "@/lib/mastra-client";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ChatStorage, ChatMessage, ChatSession } from "@/lib/chat-storage";
import ReactMarkdown from 'react-markdown';

export function ClinicalChatDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize sessions and current session on component mount
  useEffect(() => {
    const allSessions = ChatStorage.getAllSessions();
    setSessions(allSessions);
    
    let sessionId = ChatStorage.getCurrentSessionId();
    
    // If no current session or session doesn't exist, create a new one
    if (!sessionId || !allSessions.find(s => s.id === sessionId)) {
      const newSession = ChatStorage.createNewSession();
      sessionId = newSession.id;
      setSessions(prev => [newSession, ...prev]);
    }
    
    setCurrentSessionId(sessionId);
    
    // Load messages for current session
    const currentSession = ChatStorage.getSession(sessionId);
    if (currentSession) {
      setMessages(currentSession.messages);
    }
  }, []);

  const handleSubmit = async (message: string, files: File[]) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      files: files.length > 0 ? files : undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    ChatStorage.addMessageToSession(currentSessionId, userMessage);
    setIsLoading(true);

    try {
      // Call clinical workflow API
      const response = await clinicalAPI.executeWorkflow(message, files);
      
      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: response.response || 'Analysis completed successfully.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      ChatStorage.addMessageToSession(currentSessionId, assistantMessage);
    } catch (error) {
      console.error('Clinical analysis failed:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your clinical query. Please try again or consult with a healthcare professional.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      ChatStorage.addMessageToSession(currentSessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    ChatStorage.setCurrentSessionId(sessionId);
    
    // Load messages for selected session
    const session = ChatStorage.getSession(sessionId);
    if (session) {
      setMessages(session.messages);
    } else {
      setMessages([]);
    }
  };

  const handleNewChat = () => {
    const newSession = ChatStorage.createNewSession();
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setSessions(prev => [newSession, ...prev]);
  };

  const handleDeleteSession = (sessionId: string) => {
    ChatStorage.deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // If we deleted the current session, create a new one
    if (sessionId === currentSessionId) {
      handleNewChat();
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background dark:bg-[#212121]">
      {/* Sidebar */}
      {sidebarOpen && (
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onDeleteSession={handleDeleteSession}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="border-b border-border p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Dr. AMIE - Clinical AI
                </h1>
                <p className="text-sm text-muted-foreground">
                  Advanced multimodal clinical analysis with TiDB vector search and medical imaging
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex"
            >
              {sidebarOpen ? <X className="w-4 h-4 mr-2" /> : <Menu className="w-4 h-4 mr-2" />}
              {sidebarOpen ? 'Hide' : 'Show'} History
            </Button>
          </div>
        </div>

        {/* Chat Messages - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🧠</div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Welcome to Dr. AMIE
                </h3>
                <p className="text-muted-foreground mb-4">
                  Advanced Multimodal Intelligence for Emergency care
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-blue-600 font-medium mb-2">🔍 Vector Search</div>
                    <p className="text-gray-600 dark:text-gray-300">Search similar clinical cases using TiDB Serverless</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-green-600 font-medium mb-2">📊 Image Analysis</div>
                    <p className="text-gray-600 dark:text-gray-300">Analyze MRI, X-ray, CT scans with Roboflow AI</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-purple-600 font-medium mb-2">🧠 Clinical Reasoning</div>
                    <p className="text-gray-600 dark:text-gray-300">Multi-step diagnosis with confidence levels</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none dark:prose-invert">
                        <ReactMarkdown 
                          components={{
                            h1: ({children}) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
                            p: ({children}) => <p className="mb-2">{children}</p>,
                            ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                            li: ({children}) => <li className="mb-1">{children}</li>,
                            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                            em: ({children}) => <em className="italic">{children}</em>,
                            code: ({children}) => <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                    {msg.files && msg.files.length > 0 && (
                      <div className="mt-2 text-xs opacity-75">
                        📎 {msg.files.length} file(s) attached
                      </div>
                    )}
                    <div className="text-xs opacity-75 mt-2">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-lg p-4 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Analyzing clinical data...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input - Fixed at Bottom */}
        <div className="border-t border-border p-4 flex-shrink-0 bg-background">
          <div className="max-w-4xl mx-auto">
            <ClinicalChatInput
              onSubmit={handleSubmit}
              placeholder="Describe symptoms, upload medical images, or ask clinical questions..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
