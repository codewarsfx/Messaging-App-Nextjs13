import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherserver = new PusherServer({
	appId: process.env.PUSHER_APP_ID!,
	key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
	secret: process.env.PUSHER_APP_SECRET!,
	cluster: "mt1",
	useTLS: true, //encrypted data traffic
});

export const pusherclient = new PusherClient(
	process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
	{
		cluster: "mt1",
	}
);
