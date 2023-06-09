import { describe, it, expect } from 'vitest';
import {
	StringToNumericIP,
	getNetworkAddress,
	NumericIPToString,
	getBroadcastAddress,
	getIpRange
} from './ip';

describe('StringToNumericIP', () => {
	it('should convert valid IP string to numeric representation', () => {
		expect(StringToNumericIP('192.168.0.1')).toEqual(3232235521);
		expect(StringToNumericIP('10.0.0.1')).toEqual(167772161);
		expect(StringToNumericIP('172.16.0.1')).toEqual(2886729729);
	});

	it('should return undefined for invalid IP string', () => {
		expect(StringToNumericIP('')).toBeUndefined();
		expect(StringToNumericIP('192.168.0')).toBeUndefined();
		expect(StringToNumericIP('256.0.0.1')).toBeUndefined();
		expect(StringToNumericIP('192.168.0.300')).toBeUndefined();
		expect(StringToNumericIP('192.168.0.a')).toBeUndefined();
	});
});

describe('getIpRange', () => {
	// Test case 1
	it('should calculate the IP range correctly', () => {
		const ip1 = 3232238149; // 192.168.10.69
		const mask1 = 4294967040; // 255.255.255.0
		const expectedRange1 = {
			start: 3232238081, // 192.168.10.1
			end: 3232238334 // 192.168.10.254
		};
		expect(getIpRange(ip1, mask1)).toEqual(expectedRange1);
	});

	// Test case 2
	it('should handle a different IP address and subnet mask', () => {
		const ip2 = 2886737420; // 172.16.30.12
		const mask2 = 4294967040; // 255.255.255.0
		const expectedRange2 = {
			start: 2886737409, // 172.16.30.1
			end: 2886737662 // 172.16.30.254
		};
		expect(getIpRange(ip2, mask2)).toEqual(expectedRange2);
	});

	// Test case 3
	it('should handle a larger subnet mask', () => {
		const ip3 = 3232238149; // 192.168.10.69
		const mask3 = 4294967168; // 255.255.255.128
		const expectedRange3 = {
			start: 3232238081, // 192.168.10.1
			end: 3232238206 // 192.168.10.126
		};
		expect(getIpRange(ip3, mask3)).toEqual(expectedRange3);
	});
});

describe('getNetworkAddress', () => {
	// 192.168.10.69
	const TEST_IP_NUM_1: number = 3232238149;
	// 255.255.255.0
	const TEST_MASK_NUM_1: number = 4294967040;
	// 192.168.10.0
	const TEST_ANS_NUM_1: number = 3232238080;

	// 10.169.131.42
	const TEST_IP_NUM_2: number = 178881322;
	// 255.255.255.128
	const TEST_MASK_NUM_2: number = 4294967168;
	// 10.169.131.0
	const TEST_ANS_NUM_2: number = 178881280;

	// 172.16.30.12
	const TEST_IP_NUM_3: number = 2886737420;
	// 255.255.240.0
	const TEST_MASK_NUM_3: number = 4294963200;
	// 172.16.16.0
	const TEST_ANS_NUM_3: number = 2886733824;

	it('should calculate the network address correctly', () => {
		expect(getNetworkAddress(TEST_IP_NUM_1, TEST_MASK_NUM_1)).toEqual(TEST_ANS_NUM_1);

		expect(getNetworkAddress(TEST_IP_NUM_2, TEST_MASK_NUM_2)).toEqual(TEST_ANS_NUM_2);

		expect(getNetworkAddress(TEST_IP_NUM_3, TEST_MASK_NUM_3)).toEqual(TEST_ANS_NUM_3);
	});
});

describe('getBroadcastAddress', () => {
	// Test case 1
	it('should calculate the broadcast address correctly', () => {
		const ip1 = 3232238149; // 192.168.10.69
		const mask1 = 4294967040; // 255.255.255.0
		const expectedBroadcast1 = 3232238335; // 192.168.10.255
		expect(getBroadcastAddress(ip1, mask1)).toEqual(expectedBroadcast1);
	});

	// Test case 2
	it('should handle a different IP address and subnet mask', () => {
		const ip2 = 2886737420; // 172.16.30.12
		const mask2 = 4294967040; // 255.255.255.0
		const expectedBroadcast2 = 2886737663; // 172.16.30.255
		expect(getBroadcastAddress(ip2, mask2)).toEqual(expectedBroadcast2);
	});

	// Test case 3
	it('should handle a larger subnet mask', () => {
		const ip3 = 3232238149; // 192.168.10.69
		const mask3 = 4294967168; // 255.255.255.128
		const expectedBroadcast3 = 3232238207; // 192.168.10.127
		expect(getBroadcastAddress(ip3, mask3)).toEqual(expectedBroadcast3);
	});

	// Test case 4
	it('should handle a subnet with all host bits set to 1', () => {
		const ip4 = 2886737420; // 172.16.30.12
		const mask4 = 4294967295; // 255.255.255.255
		const expectedBroadcast4 = 2886737420; // 172.16.30.12
		expect(getBroadcastAddress(ip4, mask4)).toEqual(expectedBroadcast4);
	});
});

describe('NumericIPToString', () => {
	it('should convert numeric IP to string representation', () => {
		expect(NumericIPToString(3232235521)).toEqual('192.168.0.1');
		expect(NumericIPToString(167772161)).toEqual('10.0.0.1');
		expect(NumericIPToString(2886729729)).toEqual('172.16.0.1');
	});
});
