import { Suspense } from "react";
import ErrorContent from "./error-content";

export default function ErrorPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 to-slate-100 dark:from-slate-900 dark:to-red-950">
			<Suspense fallback={<div>Loading...</div>}>
				<ErrorContent />
			</Suspense>
		</div>
	);
}
