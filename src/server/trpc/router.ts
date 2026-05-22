import { createTRPCRouter } from "./trpc";
import { consultantsRouter } from "./routers/consultants";
import { sessionsRouter } from "./routers/sessions";
import { agentRouter } from "./routers/agent";
import { servicesRouter } from "./routers/services";

export const appRouter = createTRPCRouter({
  consultants: consultantsRouter,
  sessions: sessionsRouter,
  agent: agentRouter,
  services: servicesRouter,
});

export type AppRouter = typeof appRouter;
