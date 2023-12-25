import { HTMLAttributes } from 'react';
import ErrorListStyle from './ErrorList.module.css';

export interface ErrorListProps extends HTMLAttributes<HTMLUListElement> {
	errors?: string[];
}

export default function ErrorList({ errors }: ErrorListProps) {
	return (
		<ul>
			{errors?.map(error => (
				<li key={error} className={ErrorListStyle.error__list}>
					{error}
				</li>
			))}
		</ul>
	);
}
