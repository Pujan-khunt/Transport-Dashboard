import { Loader2 } from "lucide-react";

function LoadingIndicator() {
	return (
		<div className="fixed bottom-4 right-4 z-50">
			<div className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm text-white border border-gray-700 shadow-lg">
				<Loader2 className="h-4 w-4 animate-spin" /> <span>Updating...</span>
			</div>
		</div>
	);
}

export default LoadingIndicator;
