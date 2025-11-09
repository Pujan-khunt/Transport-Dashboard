import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
	username: string | null | undefined;
	avatar: string | null | undefined;
	email: string | undefined;
	className?: string;
}

function UserInfo({ username, email, avatar, className }: Props) {
	const initials =
		username
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase() || "?";

	return (
		<div className={cn("lg:flex items-center gap-4", className)}>
			<div className="flex items-center justify-center gap-3 p-2 mt-6">
				<Avatar className="h-9 w-9">
					<AvatarImage src={avatar || undefined} alt={username || ""} />
					<AvatarFallback className="bg-purple-600 text-white">
						{initials}
					</AvatarFallback>
				</Avatar>

				<div className="text-left">
					<p className="text-sm font-medium text-white">{username}</p>
					<p className="text-xs text-gray-400">{email}</p>
				</div>
			</div>
		</div>
	);
}

export default UserInfo;
