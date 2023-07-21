"use client";
import { pusherclient } from "@/lib/pusher";
import { chatIDconstructot, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

interface SidebarChatListProps {
	friends: User[];
	sessionid: string;
}

interface ExtendedMessage extends Message {
	senderImg: string;
	senderName: string;
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

	useEffect(() => {
		pusherclient.subscribe(toPusherKey(`user:${sessionid}:chats`));
		pusherclient.subscribe(toPusherKey(`user:${sessionid}:friends`));

		const chatHandler = (message: ExtendedMessage) => {
			const shouldNotify =
				pathname !==
				`dashboard/chat/${chatIDconstructot(sessionid, message.senderId)}`;

			if (!shouldNotify) return;

			toast.custom((t) => (
				<UnseenChatToast
					t={t}
					sessionId={sessionid}
					senderId={message.senderId}
					senderImg={message.senderImg}
					senderMessage={message.text}
					senderName={message.senderName}
				/>
			));

			setUnseenMessages((prev) => [...prev, message]);
		};

		const newfriendHandler = (message: Message) => {
			router.refresh();
		};

		pusherclient.bind("new_message", chatHandler);
		pusherclient.bind("new_friend", newfriendHandler);

		return () => {
			pusherclient.unsubscribe(toPusherKey(`user:${sessionid}:chats`));
			pusherclient.unsubscribe(toPusherKey(`user:${sessionid}:friends`));
			pusherclient.unbind("incoming-message", newfriendHandler);
		};
	}, [pathname,sessionid,router]);

	return (
		<ul role='list' className='max-h-25rem overflow-y-auto -mx-2 space-y-1'>
			{friends.sort().map((friend) => {
				const unseenMessgaesCount = unseenMessages.filter((message) => {
					return message.senderId === friend.id;
				}).length;
				return (
					<li key={friend.id}>
						<a
							className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
							href={`/dashboard/chat/${chatIDconstructot(
								sessionid,
								friend.id
							)}`}
						>
							{friend.name}
							{unseenMessgaesCount > 0 ? (
							<div className='bg-indigo-600 p-2 text-white font-medium text-xs text-whit w-4 h-4 rounded-full flex justify-center items-center'>
								{unseenMessgaesCount}
							</div>
						) : null}
						</a>
				
					</li>
				);
			})}
		</ul>
	);
};

export default SidebarChatList;
