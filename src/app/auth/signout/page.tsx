import { auth } from "@/auth/next-auth";
import { redirect } from "next/navigation";
import SignOutForm from "./sign-out-form";

export default async function SignOutPage() {
	const session = await auth();

	// If not authenticated, redirect to sign-in
	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
			<SignOutForm user={session.user} />
		</div>
	);
}
