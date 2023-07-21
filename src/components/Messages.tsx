"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Message } from "@/lib/validations/message";
import { cn, toPusherKey } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { pusherclient } from "@/lib/pusher";

interface MessagesProps {
	initialMessages: Message[];
	sessionId: string;
	sessionImg: string | null | undefined;
	chatPartner: User;
	chatid: string;
}

//messages

const Messages: FC<MessagesProps> = ({
	initialMessages,
	chatid,
	sessionId,
	sessionImg,
	chatPartner,
}) => {
	const [messages, setMessages] = useState(initialMessages);

	function formatTimestamps(timestamp: number) {
		return format(timestamp, "HH:MM");
	}
	const scrollDownRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		pusherclient.subscribe(toPusherKey(`chat:${chatid}`));

		const messageHandler = (message: Message) => {
			setMessages((prev) => [message, ...prev]);
		};
		pusherclient.bind("incoming-message", messageHandler);

		return () => {
			pusherclient.unsubscribe(toPusherKey(`chat:${chatid}`));
			pusherclient.unbind("incoming-message", messageHandler);
		};
	}, []);

	return (
		<div
			id='messages'
			className='flex h-full flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
		>
			<div ref={scrollDownRef} />
			{messages.map((message, index) => {
				const isCurrentUSer = message.senderId === sessionId;
				const hasNextMessageFromSameUser =
					messages[index - 1]?.senderId === messages[index].senderId;

				return (
					<div
						className='chat-meesage'
						key={`${message.id}-${message.timestamp}`}
					>
						<div
							className={cn("flex  items-end", {
								"justify-end ": isCurrentUSer,
							})}
						>
							<div
								className={cn(
									"flex flex-col space-y-2 text-base max-w-xs mx-2",
									{
										"order-1 items-end": isCurrentUSer,
										"order-2 item-start": !isCurrentUSer,
									}
								)}
							>
								<span
									className={cn("px-4 py-2 rounded-lg inline-block", {
										"bg-indigo-600 text-white": isCurrentUSer,
										"bg-gray-200 text-gray-900": !isCurrentUSer,
										"rounded-br-none":
											!hasNextMessageFromSameUser && isCurrentUSer,
										"rounded-bl-none":
											!hasNextMessageFromSameUser && !isCurrentUSer,
									})}
								>
									{message.text}{" "}
									<span className='ml-2 text-xs'>
										{formatTimestamps(message.timestamp)}
									</span>
								</span>
							</div>
							<div
								className={cn("relative w-6 h-6", {
									"order-2": isCurrentUSer,
									"order-1": !isCurrentUSer,
									invisible: hasNextMessageFromSameUser,
								})}
							>
								<Image
									fill
									src={
										isCurrentUSer ? (sessionImg as string) : chatPartner.image
									}
									alt='profile picture'
									referrerPolicy='no-referrer'
									className='rounded-full'
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Messages;
