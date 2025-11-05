import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	/**
	 * Returned by `auth()`, `useSession()`, `getSession()`
	 */
	interface Session {
		user: {
			id: string;
			isAdmin: boolean;
			organization: string | null;
		} & DefaultSession["user"];
	}

	/**
	 * The shape of the user object returned in OAuth providers' `profile` callback
	 */
	interface User {
		id: string;
		email: string;
		name?: string | null;
		image?: string | null;
		isAdmin: boolean;
		organization: string | null;
	}
}

declare module "next-auth/jwt" {
	/**
	 * Returned by the `jwt` callback and `auth()`, when using JWT sessions
	 */
	interface JWT extends DefaultJWT {
		id?: string;
		isAdmin?: boolean;
		organization?: string | null;
		picture?: string | null;
		provider?: string;
		accessToken?: string;
		refreshToken?: string;
	}
}
