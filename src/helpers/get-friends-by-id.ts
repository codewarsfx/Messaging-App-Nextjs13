import { fetchRedis } from "./redis";

export async function getFriendByUserID(userID: string) {
	const friendIDs = (await fetchRedis(
		"smembers",
		`user:${userID}:friends`
	)) as string[];

	const friends = Promise.all(
		friendIDs.map(async (friendID) => {
			const friendData = (await fetchRedis("get", `user:${userID}`)) as User;

			return friendData;
		})
	);

	return friends;
}
