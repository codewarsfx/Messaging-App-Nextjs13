import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { id: idToRemove } = z
			.object({
				id: z.string(),
			})
			.parse(body);

		const session = await getServerSession(authOptions);
		if (!session) return new Response("unauthorized", { status: 400 });

		db.srem(`user:${session.user.id}:incoming_friend_requests`, idToRemove);

		return new Response("OK");
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response("invalid payload", { status: 422 });
		}

		return new Response("invalid request", { status: 400 });
	} 
}
