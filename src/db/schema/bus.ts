import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const bus = pgTable("buses", {
	id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
	origin: text("origin", {
		enum: ["Uniworld-1", "Uniworld-2", "Macro", "Special"],
	}).notNull(),
	destination: text("destination", {
		enum: ["Uniworld-1", "Uniworld-2", "Macro", "Special"],
	}).notNull(),
	specialDestination: text("special_destination"),
	departureTime: timestamp("departure_time", { withTimezone: true }).notNull(),
	status: text("status").default("On Time").notNull(),
	isPaid: boolean("is_paid").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	modifiedAt: timestamp("modified_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export type Bus = typeof bus.$inferSelect;
export type NewBus = typeof bus.$inferInsert;
