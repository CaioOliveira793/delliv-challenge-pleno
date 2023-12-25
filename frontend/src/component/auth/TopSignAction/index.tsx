import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ButtonColor, buttonClass } from '@/component/form/ButtonHelper';
import TypographyStyle from '@/style/typography.module.css';
import TopSignActionStyle from './TopSignAction.module.css';

export interface TopSignActionProps {
	actionText?: string;
	linkColor?: ButtonColor;
	linkTo: string;

	children?: ReactNode;
}

export default function TopSignAction({
	actionText,
	linkColor,
	linkTo,
	children,
}: TopSignActionProps) {
	return (
		<div className={TopSignActionStyle.container}>
			<p className={TypographyStyle.body2}>{actionText}</p>
			<Link
				to={linkTo}
				className={buttonClass({ variant: 'outlined', size: 'large', color: linkColor })}
			>
				{children}
			</Link>
		</div>
	);
}
