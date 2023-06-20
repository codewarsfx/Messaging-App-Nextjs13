import FriendRequest from "@/components/FriendRequest";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

const page = async ({}) => {
	const session = await getServerSession(authOptions);
	if (!session) notFound();

	const incomingIds = (await fetchRedis(
		"smembers",
		`user:${session.user.id}:incoming_friend_requests`
	)) as string[];

	const incomingFriendRequests = await Promise.all(
		incomingIds.map(async (id) => {
			const sender = await fetchRedis("get", `user:${id}`);

			return {
				senderID: JSON.parse(sender).id,
				senderEmail: JSON.parse(sender).email,
			};
		})
	);

	return (
		<main className='pt-8'>
			<h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
			<div className='flex flex-col gap-4'>
				<FriendRequest
					sessionID={session.user.id}
					initialIncomingRequests={incomingFriendRequests}
				/>
			</div>
		</main>
	);
};

export default page;
