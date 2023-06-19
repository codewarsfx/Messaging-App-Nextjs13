import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { redirect } from "next/dist/server/api-utils";

function getGoogleCredentials() {
	const clientID = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

	if (!clientID || clientID.length == 0)
		throw new Error("Google credentials missing");
	if (!clientSecret || clientSecret.length == 0)
		throw new Error("Google credentials missing");

	return {
		clientID,
		clientSecret,
	};
}

export const authOptions: NextAuthOptions = {
	adapter: UpstashRedisAdapter(db),
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
	},
	providers: [
		GoogleProvider({
			clientId: getGoogleCredentials().clientID,
			clientSecret: getGoogleCredentials().clientSecret,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			const dbUser = (await db.get(`user:${token.id}`)) as User | null;

			if (!dbUser) {
				token.id = user!.id;
				return token;
			}

			return {
				id: dbUser.id,
				email: dbUser.email,
				picture: dbUser.image,
				name: dbUser.name,
			};
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.image = token.picture;
				session.user.email = token.email;
			}
			return session;
		},
		redirect() {
			return "/dashboard";
		},
	},
};
