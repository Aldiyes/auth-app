import { auth, signOut } from '@/auth';

async function SettingsPage() {
	const session = await auth();
	return (
		<div>
			<form
				action={async () => {
					'use server';
					await signOut();
				}}
			>
				<button type="submit">Sign Out</button>
			</form>

			{JSON.stringify(session)}
		</div>
	);
}

export default SettingsPage;
