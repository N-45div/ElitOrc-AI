
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';

import { clinicalAgent } from './agents/clinical-agent';
import { clinicalWorkflow } from './workflows/clinical-workflow';

export const mastra = new Mastra({
  agents: { clinicalAgent },
  workflows: { clinicalWorkflow },
  logger: new PinoLogger({
    name: 'ElitorcAI',
    level: 'info',
  }),
});
