import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import { db } from '@/lib/db';
import { PrismaAdapter } from '@auth/prisma-adapter';

import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';
import { getUserById } from '@/data/user';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: {
					id: user.id,
				},
				data: {
					emailVerified: new Date(),
				},
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			//& Allow OAuth without email verification
			if (account?.provider !== 'credentials') {
				return true;
			}

			//& Prevend sign in with email verification
			const existingUser = await getUserById(user.id);
			if (!existingUser?.emailVerified) {
				return false;
			}

			//&
			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					existingUser.id
				);

				if (!twoFactorConfirmation) {
					return false;
				}

				//& delete two factor confirmation for next sign in
				await db.twoFactorConfirmation.delete({
					where: {
						id: twoFactorConfirmation.id,
					},
				});
			}
			return true;
		},

		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
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
