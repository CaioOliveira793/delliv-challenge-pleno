export function makeObjectPath(items: Array<string | number>): string | null {
	if (items.length === 0) return null;

	let path = '';
	for (const item of items) {
		if (typeof item === 'number') path += '[' + item + ']';
		else path += '.' + item;
	}
	return path;
}
