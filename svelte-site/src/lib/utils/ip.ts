export function StringToNumericIP(str: string): number | undefined {
	const ipRegex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

	if (!str.match(ipRegex)) return undefined;

	const binStr = str
		.split('.')
		.map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
		.join('');

	return parseInt(binStr, 2);
}

export function getNetworkAddress(ip: number, mask: number): number {
	return (ip & mask) >>> 0;
}

export function getBroadcastAddress(ip: number, mask: number): number {
	const invertedMask = ~mask >>> 0;
	const broadcastAddress = ip | invertedMask;
	return broadcastAddress >>> 0;
}

export function getIpRange(ip: number, mask: number): { start: number; end: number } {
	return {
		start: getNetworkAddress(ip, mask) + 1,
		end: getBroadcastAddress(ip, mask) - 1
	};
}

export function NumericIPToString(ip: number): string {
	const octets: number[] = [];
	for (let i = 24; i >= 0; i -= 8) {
		const octet = (ip >>> i) & 255;
		octets.push(octet);
	}
	return octets.join('.');
}
