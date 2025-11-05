import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

// Environment variable validation
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
	throw new Error(
		"GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are required for Google OAuth.",
	);
}

if (!process.env.NEXTAUTH_SECRET) {
	throw new Error("NEXTAUTH_SECRET is required for NextAuth configuration.");
}

// Allowed organization domains for admin access
const ALLOWED_DOMAINS = ["scaler.com", "sst.scaler.com"] as const;

export const authOptions: NextAuthConfig = {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					prompt: "select_account",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/sign-in",
		error: "/auth/error",
		signOut: "/auth/sign-out",
	},
	callbacks: {
		/**
		 * Controls whether a user is allowed to sign in
		 */
		async signIn({ account, profile }) {
			if (account?.provider !== "google") {
				return false;
			}

			// Google profile always includes these fields for Workspace users
			const googleProfile = profile as {
				email?: string;
				email_verified?: boolean;
				hd?: string;
			};

			// Check if user belongs to allowed workspace domains
			const isAllowedDomain =
				googleProfile.hd && ALLOWED_DOMAINS.includes(googleProfile.hd as any);

			if (googleProfile.email_verified && isAllowedDomain) {
				console.log(
					`✅ Admin access granted for: ${googleProfile.email} (${googleProfile.hd})`,
				);
				return true;
			}

			console.warn(
				`❌ Access denied for: ${googleProfile.email} (domain: ${googleProfile.hd || "none"})`,
			);
			return false;
		},

		/**
		 * Modifies the JWT token
		 */
		async jwt({ token, account, profile, trigger, session }) {
			// On initial sign-in (when account and profile exist)
			if (account && profile) {
				const googleProfile = profile as {
					sub?: string;
					email?: string;
					name?: string;
					picture?: string;
					hd?: string;
				};

				// Store admin-specific data in the token
				token.id = googleProfile.sub;
				token.isAdmin = true;
				token.organization = googleProfile.hd ?? null;
				token.picture = googleProfile.picture ?? null;
				token.provider = account.provider;

				// Optional: Store tokens for Google API calls
				if (account.access_token) {
					token.accessToken = account.access_token;
				}
				if (account.refresh_token) {
					token.refreshToken = account.refresh_token;
				}

				console.log(`🔐 JWT created for admin: ${googleProfile.email}`);
			}

			// Handle session updates (if you call session.update() from client)
			if (trigger === "update" && session) {
				// Merge updated session data
				return { ...token, ...session };
			}

			return token;
		},

		/**
		 * Shapes the session object returned to the client
		 */
		async session({ session, token }) {
			session.user.id = token.id ?? token.sub ?? "";
			session.user.isAdmin = token.isAdmin ?? false;
			session.user.organization = token.organization ?? null;

			// Override image with picture from token if available
			if (token.picture) {
				session.user.image = token.picture;
			}

			return session;
		},

		/**
		 * Controls where users are redirected after sign-in/sign-out
		 */
		async redirect({ url, baseUrl }) {
			// After successful sign-in, redirect to admin dashboard
			if (url === baseUrl || url === `${baseUrl}/`) {
				return `${baseUrl}/admin/dashboard`;
			}

			// Handle relative URLs
			if (url.startsWith("/")) {
				return `${baseUrl}${url}`;
			}

			// Allow same-origin redirects
			try {
				const urlObj = new URL(url);
				if (urlObj.origin === baseUrl) {
					return url;
				}
			} catch {
				// Invalid URL, fall through to default
			}

			// Default: redirect to admin dashboard
			return `${baseUrl}/admin/dashboard`;
		},
	},
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
