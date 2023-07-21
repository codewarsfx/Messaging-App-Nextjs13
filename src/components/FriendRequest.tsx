"use client";
import { Check, UserPlus, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { pusherclient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface FriendRequestProps {
	initialIncomingRequests: IncomingFriendRequests[];
	sessionID: string;
}

const FriendRequest: FC<FriendRequestProps> = ({
	initialIncomingRequests,
	sessionID,
}) => {
	const [incomingRequest, setIncomingRequest] = useState<
		IncomingFriendRequests[]
	>(initialIncomingRequests);

	useEffect(() => {
		pusherclient.subscribe(
			toPusherKey(`user:${sessionID}:incoming_friend_requests`)
		);

		const friendRequestHandler = ({
			senderID,
			senderEmail,
		}: IncomingFriendRequests) => {
			setIncomingRequest((prev) => [
				...prev,
				{
					senderID,
					senderEmail,
				},
			]);
		};
		pusherclient.bind("incoming_friend_requests", friendRequestHandler);

		return () => {
			pusherclient.unsubscribe(
				toPusherKey(`user:${sessionID}:incoming_friend_requests`)
			);
			pusherclient.unbind("incoming_friend_requests", friendRequestHandler);
		};
	}, [sessionID]);

	const router = useRouter();

	const acceptFriend = async (senderID: string) => {
		try {
			await axios.post("/api/friends/accept", {
				id: senderID,
			});
			setIncomingRequest((prev) =>
				prev.filter((request) => request.senderID !== senderID)
			);
			router.refresh();
		} catch (error) {}
	};

	const denyFriend = async (senderID: string) => {
		try {
			await axios.post("/api/friends/deny", {
				id: senderID,
			});
			setIncomingRequest((prev) =>
				prev.filter((request) => request.senderID !== senderID)
			);
			router.refresh();
		} catch (error) {
			toast.error("Error Accepting friend Request");
		}
	};

	return (
		<>
			{incomingRequest.length === 0 ? (
				<p className='text-sm text-zinc-500'>Nothing to show here...</p>
			) : (
				incomingRequest.map((request) => (
					<div key={request.senderID} className='flex gap-4 items-center'>
						<UserPlus className='text-black' />
						<p className='font-medium text-lg'>{request.senderEmail}</p>
						<button
							onClick={() => acceptFriend(request.senderID)}
							aria-label='accept friend'
							className='w-8 h-8 rounded-full transition hover:shadow-md bg-indigo-600 hover:bg-indigo-700 grid place-items-center '
						>
							<Check className='font-semibold text-white w-3/4 h-3/4 ' />
						</button>
						<button
							onClick={() => denyFriend(request.senderID)}
							aria-label='deny friend'
							className='w-8 h-8 rounded-full transition hover:shadow-md bg-red-600 hover:bg-red-700 grid place-items-center '
						>
							<X className='font-semibold text-white w-3/4 h-3/4 ' />
						</button>
					</div>
				))
			)}
		</>
	);
};

export default FriendRequest;
