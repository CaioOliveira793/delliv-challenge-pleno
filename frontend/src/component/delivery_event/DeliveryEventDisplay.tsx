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
		<div>
			<p>Status: {event.status}</p>
			{event.message ? <p>Mensagem: {event.message}</p> : null}
			<p>Em {event.created.toLocaleString()}</p>
		</div>
	);
}
