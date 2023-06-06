export function validateIpString(ipStr: string): { isValid: boolean; netMask: string | undefined } {
	const isValid: boolean =
		/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(3[0-2]|[12]?[0-9]))?$/.test(
			ipStr
		);

	const netMaskMatch = ipStr.match(/\/(3[0-2]|[12]?[0-9])$/);
	let netMask = undefined;

	if (netMaskMatch) netMask = netMaskMatch[1];

	return {
		isValid: isValid,
		netMask: netMask
	};
}

function hasLeadingSpaces(str: string) {
	return /^\s|\s$/.test(str);
}

function isNumeric(str: string) {
	return /^\d+$/.test(str);
}
