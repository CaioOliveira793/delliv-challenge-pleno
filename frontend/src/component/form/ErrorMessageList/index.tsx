import ErrorMessageListStyle from './ErrorMessageList.module.css';

export interface ErrorMessageListProps {
	errors?: string[];
}

export default function ErrorMessageList({ errors }: ErrorMessageListProps) {
	return (
		<ul>
			{errors?.map(error => (
				<li key={error} className={ErrorMessageListStyle.error_message_list}>
					{error}
				</li>
			))}
		</ul>
	);
}
