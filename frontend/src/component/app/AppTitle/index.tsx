import { classes } from '@/style/helper';
import TypographyStyle from '@/style/typography.module.css';
import AppTitleStyle from '@/component/app/AppTitle/AppTitle.module.css';

export default function AppTitle() {
	return <h1 className={classes(TypographyStyle.heading1, AppTitleStyle.title)}>Order Tracker</h1>;
}
