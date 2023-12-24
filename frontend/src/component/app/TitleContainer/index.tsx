import AppTitle from '@/component/app/AppTitle';
import TitleContainerStyle from '@/component/app/TitleContainer/TitleContainer.module.css';
import { classes } from '@/style/helper';
import TypographyStyle from '@/style/typography.module.css';

export interface TitleContainerProps {
	message: string;

	className?: string;
}

export default function TitleContainer({ message, className }: TitleContainerProps) {
	return (
		<div className={classes(TitleContainerStyle.title_container, className)}>
			<AppTitle />
			<p className={TypographyStyle.body2}>{message}</p>
		</div>
	);
}
