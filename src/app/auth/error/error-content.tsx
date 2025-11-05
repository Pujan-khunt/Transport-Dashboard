"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	XCircle,
	ShieldAlert,
	AlertTriangle,
	Settings,
	Mail,
	Home,
	AlertCircle,
} from "lucide-react";

// NextAuth error types with descriptions
const ERROR_TYPES: Record<
	string,
	{
		title: string;
		description: string;
		icon: React.ComponentType<{ className?: string }>;
		severity: "error" | "warning";
	}
> = {
	AccessDenied: {
		title: "Access Denied",
		description:
			"Your account does not have permission to access this application. Only Scaler workspace accounts (scaler.com or sst.scaler.com) are allowed.",
		icon: ShieldAlert,
		severity: "error",
	},
	OAuthAccountNotLinked: {
		title: "Account Already Exists",
		description:
			"An account with this email already exists but is linked to a different sign-in provider. Please use your original sign-in method.",
		icon: AlertTriangle,
		severity: "warning",
	},
	Configuration: {
		title: "Configuration Error",
		description:
			"There is a problem with the server configuration. Please contact the administrator.",
		icon: Settings,
		severity: "error",
	},
	Verification: {
		title: "Verification Failed",
		description:
			"The verification link has expired or has already been used. Please request a new one.",
		icon: Mail,
		severity: "warning",
	},
	Default: {
		title: "Authentication Error",
		description:
			"An unexpected error occurred during authentication. Please try again.",
		icon: XCircle,
		severity: "error",
	},
};

export default function ErrorContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error") || "Default";

	// Get error details or fallback to default
	const errorDetails = ERROR_TYPES[error] || ERROR_TYPES.Default;
	const Icon = errorDetails.icon;

	return (
		<Card className="w-full max-w-lg shadow-xl border-destructive">
			<CardHeader className="space-y-1 text-center">
				<div
					className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
						errorDetails.severity === "error"
							? "bg-red-100 dark:bg-red-900"
							: "bg-yellow-100 dark:bg-yellow-900"
					}`}
				>
					<Icon
						className={`h-8 w-8 ${
							errorDetails.severity === "error"
								? "text-red-600 dark:text-red-400"
								: "text-yellow-600 dark:text-yellow-400"
						}`}
					/>
				</div>
				<CardTitle className="text-2xl font-bold">
					{errorDetails.title}
				</CardTitle>
				<CardDescription className="text-base">
					{errorDetails.description}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<Alert
					variant={
						errorDetails.severity === "error" ? "destructive" : "default"
					}
				>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error Code: {error}</AlertTitle>
					<AlertDescription>
						{error === "AccessDenied" && (
							<>
								Please ensure you're using a Google account from{" "}
								<strong>scaler.com</strong> or <strong>sst.scaler.com</strong>{" "}
								workspace organization.
							</>
						)}
						{error === "OAuthAccountNotLinked" && (
							<>
								Try signing in with the provider you originally used to create
								your account.
							</>
						)}
						{error === "Configuration" && (
							<>Please contact support with this error code for assistance.</>
						)}
						{error === "Verification" && (
							<>Request a new verification link to continue.</>
						)}
						{!ERROR_TYPES[error] && (
							<>
								If this problem persists, please contact support for assistance.
							</>
						)}
					</AlertDescription>
				</Alert>
			</CardContent>

			<CardFooter className="flex flex-col gap-2">
				<Button asChild className="w-full" size="lg">
					<Link href="/auth/signin">Try Again</Link>
				</Button>
				<Button asChild variant="outline" className="w-full">
					<Link href="/">
						<Home className="mr-2 h-4 w-4" />
						Go to Home
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
