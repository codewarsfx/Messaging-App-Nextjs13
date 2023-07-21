import Button from "@/components/ui/button";
import { getFriendByUserID } from "@/helpers/get-friends-by-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatIDconstructot } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {}

const page = async ({}) => {
	const session = await getServerSession(authOptions);

	if (!session) notFound();

	const friends = await getFriendByUserID(session.user.id);

	const friendsWithLastMessage = await Promise.all(
		friends.map(async (friend) => {
			const [lastMessageRaw] = (await fetchRedis(
				"zrange",
				`chat:${chatIDconstructot(session.user.id, friend.id)}:messsages`,
				-1,
				-1
			)) as string[];
		
			const lastMessage = lastMessageRaw && JSON.parse(lastMessageRaw);

			return {
				...friend,
				lastMessage,
			};
		})
	);

	return (
		<div className='container py-12'>
			<h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
			{friendsWithLastMessage.length === 0 ? (
				<p>Nothing to show</p>
			) : (
				friendsWithLastMessage.map((friend) => (
					<div
						key={friend.id}
						className='relative border bg-zinc-50 border-zinc-200 p-3 rounded-md'
					>
						<div className='absolute right-4 inset-y-0 flex items-center'>
							<ChevronRight className='h-7 w-7 text-zinc-400' />
						</div>
						<Link
							href={`/dashboard/chat/${chatIDconstructot(
								session.user.id,
								friend.id
							)}`}
							className='sm:flex relative'
						>
							<div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
								<div className='relative h-6 w-6'>
									<Image
										fill
										src={friend.image}
										referrerPolicy='no-referrer'
										className='rounded-full'
										alt={`${friend.name} profile picture`}
									/>
								</div>
							</div>
							<div className=''>
								<h4 className='text-lg font-semibold'>{friend.name}</h4>
								<p className='max-w-md mt-1'>
									<span className='text-zinc-400 mr-2'>
										{friend.lastMessage.senderId === session.user.id
											? "You"
											: ""}
									</span>
									{friend.lastMessage.text}
								</p>
							</div>
						</Link>
					</div>
				))
			)}
		</div>
	);
};

export default page;
