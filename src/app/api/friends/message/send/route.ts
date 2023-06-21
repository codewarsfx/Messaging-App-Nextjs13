import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
	try {
		const { text, chatid }: { text: string; chatid: string } = await req.json();

		const session = await getServerSession(authOptions);

		if (!session) return new Response("unauthorized", { status: 401 });

		const [userId1, userId2] = chatid.split("--");

		if (session.user.id !== userId1 && session.user.id !== userId2)
			return new Response("unauthorized", { status: 401 });

		const chatPartner = session.user.id === userId1 ? userId2 : userId1;

		const friendList = (await fetchRedis(
			`smembers`,
			`user:${session.user.id}:friends`
		)) as string[];

		const isFriend = friendList.includes(chatPartner);

		if (!isFriend) return new Response("unauthorized", { status: 401 });

		const sender = (await fetchRedis(
			`get`,
			`user:${session.user.id}`
		)) as string;
        const parsedSender = JSON.parse(sender) as User;
        
        
	} catch (error) {}
}
