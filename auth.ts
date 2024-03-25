import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { getUserById } from '@/data/user';
import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
// ! import { type UserRole } from '@prisma/client'; // not use for now

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	callbacks: {
		// TODO: fixed latter
		// async signIn({ user }) {
		// 	const existingUser = await getUserById(user.id);
		// 	if (!existingUser || !existingUser?.emailVerified) {
		// 		return false;
		// 	}
		// 	return true;
		// },
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role; // * as UserRole; // uncoment if it use
			}

			console.log('[SESSION-TOKEN] - ', { SessionToken: token });
			console.log('[SESSION-SESSION] - ', session);

			return session;
		},
		async jwt({ token, user }) {
			if (!token.sub) {
				return token;
			}

			const existingUser = await getUserById(token.sub);
			if (!existingUser) {
				return token;
			}

			token.role = existingUser.role;

			console.log('[JWT-USER] - ', user);
			console.log('[JWT-TOKEN] - ', token);
			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
});