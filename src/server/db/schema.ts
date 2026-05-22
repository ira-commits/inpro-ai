import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  jsonb,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["consultant", "client"]);

export const sessionStatusEnum = pgEnum("session_status", [
  "scheduled",
  "live",
  "completed",
  "cancelled",
  "no_show",
]);

export const conversationStatusEnum = pgEnum("conversation_status", [
  "active",
  "booked",
  "escalated",
  "closed",
]);

export const messageRoleEnum = pgEnum("message_role", [
  "user",
  "assistant",
  "system",
]);

export const knowledgeSourceEnum = pgEnum("knowledge_source", [
  "manual",
  "session_transcript",
  "document",
]);

export const automationTypeEnum = pgEnum("automation_type", [
  "auto_confirm_booking",
  "post_session_followup",
  "proposal_generator",
  "no_show_rebooking",
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("client"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const consultants = pgTable("consultants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  bio: text("bio"),
  headline: text("headline"),
  timezone: text("timezone").default("America/New_York"),
  stripeAccountId: text("stripe_account_id"),
  calUsername: text("cal_username"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultantId: uuid("consultant_id")
    .notNull()
    .references(() => consultants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  priceCents: integer("price_cents").notNull(),
  currency: text("currency").notNull().default("usd"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultantId: uuid("consultant_id")
    .notNull()
    .references(() => consultants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  persona: text("persona"),
  greeting: text("greeting"),
  isActive: boolean("is_active").notNull().default(true),
  escalationThreshold: real("escalation_threshold").notNull().default(0.3),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultantId: uuid("consultant_id")
    .notNull()
    .references(() => consultants.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  source: knowledgeSourceEnum("source").notNull().default("manual"),
  sourceId: uuid("source_id"),
  // embedding stored as text here; pgvector type added via raw migration
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultantId: uuid("consultant_id")
    .notNull()
    .references(() => consultants.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id),
  status: sessionStatusEnum("status").notNull().default("scheduled"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  dailyRoomUrl: text("daily_room_url"),
  dailyRecordingId: text("daily_recording_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  amountCents: integer("amount_cents"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const transcripts = pgTable("transcripts", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  assemblyaiId: text("assemblyai_id"),
  rawTranscript: text("raw_transcript"),
  summary: text("summary"),
  actionItems: jsonb("action_items").$type<
    { text: string; owner: string; dueDate: string | null }[]
  >(),
  openQuestions: jsonb("open_questions").$type<string[]>(),
  followUpSentAt: timestamp("follow_up_sent_at", { withTimezone: true }),
  indexedAt: timestamp("indexed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultantId: uuid("consultant_id")
    .notNull()
    .references(() => consultants.id, { onDelete: "cascade" }),
  clientId: uuid("client_id").references(() => users.id),
  clientEmail: text("client_email"),
  status: conversationStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  toolCalls: jsonb("tool_calls"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const automations = pgTable("automations", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultantId: uuid("consultant_id")
    .notNull()
    .references(() => consultants.id, { onDelete: "cascade" }),
  type: automationTypeEnum("type").notNull(),
  isEnabled: boolean("is_enabled").notNull().default(false),
  config: jsonb("config"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ─── Types ───────────────────────────────────────────────────────────────────

// ─── Relations ───────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  consultants: many(consultants),
}));

export const consultantsRelations = relations(consultants, ({ one, many }) => ({
  user: one(users, { fields: [consultants.userId], references: [users.id] }),
  services: many(services),
  agents: many(agents),
  sessions: many(sessions),
  conversations: many(conversations),
  knowledgeChunks: many(knowledgeChunks),
  automations: many(automations),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  consultant: one(consultants, { fields: [services.consultantId], references: [consultants.id] }),
}));

export const agentsRelations = relations(agents, ({ one }) => ({
  consultant: one(consultants, { fields: [agents.consultantId], references: [consultants.id] }),
}));

export const knowledgeChunksRelations = relations(knowledgeChunks, ({ one }) => ({
  consultant: one(consultants, { fields: [knowledgeChunks.consultantId], references: [consultants.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  consultant: one(consultants, { fields: [sessions.consultantId], references: [consultants.id] }),
  client: one(users, { fields: [sessions.clientId], references: [users.id] }),
  service: one(services, { fields: [sessions.serviceId], references: [services.id] }),
  transcript: one(transcripts, { fields: [sessions.id], references: [transcripts.sessionId] }),
}));

export const transcriptsRelations = relations(transcripts, ({ one }) => ({
  session: one(sessions, { fields: [transcripts.sessionId], references: [sessions.id] }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  consultant: one(consultants, { fields: [conversations.consultantId], references: [consultants.id] }),
  client: one(users, { fields: [conversations.clientId], references: [users.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
}));

export const automationsRelations = relations(automations, ({ one }) => ({
  consultant: one(consultants, { fields: [automations.consultantId], references: [consultants.id] }),
}));

// ─── Types ───────────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Consultant = typeof consultants.$inferSelect;
export type NewConsultant = typeof consultants.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type Agent = typeof agents.$inferSelect;
export type NewAgent = typeof agents.$inferInsert;

export type KnowledgeChunk = typeof knowledgeChunks.$inferSelect;
export type NewKnowledgeChunk = typeof knowledgeChunks.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Transcript = typeof transcripts.$inferSelect;
export type NewTranscript = typeof transcripts.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Automation = typeof automations.$inferSelect;
export type NewAutomation = typeof automations.$inferInsert;
