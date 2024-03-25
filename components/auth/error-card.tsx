import { CardWraper } from '@/components/auth/card-wraper';
import { AlertTriangleIcon } from 'lucide-react';

export const ErrorCard = () => {
	return (
		<CardWraper
			headerLabel="Oops! Something went wrong!"
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<div className="w-full flex justify-center items-center">
				<AlertTriangleIcon className="text-destructive" />
			</div>
		</CardWraper>
	);
};
