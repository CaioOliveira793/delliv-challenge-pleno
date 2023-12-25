export const DateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	second: '2-digit',
});

export const ShortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
	dateStyle: 'short',
});

export const ShortDateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
	dateStyle: 'short',
	timeStyle: 'short',
});

export const ShortRelativeTimeFormatter = new Intl.RelativeTimeFormat('pt-BR', { style: 'short' });

export function formatLastUpdated(formatter: Intl.DateTimeFormat, updated: Date): string {
	return 'Última atualização em ' + formatter.format(updated);
}

export function formatTimeMetadata(created: Date, updated: Date | null): string {
	let buff = 'Criado em ';
	buff += ShortDateTimeFormatter.format(created);
	buff += '.';
	if (updated && created !== updated) {
		buff += ' ';
		buff += formatLastUpdated(ShortDateTimeFormatter, updated);
	}
	return buff;
}
