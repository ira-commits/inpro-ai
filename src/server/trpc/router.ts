import { createTRPCRouter } from "./trpc";
import { consultantsRouter } from "./routers/consultants";
import { sessionsRouter } from "./routers/sessions";
import { agentRouter } from "./routers/agent";

export const appRouter = createTRPCRouter({
  consultants: consultantsRouter,
  sessions: sessionsRouter,
  agent: agentRouter,
});

export type AppRouter = typeof appRouter;
