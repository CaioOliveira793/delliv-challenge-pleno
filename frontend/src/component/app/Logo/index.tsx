import { classes } from '@/style/helper';
import TypographyStyle from '@/style/typography.module.css';
import LogoStyle from './Logo.module.css';

export default function Logo() {
	return (
		<strong className={classes(LogoStyle.logo_text, TypographyStyle.subtitle)}>
			Order Tracker
		</strong>
	);
}
