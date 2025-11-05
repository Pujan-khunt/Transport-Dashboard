import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL must be present :)");
}

export default defineConfig({
	schema: "./src/db/schema",
	dialect: "postgresql",
	out: "./src/db/drizzle",
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	verbose: true,
	strict: true,
});
