import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];
const ALLOWED_DOMAINS = ["scaler.com", "sst.scaler.com"] as const;

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth Credentials");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error", 
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, 
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider !== "google") return false;

            const googleProfile = profile as { email?: string; hd?: string; email_verified?: boolean };
            
            const isAllowedDomain =
                googleProfile.hd &&
                ALLOWED_DOMAINS.includes(googleProfile.hd as any);

            // If true, login proceeds. If false, redirects to /auth/error?error=AccessDenied
            if (googleProfile.email_verified && isAllowedDomain) {
                return true; 
            }

            console.warn(`❌ Access denied for: ${googleProfile.email}`);
            return false;
        },

        async jwt({ token, user, profile }) {
            if (user && profile) {
                const email = user.email || "";
                
                // Determine Role
                const isUserAdmin = ADMIN_EMAILS.includes(email);

                token.id = user.id;
                token.role = isUserAdmin ? "admin" : "student"; 
                
               
                token.isAdmin = isUserAdmin;
                
                token.organization = (profile as any).hd || null;
                token.picture = (profile as any).picture;
            }
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = (token.role as "admin" | "student") || "student";
                
                session.user.isAdmin = token.isAdmin as boolean;
                
                session.user.organization = token.organization as string | null;
                session.user.image = token.picture as string | null;
            }
            return session;
        },
    },
});