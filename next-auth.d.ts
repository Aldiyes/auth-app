// import { JWT } from '@auth/core/jwt';
import { UserRole } from '@prisma/client';
import { default as NextAuth, User, type DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['USER'] & {
	role: UserRole;
};

declare module 'next-auth' {
	interface Session {
		user: ExtendedUser;
	}
}
