import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";

export const optedInEmails = pgTable("opted_in_emails", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  email: text("email").notNull().unique(), 
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type OptedInEmail = typeof optedInEmails.$inferSelect;
export type NewOptedInEmail = typeof optedInEmails.$inferInsert;