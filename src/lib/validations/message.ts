import { z } from "zod";

export const MessageValidator = z.object({
	id: z.string(),
	senderId: z.string(),
	text: z.string(),
	timestamp: z.number(),
});



 export const messageArrayValidator = z.array(MessageValidator)

export type Message = z.infer<typeof MessageValidator>
