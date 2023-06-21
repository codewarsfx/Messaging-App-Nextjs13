"use client";
import { FC, useRef, useState } from "react";
import { Message } from "@/lib/validations/message";
import { cn } from "@/lib/utils";

interface MessagesProps {
	initialMessages: Message[];
	sessionId: string;
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId }) => {
	const [messages, setMessages] = useState(initialMessages);
	const scrollDownRef = useRef<HTMLDivElement | null>(null);
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
							className={cn("flex items-end", {
								"justify-end": isCurrentUSer,
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
										"bottom-br-none":
											!hasNextMessageFromSameUser && isCurrentUSer,
										"bottom-bl-none":
											!hasNextMessageFromSameUser && !isCurrentUSer,
									})}
								>
									{message.text}{" "}
									<span className='ml-2 text-xs'>{message.timestamp}</span>
								</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Messages;
