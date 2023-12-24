import TopNavbar from '@/component/app/TopNavbar';
import TitleContainer from '@/component/app/TitleContainer';
import ContainerStyle from '@/style/util/container.module.css';
import RootStyle from '@/style/page/root.module.css';
import { classes } from '@/style/helper';

export default function Root() {
	return (
		<main id="root" className={classes(RootStyle.main_content, ContainerStyle.main_content)}>
			<TopNavbar />
			<TitleContainer
				message="Seu app de rastreamento de pedidos."
				className={RootStyle.title_container}
			/>
		</main>
	);
}
