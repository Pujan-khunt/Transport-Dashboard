import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			// The new way
			role: "admin" | "student";
			// The OLD way (kept for backward compatibility)
			isAdmin: boolean;
			organization: string | null;
			isOptedIn?: boolean;
		} & DefaultSession["user"];
	}

	interface User {
		role?: "admin" | "student";
		organization?: string | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		role?: "admin" | "student";
		isAdmin?: boolean;
		organization?: string | null;
		picture?: string | null;
	}
}
