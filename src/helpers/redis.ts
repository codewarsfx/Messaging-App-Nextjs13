const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(
	command: Commands,
	...args: (string | number)[]
) {
	const commandUrl = `${UPSTASH_REDIS_REST_URL}/${command}/${args.join("/")}`;

	const response = await fetch(commandUrl, {
		headers: {
			Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
		},
		cache: "no-store",
	});

	if (!response.ok) {
		throw new Error(`Error executing command: ${response.statusText}`);
	}

	const data = await response.json();

	return data.result;
}
