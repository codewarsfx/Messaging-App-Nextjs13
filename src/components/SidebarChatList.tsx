'use client'
import { chatIDconstructot } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface SidebarChatListProps {
	friends: User[];
	sessionid: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionid }) => {
	const router = useRouter();
	const pathname = usePathname();
	const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);

	useEffect(() => {
		if (pathname?.includes("chat")) {
			setUnseenMessages((prev) => {
				return prev.filter((msg) => !pathname.includes(msg.senderId));
			});
		}
	}, [pathname]);

	return (
		<ul role='list' className='max-h-25rem overflow-y-auto -mx-2 space-y-1'>
			{friends.sort().map((friend) => {
				const unseenMessgaesCount = unseenMessages.filter((message) => {
					return message.senderId === friend.id;
				}).length;
				return (
					<li key={friend.id}>
						<a className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
							href={`/dashboard/chat/${chatIDconstructot(
								sessionid,
								friend.id
							)}`}
                        >{friend.name}</a>
                        {
                            unseenMessgaesCount > 0 ? (
                                <div className="bg-indigo-600 font-medium text-xs text-whit w-4 h-4 rounded-full flex justify-center items-center">{unseenMessgaesCount}</div> 
                            ):null
                        }
					</li>
				);
			})}
		</ul>
	);
};

export default SidebarChatList;
