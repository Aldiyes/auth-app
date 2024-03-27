import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

async function SettingsPage() {
	const session = await auth();
	return (
		<div className="h-full w-full flex flex-col items-center justify-center">
			<form
				action={async () => {
					'use server';
					await signOut();
				}}
			>
				<Button type="submit">Sign Out</Button>
			</form>
			<pre>{JSON.stringify(session, null, 2)}</pre>
		</div>
	);
}

export default SettingsPage;
