import { redirect } from "next/navigation";
import { auth } from "@/auth/next-auth";
import SignInForm from "./sign-in-form";

export default async function SignInPage() {
	// If already authenticated, redirect to admin dashboard
	const session = await auth();

	if (session?.user.isAdmin) {
		redirect("/admin/dashboard");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<SignInForm />
		</div>
	);
}
