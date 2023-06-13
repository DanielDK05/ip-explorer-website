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

export function validateNetmaskStr(str: string): boolean {
	const numericMask = StringToNumericIP(str);

	if (!numericMask) return false;

	const binStr = (numericMask >>> 0).toString(2);
	const regex = /^(1+)(0+)$/;

	return regex.test(binStr);
}

export function validateIpStr(str: string): boolean {
	const ipRegex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/;

	return ipRegex.test(str);
}

export function ipHasCIDR(str: string): boolean {
	const ipHasCIDRRegex =
		/^(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/([0-9]|[1-2][0-9]|3[0-2]))$/;

	return ipHasCIDRRegex.test(str);
}

export function splitIPAndCIDR(str: string): { ip: number; mask: number } | undefined {
	// Captures ip and cidr, in their own respective groups
	const ipRegex =
		/^((?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))(?:\/([0-9]|[1-2][0-9]|3[0-2]))$/;

	const matches = str.match(ipRegex);

	if (!matches) return undefined;

	const ip = StringToNumericIP(matches[1]);
	const cidr = cidrToNumericMask(parseInt(matches[2]));

	if (!ip || !cidr) return undefined;

	return { ip: ip, mask: cidr };
}

export function cidrToNumericMask(cidr: number): number {
	cidr = Math.max(0, Math.min(32, cidr));

	const binStr = '1'.repeat(cidr) + '0'.repeat(32 - cidr);

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

export function createSubnets(
	subnetAmount: number,
	ip: number,
	mask: number
): { ip: number; mask: number }[] {
	ip = getNetworkAddress(ip, mask);
	const subnetBits = calculateSubnetBits(subnetAmount);
	const newMask = addBitsToMask(mask, subnetBits);
	const subnetBitsDifference = mask ^ newMask;

	let subnetArr: { ip: number; mask: number }[] = [];
	for (let i = 0; i < Math.pow(2, subnetBits); i++) {
		const curSubnetBit = subnetBitsDifference & (i << (32 - countOnes(newMask)));
		const subnetIP = (ip | curSubnetBit) >>> 0;
		subnetArr.push({
			ip: getNetworkAddress(subnetIP, newMask),
			mask: newMask
		});
	}

	return subnetArr;
}

function calculateSubnetBits(subnetAmount: number): number {
	return Math.ceil(Math.log2(subnetAmount));
}

function addBitsToMask(mask: number, bits: number): number {
	const netmaskOnes = countOnes(mask);
	const bitmask = (1 << bits) - 1;

	// Shift the bitmask by the number of ones in the netmask
	const shiftedBitmask = bitmask << (32 - netmaskOnes - bits);

	// Apply the shifted bitmask to the netmask
	return (mask | shiftedBitmask) >>> 0;
}

function countOnes(num: number) {
	let count = 0;
	while (num) {
		count += num & 1;
		num = num >>> 1;
	}
	return count;
}
