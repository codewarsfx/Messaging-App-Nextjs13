import ChatInput from "@/components/ChatIput";
import Messages from "@/components/Messages";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
	params: {
		chatid: string;
	};
}

async function getChatMessages(chatid: string) {
	try {
		const result: string[] = await fetchRedis(
			"zrange",
			`chat:${chatid}messages`,
			0,
			-1
		);

		const dbMessage = result.map((message) => JSON.parse(message) as Message);

		const reversedDbMessage = dbMessage.reverse();

		const messages = messageArrayValidator.parse(reversedDbMessage);

		return messages;
	} catch (e) {
		notFound();
	}
}

const page = async ({ params }: pageProps) => {
	const { chatid } = params;

	const session = await getServerSession(authOptions);

	if (!session) return notFound();

	const { user } = session;

	const [userId1, userId2] = chatid.split("--");

	if (user.id !== userId1 && user.id !== userId2) {
		notFound();
	}

	const chatPartnerID = user.id === userId1 ? userId2 : userId1;

	const chatPartner = (await db.get(`user:${chatPartnerID}`)) as User;

	const initialMessages = await getChatMessages(chatid);

	return (
		<div className='justify-between h-full max-h-[calc(100vh - 6rem)] flex flex-col flex-1 '>
			<div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
				<div className='relative flex items-center space-x-4'>
					<div className='relative '>
						<div className='relative w-8 sm:w-12 h-8 sm:h-12 '>
							<Image
								fill
								referrerPolicy='no-referrer'
								src={chatPartner.image}
								alt={`${chatPartner.name} profile picture}`}
								className='rounded-full'
							/>
						</div>
					</div>
					<div className='flex flex-col leading-tight'>
						<div className='text-xl flex items-center'>
							<span className='text-gray-700 mr-3 font-semibold'>
								{chatPartner.name}
							</span>
						</div>
						<span className='text-sm text-grat-600'>{chatPartner.email}</span>
					</div>
				</div>
			</div>
			<Messages sessionId={session.user.id} initialMessages={initialMessages} />
			<ChatInput chatid={chatid} chatPartner={chatPartner} />
		</div>
	);
};

export default page;
