"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ShieldCheck } from "lucide-react";

export default function SignInForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleGoogleSignIn = async () => {
		try {
			setIsLoading(true);
			setError(null);

			// Trigger Google OAuth sign-in
			await signIn("google", {
				callbackUrl: "/admin/dashboard",
				redirect: true,
			});
		} catch (err) {
			console.error("Sign-in error:", err);
			setError("An unexpected error occurred. Please try again.");
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md shadow-xl">
			<CardHeader className="space-y-1 text-center">
				<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
					<ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
				</div>
				<CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
				<CardDescription>
					Sign in with your Scaler workspace account
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Button
					onClick={handleGoogleSignIn}
					disabled={isLoading}
					className="w-full"
					size="lg"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Signing in...
						</>
					) : (
						<>
							<svg
								className="mr-2 h-5 w-5"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
							Continue with Google
						</>
					)}
				</Button>
			</CardContent>

			<CardFooter>
				<p className="text-center text-sm text-muted-foreground w-full">
					Only accounts from{" "}
					<span className="font-medium text-foreground">scaler.com</span> or{" "}
					<span className="font-medium text-foreground">sst.scaler.com</span>{" "}
					are allowed
				</p>
			</CardFooter>
		</Card>
	);
}
