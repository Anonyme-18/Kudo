import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const waitlist = pgTable(
  "waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    code: text("code").notNull().unique(),
    referredBy: text("referred_by"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [index("waitlist_referred_by_idx").on(table.referredBy)],
);

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type NewWaitlistEntry = typeof waitlist.$inferInsert;
