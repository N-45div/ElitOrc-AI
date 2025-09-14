
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';

import { clinicalAgent } from './agents/clinical-agent';
import { clinicalWorkflow } from './workflows/clinical-workflow';

export const mastra = new Mastra({
  agents: { clinicalAgent },
  workflows: { clinicalWorkflow },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    timeout: 30000, // 30 seconds
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization'],
      credentials: false,
    },
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'ElitorcAI',
    level: 'info',
  }),
});
