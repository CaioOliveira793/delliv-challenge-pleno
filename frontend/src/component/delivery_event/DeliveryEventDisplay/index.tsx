import { ShortDateTimeFormatter } from '@/formatter/DateTimeFormatter';
import TypographyStyle from '@/style/typography.module.css';
import DeliveryEventDisplayStyle from './DeliveryEventDisplay.module.css';

export interface DeliveryEvent {
	id: string;
	created: Date;
	creator_id: string;
	order_id: string;
	status: string;
	message: string | null;
}

export interface DeliveryEventDisplayProps {
	event: DeliveryEvent;
}

export default function DeliveryEventDisplay({ event }: DeliveryEventDisplayProps) {
	return (
		<div className={DeliveryEventDisplayStyle.container}>
			<strong className={DeliveryEventDisplayStyle.event_id}>{'#' + event.id}</strong>
			<p>
				<span className={TypographyStyle.attr_name}>Status: </span>
				<span className={TypographyStyle.attr_value}>{event.status}</span>
			</p>
			{event.message ? (
				<p>
					<span className={TypographyStyle.attr_name}>Mensagem: </span>
					<span className={TypographyStyle.attr_value}>{event.message}</span>
				</p>
			) : null}
			<p className={TypographyStyle.caption}>Em {ShortDateTimeFormatter.format(event.created)}</p>
		</div>
	);
}
