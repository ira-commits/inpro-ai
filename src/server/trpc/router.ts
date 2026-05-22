import { createTRPCRouter } from "./trpc";
import { consultantsRouter } from "./routers/consultants";
import { sessionsRouter } from "./routers/sessions";
import { agentRouter } from "./routers/agent";
import { servicesRouter } from "./routers/services";
import { automationsRouter } from "./routers/automations";
import { knowledgeRouter } from "./routers/knowledge";

export const appRouter = createTRPCRouter({
  consultants: consultantsRouter,
  sessions: sessionsRouter,
  agent: agentRouter,
  services: servicesRouter,
  automations: automationsRouter,
  knowledge: knowledgeRouter,
});

export type AppRouter = typeof appRouter;
