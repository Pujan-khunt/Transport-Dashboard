import { auth } from "@/auth/next-auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
	const session = await auth();

	if (!session?.user.isAdmin) {
		redirect("/auth/signin");
	}

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-8">
				<div>
					<h1 className="text-3xl font-bold">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back, {session.user.name}!
					</p>
				</div>
				<Button asChild variant="outline">
					<Link href="/auth/signout">Sign Out</Link>
				</Button>
			</div>

			<div className="grid gap-4">
				<div className="rounded-lg border p-4">
					<p>
						<strong>Email:</strong> {session.user.email}
					</p>
					<p>
						<strong>Organization:</strong> {session.user.organization}
					</p>
					<p>
						<strong>Admin:</strong> {session.user.isAdmin ? "Yes" : "No"}
					</p>
				</div>
			</div>
		</div>
	);
}
