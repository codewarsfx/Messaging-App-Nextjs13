"use client";
import axios from "axios";
import { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import ReactTextareaAutosize from "react-textarea-autosize";
import Button from "./ui/button";

interface ChatIputProps {
	chatPartner: User;
	chatid: string;
}

const ChatInput: FC<ChatIputProps> = ({ chatPartner, chatid }) => {
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const sendMessage = async () => {
		setIsLoading(true);
		try {
			await axios.post("/api/message/send", {
				text: input,
				chatid,
			});
			setInput("");
			textareaRef.current?.focus();
		} catch (e) {
			toast.error("something went wrong");
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className='border-t border-gray-200  pt-4 sm:mb-0 px-4 mb-2'>
			<div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600'>
				<ReactTextareaAutosize
					ref={textareaRef}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={`Message ${chatPartner.name}`}
					className='block w-full resize-none  text-gray-900 border-0 bg-transparent placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6 '
				/>
				<div
					onClick={() => textareaRef.current?.focus()}
					className='py-2'
					aria-hidden='true'
				>
					<div className='py-px'>
						<div className='h-9' />
					</div>
				</div>
				<div className='absolute right-0 bottom-0 justify-between flex py-2 pl-3 pr-2'>
					<div className='flex-shrink-0'>
						<Button isLoading={isLoading} type='submit' onClick={sendMessage}>
							Post
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInput;
