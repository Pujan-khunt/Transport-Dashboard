import { NextResponse } from "next/server";
import { auth } from "@/auth/next-auth";

export default auth((req) => {
	const isLoggedIn = !!req.auth;
	const { pathname } = req.nextUrl;
	const userRole = req.auth?.user?.role;

	const isUrlAdmin = pathname.startsWith("/admin");
	const isUrlDashboard = pathname.startsWith("/dashboard");
	const isUrlAuth = pathname.startsWith("/auth");

	const isSignOutPage = pathname === "/auth/signout";
	const isUrlRoot = pathname === "/";

	if (isUrlRoot) {
		if (isLoggedIn) {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
	}

	if (isUrlAuth && isLoggedIn && !isSignOutPage) {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}

	if (isUrlAdmin || isUrlDashboard) {
		if (!isLoggedIn) {
			const callbackUrl = encodeURIComponent(pathname);
			return NextResponse.redirect(
				new URL(`/auth/signin?callbackUrl=${callbackUrl}`, req.url),
			);
		}

		if (isUrlAdmin && userRole !== "admin") {
			return NextResponse.redirect(new URL("/dashboard", req.url));
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
