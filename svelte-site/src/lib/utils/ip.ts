export function validateIpString(ipStr: string, shouldIncludeCIDR: boolean): boolean {
	const ipRegex =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
	const cidrRegex = /(?:\/(3[0-2]|[12]?[0-9]))?$/;

	const validationRegex = new RegExp(ipRegex.source + (shouldIncludeCIDR ? cidrRegex.source : ''));

	return validationRegex.test(ipStr);
}

export function matchIpCIDRWithNetmask(cidr: number, netMask: string) {
	return createNetmaskFromCIDR(cidr) === netMask;
}

export function validateNetmaskStr(netMaskStr: string): boolean {
	if (!validateIpString(netMaskStr, false)) return false;

	const netMaskByteStr = netMaskStr
		.split('.')
		.map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
		.join('');
	const netmaskRegex = /^(1{1,31}0*)$/;

	return netmaskRegex.test(netMaskByteStr);
}

export function ipStrHasCIDR(ipStr: string): boolean {
	const netMaskMatch = ipStr.match(/\/(3[0-2]|[12]?[0-9])$/);

	return netMaskMatch ? true : false;
}

export function extractNetmaskFromIpStr(ipStr: string): string | undefined {
	const netMaskMatch = ipStr.match(/\/(3[0-2]|[12]?[0-9])$/);

	if (!netMaskMatch) return undefined;

	const prefixLength = parseInt(netMaskMatch[1]);
	const MAX_PREFIX = 32; // 4 bytes

	if (prefixLength > MAX_PREFIX || prefixLength < 0) return undefined;

	let bitStr = '1'.repeat(prefixLength) + '0'.repeat(MAX_PREFIX - prefixLength);

	const octetArr: number[] = [];
	// loop through every byte
	for (let i = 0; i < bitStr.length; i += 8) {
		const byteSubStr = bitStr.substring(i, i + 8);

		octetArr.push(parseInt(byteSubStr, 2));
	}

	return octetArr.join('.');
}

export function extractCIDRFromIpStr(ipStr: string): number | undefined {
	const netMaskMatch = ipStr.match(/\/(3[0-2]|[12]?[0-9])$/);

	return netMaskMatch ? parseInt(netMaskMatch[1]) : undefined;
}

export function createNetmaskFromCIDR(CIDR: number): string | undefined {
	const MAX_PREFIX = 32; // 4 bytes

	if (CIDR > MAX_PREFIX || CIDR < 0) return undefined;

	let bitStr = '1'.repeat(CIDR) + '0'.repeat(MAX_PREFIX - CIDR);

	const octetArr: number[] = [];
	// loop through every byte
	for (let i = 0; i < bitStr.length; i += 8) {
		const byteSubStr = bitStr.substring(i, i + 8);

		octetArr.push(parseInt(byteSubStr, 2));
	}

	return octetArr.join('.');
}

export function convertIpStrToBinaryString(ipStr: string): string | undefined {
	if (!validateIpString(ipStr, false)) return undefined;

	return ipStr
		.split('.')
		.map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
		.join('');
}

export function convertBinaryStringToIpStr(binStr: string): string | undefined {
	if (binStr.length !== 32) return undefined;

	const octetArr: number[] = [];

	for (let i = 0; i < binStr.length; i += 8) {
		const byteSubStr = binStr.substring(i, i + 8);

		octetArr.push(parseInt(byteSubStr, 2));
	}

	const ipStr = octetArr.join('.');

	return validateIpString(ipStr, true) ? ipStr : undefined;
}

export function getNetworkAddress(ipStr: string, netMask: string): string | undefined {
	if (!validateIpString(ipStr, false) || !validateIpString(netMask, false)) return undefined;

	const binIpStr = convertIpStrToBinaryString(ipStr);
	const binNetMask = convertIpStrToBinaryString(netMask);

	if (!binIpStr || !binNetMask) return undefined;

	let binNetworkAddress = '';
	for (let i = 0; i < 32; i++) {
		binNetworkAddress += parseInt(binIpStr[i]) * parseInt(binNetMask[i]);
	}
	return convertBinaryStringToIpStr(binNetworkAddress);
}

export function getBroadcastAddress(ipStr: string, netMask: string): string | undefined {
	if (!validateIpString(ipStr, false) || !validateIpString(netMask, false)) return undefined;

	const binIpStr = convertIpStrToBinaryString(ipStr);
	const binNetMask = convertIpStrToBinaryString(netMask);

	if (!binIpStr || !binNetMask) return undefined;

	let binNetworkAddress = '';
	let i = 0;
	while (binNetMask[i] !== '0') {
		binNetworkAddress += parseInt(binIpStr[i]) * parseInt(binNetMask[i]);
		i++;
	}
	while (i < 32) {
		binNetworkAddress += '1';
		i++;
	}

	return convertBinaryStringToIpStr(binNetworkAddress);
}

export function removeCIDRFromIpStr(ipStr: string): string | undefined {
	const netMaskMatch = ipStr.match(/\/(3[0-2]|[12]?[0-9])$/);

	if (!netMaskMatch) return undefined;

	return ipStr.replace(netMaskMatch[0], '');
}

export function getIpRange(
	ipStr: string,
	netMask: string
): { start: string; end: string } | undefined {
	const networkAddress = getNetworkAddress(ipStr, netMask);
	const broadcastAddress = getBroadcastAddress(ipStr, netMask);

	if (!broadcastAddress || !networkAddress) return undefined;

	const start = networkAddress
		.split('.')
		.map((octet, index) => (index === 3 ? parseInt(octet) + 1 : octet))
		.join('.');
	const end = broadcastAddress
		.split('.')
		.map((octet, index) => (index === 3 ? parseInt(octet) - 1 : octet))
		.join('.');

	return {
		start: start,
		end: end
	};
}
