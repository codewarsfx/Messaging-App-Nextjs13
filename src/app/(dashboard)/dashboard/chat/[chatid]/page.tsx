import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
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

	return <></>;
};

export default page;
