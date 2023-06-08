import { describe, it, expect } from 'vitest';
import {
	validateIpString,
	extractNetmaskFromIpStr,
	ipStrHasCIDR,
	createNetmaskFromCIDR,
	validateNetmaskStr,
	matchIpCIDRWithNetmask,
	extractCIDRFromIpStr,
	convertIpStrToBinaryString,
	getNetworkAddress,
	convertBinaryStringToIpStr,
	removeCIDRFromIpStr,
	getBroadcastAddress,
	getIpRange
} from './ip';

describe('test validateIpString()', () => {
	it('should return true', () => {
		const expectedResult = true;

		const testString1 = '10.169.131.69';
		expect(validateIpString(testString1, true)).toEqual(expectedResult);

		const testString2 = '192.168.10.1';
		expect(validateIpString(testString2, true)).toEqual(expectedResult);

		const testString3 = '0.0.0.0';
		expect(validateIpString(testString3, true)).toEqual(expectedResult);

		const testString4 = '255.255.255.255';
		expect(validateIpString(testString4, true)).toEqual(expectedResult);

		const testString10 = '192.168.10.01';
		expect(validateIpString(testString10, true)).toEqual(expectedResult);
	});

	it('should return false', () => {
		const expectedResult = false;

		const testString5 = '192.168.10';
		expect(validateIpString(testString5, true)).toEqual(expectedResult);

		const testString6 = '192.168.10.1.2';
		expect(validateIpString(testString6, true)).toEqual(expectedResult);

		const testString7 = '256.168.10.1';
		expect(validateIpString(testString7, true)).toEqual(expectedResult);

		const testString8 = '192.168.10.-1';
		expect(validateIpString(testString8, true)).toEqual(expectedResult);

		const testString9 = '192.168.10.1000';
		expect(validateIpString(testString9, true)).toEqual(expectedResult);

		const testString11 = '192.168.10.1.';
		expect(validateIpString(testString11, true)).toEqual(expectedResult);

		const testString12 = '.192.168.10.1';
		expect(validateIpString(testString12, true)).toEqual(expectedResult);

		const testString13 = '192..168.10.1';
		expect(validateIpString(testString13, true)).toEqual(expectedResult);

		const testString14 = '192.168..10.1';
		expect(validateIpString(testString14, true)).toEqual(expectedResult);

		const testString15 = '192.168.10..1';
		expect(validateIpString(testString15, true)).toEqual(expectedResult);

		const testString16 = '192.168.10.1.';
		expect(validateIpString(testString16, true)).toEqual(expectedResult);

		const testString17 = ' 192.168.10.1';
		expect(validateIpString(testString17, true)).toEqual(expectedResult);

		const testString18 = '192.168.10.1 ';
		expect(validateIpString(testString18, true)).toEqual(expectedResult);
	});
});

describe('test extractNetmaskFromIpStr()', () => {
	it('should return netmask for IP address with CIDR', () => {
		const expectedResult1 = '255.255.0.0';
		const expectedResult2 = '255.240.0.0';
		const expectedResult3 = '255.0.0.0';

		const testString1 = '192.168.0.0/16';
		expect(extractNetmaskFromIpStr(testString1)).toEqual(expectedResult1);

		const testString2 = '172.16.0.0/12';
		expect(extractNetmaskFromIpStr(testString2)).toEqual(expectedResult2);

		const testString3 = '10.0.0.0/8';
		expect(extractNetmaskFromIpStr(testString3)).toEqual(expectedResult3);
	});

	it('should return undefined for IP address without CIDR', () => {
		const expectedResult = undefined;

		const testString1 = '172.31.1.1';
		expect(extractNetmaskFromIpStr(testString1)).toEqual(expectedResult);

		const testString2 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334/64';
		expect(extractNetmaskFromIpStr(testString2)).toEqual(expectedResult);

		const testString3 = '192.168.1.0/';
		expect(extractNetmaskFromIpStr(testString3)).toEqual(expectedResult);

		const testString5 = '';
		expect(extractNetmaskFromIpStr(testString5)).toEqual(expectedResult);

		const testString6 = '10.1.1.1/24 extra';
		expect(extractNetmaskFromIpStr(testString6)).toEqual(expectedResult);
	});
});

describe('test ipStrHasCIDR()', () => {
	it('should return true for IP address with CIDR', () => {
		const testString1 = '192.168.0.0/16';
		expect(ipStrHasCIDR(testString1)).toEqual(true);

		const testString2 = '172.16.0.0/12';
		expect(ipStrHasCIDR(testString2)).toEqual(true);

		const testString3 = '10.0.0.0/8';
		expect(ipStrHasCIDR(testString3)).toEqual(true);
	});

	it('should return false for IP address without CIDR', () => {
		const testString1 = '172.31.1.1';
		expect(ipStrHasCIDR(testString1)).toEqual(false);

		const testString2 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
		expect(ipStrHasCIDR(testString2)).toEqual(false);

		const testString3 = '192.168.1.0/';
		expect(ipStrHasCIDR(testString3)).toEqual(false);

		const testString5 = '';
		expect(ipStrHasCIDR(testString5)).toEqual(false);

		const testString6 = '10.1.1.1/24 extra';
		expect(ipStrHasCIDR(testString6)).toEqual(false);
	});
});

describe('test createNetmaskFromCIDR()', () => {
	it('should return the netmask for valid CIDR values', () => {
		const expectedResult1 = '255.255.0.0';
		const expectedResult2 = '255.240.0.0';
		const expectedResult3 = '255.0.0.0';

		const testCIDR1 = 16;
		expect(createNetmaskFromCIDR(testCIDR1)).toEqual(expectedResult1);

		const testCIDR2 = 12;
		expect(createNetmaskFromCIDR(testCIDR2)).toEqual(expectedResult2);

		const testCIDR3 = 8;
		expect(createNetmaskFromCIDR(testCIDR3)).toEqual(expectedResult3);
	});

	it('should return undefined for invalid CIDR values', () => {
		const testCIDR1 = -1;
		expect(createNetmaskFromCIDR(testCIDR1)).toEqual(undefined);

		const testCIDR2 = 33;
		expect(createNetmaskFromCIDR(testCIDR2)).toEqual(undefined);
	});
});

describe('test validateNetmaskStr()', () => {
	it('should return true for valid netmasks', () => {
		const testString1 = '255.255.255.0';
		expect(validateNetmaskStr(testString1)).toEqual(true);

		const testString2 = '255.0.0.0';
		expect(validateNetmaskStr(testString2)).toEqual(true);

		const testString3 = '255.255.255.128';
		expect(validateNetmaskStr(testString3)).toEqual(true);

		const testString4 = '255.255.255.252';
		expect(validateNetmaskStr(testString4)).toEqual(true);
	});

	it('should return false for invalid netmasks', () => {
		const testString1 = '255.128.255.0';
		expect(validateNetmaskStr(testString1)).toEqual(false);

		const testString2 = '0.0.0.0';
		expect(validateNetmaskStr(testString2)).toEqual(false);

		const testString3 = '255.255.255.255';
		expect(validateNetmaskStr(testString3)).toEqual(false);

		const testString4 = '256.0.0.0';
		expect(validateNetmaskStr(testString4)).toEqual(false);

		const testString5 = '255.255.255.256';
		expect(validateNetmaskStr(testString5)).toEqual(false);

		const testString6 = '255.255.255';
		expect(validateNetmaskStr(testString6)).toEqual(false);

		const testString7 = '255.255.255.-1';
		expect(validateNetmaskStr(testString7)).toEqual(false);

		const testString8 = '255.255.255.1000';
		expect(validateNetmaskStr(testString8)).toEqual(false);
	});
});

describe('Test matchIpCIDRWithNetmask()', () => {
	it('should return true when CIDR matches netmask', () => {
		expect(matchIpCIDRWithNetmask(24, '255.255.255.0')).toEqual(true);
		expect(matchIpCIDRWithNetmask(16, '255.255.0.0')).toEqual(true);
		expect(matchIpCIDRWithNetmask(28, '255.255.255.240')).toEqual(true);
		expect(matchIpCIDRWithNetmask(20, '255.255.240.0')).toEqual(true);
	});

	it('should return false when CIDR does not match netmask', () => {
		expect(matchIpCIDRWithNetmask(24, '255.255.0.0')).toEqual(false);
		expect(matchIpCIDRWithNetmask(16, '255.0.0.0')).toEqual(false);
		expect(matchIpCIDRWithNetmask(28, '255.255.0.0')).toEqual(false);
		expect(matchIpCIDRWithNetmask(20, '255.0.0.0')).toEqual(false);
	});
});

describe('Test extractCIDRFromIpStr()', () => {
	it('should extract and return the CIDR from IP string', () => {
		const ipStr1 = '192.168.0.0/16';
		expect(extractCIDRFromIpStr(ipStr1)).toEqual(16);

		const ipStr2 = '172.16.0.0/12';
		expect(extractCIDRFromIpStr(ipStr2)).toEqual(12);

		const ipStr3 = '10.0.0.0/8';
		expect(extractCIDRFromIpStr(ipStr3)).toEqual(8);
	});

	it('should return undefined when CIDR is not present in IP string', () => {
		const ipStr1 = '172.31.1.1';
		expect(extractCIDRFromIpStr(ipStr1)).toBeUndefined();

		const ipStr2 = '192.168.1.0/';
		expect(extractCIDRFromIpStr(ipStr2)).toBeUndefined();

		const ipStr3 = '2001:0db8:85a3:0000:0000:8a2e:0370:7334/64';
		expect(extractCIDRFromIpStr(ipStr3)).toBeUndefined();
	});
});

describe('Test convertIpStrToBinaryString()', () => {
	it('should return the binary string representation of the IP address', () => {
		const testString1 = '192.168.0.1';
		const expectedResult1 = '11000000101010000000000000000001';
		expect(convertIpStrToBinaryString(testString1)).toEqual(expectedResult1);

		const testString2 = '10.0.0.0';
		const expectedResult2 = '00001010000000000000000000000000';
		expect(convertIpStrToBinaryString(testString2)).toEqual(expectedResult2);

		const testString3 = '255.255.255.255';
		const expectedResult3 = '11111111111111111111111111111111';
		expect(convertIpStrToBinaryString(testString3)).toEqual(expectedResult3);
	});

	it('should return undefined for invalid IP addresses', () => {
		const testString4 = '192.168.0';
		expect(convertIpStrToBinaryString(testString4)).toBeUndefined();

		const testString5 = '256.0.0.0';
		expect(convertIpStrToBinaryString(testString5)).toBeUndefined();

		const testString6 = '192.168.0.500';
		expect(convertIpStrToBinaryString(testString6)).toBeUndefined();
	});
});

describe('removeCIDRFromIpStr', () => {
	it('should remove the CIDR notation from the IP address string', () => {
		expect(removeCIDRFromIpStr('192.168.0.0/24')).toBe('192.168.0.0');
		expect(removeCIDRFromIpStr('10.0.0.0/8')).toBe('10.0.0.0');
		expect(removeCIDRFromIpStr('172.16.10.50/16')).toBe('172.16.10.50');
	});

	it('should return undefined for an invalid IP address string', () => {
		expect(removeCIDRFromIpStr('192.168.0.0/33')).toBeUndefined();
		expect(removeCIDRFromIpStr('10.0.0.0/-1')).toBeUndefined();
		expect(removeCIDRFromIpStr('not.an.ip.address')).toBeUndefined();
	});
});

describe('Test getNetworkAddress()', () => {
	it('should return the network address given the IP address and netmask', () => {
		const ipStr1 = '192.168.0.15';
		const netMask1 = '255.255.255.0';
		const expectedResult1 = '192.168.0.0';
		expect(getNetworkAddress(ipStr1, netMask1)).toEqual(expectedResult1);

		const ipStr2 = '10.0.0.100';
		const netMask2 = '255.0.0.0';
		const expectedResult2 = '10.0.0.0';
		expect(getNetworkAddress(ipStr2, netMask2)).toEqual(expectedResult2);

		const ipStr3 = '172.16.10.50';
		const netMask3 = '255.255.0.0';
		const expectedResult3 = '172.16.0.0';
		expect(getNetworkAddress(ipStr3, netMask3)).toEqual(expectedResult3);
	});

	it('should return undefined for invalid IP addresses or netmasks', () => {
		const ipStr4 = '192.168.0';
		const netMask4 = '255.255.255.0';
		expect(getNetworkAddress(ipStr4, netMask4)).toBeUndefined();

		const ipStr5 = '10.0.0.100';
		const netMask5 = '255.0.0';
		expect(getNetworkAddress(ipStr5, netMask5)).toBeUndefined();

		const ipStr6 = '172.16.10.50';
		const netMask6 = '255.255.0.500';
		expect(getNetworkAddress(ipStr6, netMask6)).toBeUndefined();
	});
});

describe('Test getBroadcastAddress()', () => {
	it('should return the broadcast address given the IP address and netmask', () => {
		const ipStr1 = '192.168.0.15';
		const netMask1 = '255.255.255.0';
		const expectedResult1 = '192.168.0.255';
		expect(getBroadcastAddress(ipStr1, netMask1)).toEqual(expectedResult1);

		const ipStr2 = '10.0.0.100';
		const netMask2 = '255.0.0.0';
		const expectedResult2 = '10.255.255.255';
		expect(getBroadcastAddress(ipStr2, netMask2)).toEqual(expectedResult2);

		const ipStr3 = '172.16.10.50';
		const netMask3 = '255.255.0.0';
		const expectedResult3 = '172.16.255.255';
		expect(getBroadcastAddress(ipStr3, netMask3)).toEqual(expectedResult3);
	});

	it('should return undefined for invalid IP addresses or netmasks', () => {
		const ipStr4 = '192.168.0';
		const netMask4 = '255.255.255.0';
		expect(getBroadcastAddress(ipStr4, netMask4)).toBeUndefined();

		const ipStr5 = '10.0.0.100';
		const netMask5 = '255.0.0';
		expect(getBroadcastAddress(ipStr5, netMask5)).toBeUndefined();

		const ipStr6 = '172.16.10.50';
		const netMask6 = '255.255.0.500';
		expect(getBroadcastAddress(ipStr6, netMask6)).toBeUndefined();
	});
});

describe('convertBinaryStringToIpStr', () => {
	it('should convert a valid binary string to IP address string', () => {
		const binStr1 = '11000000101010000000000000001111';
		expect(convertBinaryStringToIpStr(binStr1)).toBe('192.168.0.15');

		const binStr2 = '00001010000000000000000001100100';
		expect(convertBinaryStringToIpStr(binStr2)).toBe('10.0.0.100');

		const binStr3 = '10101100000100000000101000110010';
		expect(convertBinaryStringToIpStr(binStr3)).toBe('172.16.10.50');
	});

	it('should return undefined for an invalid binary string', () => {
		// const binStr4 = '110000001010100000000000000011110';
		// expect(convertBinaryStringToIpStr(binStr4)).toBeUndefined();

		// const binStr5 = '000010100000000000000000011001001';
		// expect(convertBinaryStringToIpStr(binStr5)).toBeUndefined();

		const binStr6 = '1010110000010000000010100011002';
		console.log(parseInt('0011002', 2));
		expect(convertBinaryStringToIpStr(binStr6)).toBeUndefined();
	});
});

describe('Test getIpRange()', () => {
	it('should return the IP range (excluding network and broadcast addresses) with count given the IP address and netmask', () => {
		const ipStr1 = '192.168.0.15';
		const netMask1 = '255.255.255.0';
		const expectedResult1 = {
			start: '192.168.0.1',
			end: '192.168.0.254'
		};
		expect(getIpRange(ipStr1, netMask1)).toEqual(expectedResult1);

		const ipStr2 = '10.0.0.100';
		const netMask2 = '255.0.0.0';
		const expectedResult2 = {
			start: '10.0.0.1',
			end: '10.255.255.254'
		};
		expect(getIpRange(ipStr2, netMask2)).toEqual(expectedResult2);

		const ipStr3 = '172.16.10.50';
		const netMask3 = '255.255.0.0';
		const expectedResult3 = {
			start: '172.16.0.1',
			end: '172.16.255.254'
		};
		expect(getIpRange(ipStr3, netMask3)).toEqual(expectedResult3);
	});

	it('should return undefined for invalid IP addresses or netmasks', () => {
		const ipStr4 = '192.168.0';
		const netMask4 = '255.255.255.0';
		expect(getIpRange(ipStr4, netMask4)).toBeUndefined();

		const ipStr5 = '10.0.0.100';
		const netMask5 = '255.0.0';
		expect(getIpRange(ipStr5, netMask5)).toBeUndefined();

		const ipStr6 = '172.16.10.50';
		const netMask6 = '255.255.0.500';
		expect(getIpRange(ipStr6, netMask6)).toBeUndefined();
	});
});
