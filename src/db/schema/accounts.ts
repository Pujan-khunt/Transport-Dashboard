import { pgTable, text, integer, primaryKey } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/users";

export const account = pgTable(
	"accounts",
	{
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type")
			.$type<"oauth" | "email" | "oidc" | "webauthn">()
			.notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("provider_account_id").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(table) => [
		primaryKey({ columns: [table.provider, table.providerAccountId] }),
	],
);
