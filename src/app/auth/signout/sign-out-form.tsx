"use client";

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface SignOutFormProps {
	user: {
		name?: string | null;
		email?: string | null;
		image?: string | null;
	};
}

export default function SignOutForm({ user }: SignOutFormProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleSignOut = async () => {
		setIsLoading(true);
		await signOut({ callbackUrl: "/dashboard" });
	};

	const initials =
		user.name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase() || "?";

	return (
		<Card className="w-full max-w-md shadow-xl">
			<CardHeader className="space-y-1 text-center">
				<div className="mx-auto mb-4">
					<Avatar className="h-20 w-20">
						<AvatarImage src={user.image || undefined} alt={user.name || ""} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
				</div>
				<CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
				<CardDescription>
					Are you sure you want to sign out of your account?
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2 text-center">
				<p className="text-sm text-muted-foreground">{user.name}</p>
				<p className="text-sm font-medium">{user.email}</p>
			</CardContent>

			<CardFooter className="flex flex-col gap-2">
				<Button
					onClick={handleSignOut}
					disabled={isLoading}
					variant="destructive"
					className="w-full"
					size="lg"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing out...
						</>
					) : (
						<>
							<LogOut className="mr-2 h-4 w-4" />
							Sign Out
						</>
					)}
				</Button>
				<Button asChild variant="outline" className="w-full">
					<a href="/dashboard">Cancel</a>
				</Button>
			</CardFooter>
		</Card>
	);
}
