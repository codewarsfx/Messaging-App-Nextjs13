import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherserver } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { ZodError } from "zod";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { email: emailToAdd } = addFriendValidator.parse(body.email);

		const idToAdd = (await fetchRedis(
			"get",
			`user:email:${emailToAdd}`
		)) as string;

		if (!idToAdd) {
			return new Response("this person doesnt exist", { status: 400 });
		}

		const session = await getServerSession(authOptions);

		if (!session) {
			return new Response("unauthorized", { status: 401 });
		}
		if (idToAdd === session.user.id) {
			return new Response("you cannot add yourself", { status: 400 });
		}

		//check if user is already added
		const isAlreadyAdded = (await fetchRedis(
			"sismember",
			`user:${idToAdd}:incoming_friend_requests`,
			session.user.id
		)) as 0 | 1;
		if (isAlreadyAdded) {
			return new Response("Already added this user", { status: 400 });
		}

		const isAlreadyFriends = (await fetchRedis(
			"sismember",
			`user:${session.user.id}:friends`,
			idToAdd
		)) as 0 | 1;
		if (isAlreadyFriends) {
			return new Response("Already friends with this user", { status: 400 });
		}

		//send notification
		pusherserver.trigger(
			toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
			"incoming_friend_requests",
			{
				senderID: session.user.id,
				senderEmail: session.user.email,
			}
		);

		//send request
		db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);

		return new Response("ok");
	} catch (error) {
		if (error instanceof ZodError) {
			new Response("invalid request payload", { status: 422 });
		}
		return new Response("invalid request ", { status: 400 });
	}
}
