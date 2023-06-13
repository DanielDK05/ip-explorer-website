import { describe, it, expect } from 'vitest';
import {
	StringToNumericIP,
	getNetworkAddress,
	NumericIPToString,
	getBroadcastAddress,
	getIpRange,
	cidrToNumericMask,
	splitIPAndCIDR,
	createSubnets,
	validateNetmaskStr,
	ipHasCIDR,
	validateIpStr
} from './ip';

describe('cidrToNumericMask', () => {
	// Test case 1
	it('should calculate the numeric mask for CIDR 0', () => {
		const cidr1 = 0;
		const expectedNumericMask1 = 0; // 0.0.0.0
		expect(cidrToNumericMask(cidr1)).toEqual(expectedNumericMask1);
	});

	// Test case 2
	it('should calculate the numeric mask for CIDR 32', () => {
		const cidr2 = 32;
		const expectedNumericMask2 = 4294967295; // 255.255.255.255
		expect(cidrToNumericMask(cidr2)).toEqual(expectedNumericMask2);
	});

	// Test case 3
	it('should calculate the numeric mask for CIDR 24', () => {
		const cidr3 = 24;
		const expectedNumericMask3 = 4294967040; // 255.255.255.0
		expect(cidrToNumericMask(cidr3)).toEqual(expectedNumericMask3);
	});

	// Test case 4
	it('should calculate the numeric mask for CIDR 16', () => {
		const cidr4 = 16;
		const expectedNumericMask4 = 4294901760; // 255.255.0.0
		expect(cidrToNumericMask(cidr4)).toEqual(expectedNumericMask4);
	});

	// Test case 5
	it('should clamp the CIDR to between 0 and 32', () => {
		const cidr5 = -5;
		const expectedClampedCidr5 = 0;
		expect(cidrToNumericMask(cidr5)).toEqual(expectedClampedCidr5);
	});

	// Test case 6
	it('should clamp the CIDR to between 0 and 32', () => {
		const cidr6 = 42;
		const expectedClampedCidr6 = 4294967295;
		expect(cidrToNumericMask(cidr6)).toEqual(expectedClampedCidr6);
	});
});

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

describe('Test splitIPAndCIDR()', () => {
	it('should split IP address and CIDR from the input string', () => {
		const input1 = '192.168.0.1/24';
		const expectedResult1 = { ip: 3232235521, mask: 4294967040 };
		expect(splitIPAndCIDR(input1)).toEqual(expectedResult1);

		const input2 = '10.0.0.100/16';
		const expectedResult2 = { ip: 167772260, mask: 4294901760 };
		expect(splitIPAndCIDR(input2)).toEqual(expectedResult2);

		const input3 = '172.16.10.50/32';
		const expectedResult3 = { ip: 2886732338, mask: 4294967295 };
		expect(splitIPAndCIDR(input3)).toEqual(expectedResult3);
	});

	it('should return undefined for invalid input strings', () => {
		const input4 = '192.168.0.1/33';
		expect(splitIPAndCIDR(input4)).toBeUndefined();

		const input5 = '10.0.0/16';
		expect(splitIPAndCIDR(input5)).toBeUndefined();

		const input6 = '172.16.10.50';
		expect(splitIPAndCIDR(input6)).toBeUndefined();

		const input7 = '192.168.0.1/';
		expect(splitIPAndCIDR(input7)).toBeUndefined();

		const input8 = '192.168.0.1/24/extra';
		expect(splitIPAndCIDR(input8)).toBeUndefined();
	});
});

describe('ipHasCIDR', () => {
	it('should correctly validate IP addresses with CIDR notation', () => {
		// Test Case 1
		const ipAddress1 = '192.168.0.1/24';
		const expected1 = true;
		expect(ipHasCIDR(ipAddress1)).toEqual(expected1);

		// Test Case 2
		const ipAddress2 = '10.0.0.0/16';
		const expected2 = true;
		expect(ipHasCIDR(ipAddress2)).toEqual(expected2);

		// Test Case 3
		const ipAddress3 = '172.16.0.0/12';
		const expected3 = true;
		expect(ipHasCIDR(ipAddress3)).toEqual(expected3);

		// Test Case 4
		const ipAddress4 = '255.255.255.0';
		const expected4 = false;
		expect(ipHasCIDR(ipAddress4)).toEqual(expected4);

		// Test Case 5
		const ipAddress5 = '192.168.0.1/33';
		const expected5 = false;
		expect(ipHasCIDR(ipAddress5)).toEqual(expected5);
	});
});

describe('validateIpStr', () => {
	it('should correctly validate IP addresses with CIDR notation', () => {
		// Test Case 1
		const ipAddress1 = '192.168.0.1/24';
		const expected1 = true;
		expect(validateIpStr(ipAddress1)).toEqual(expected1);

		// Test Case 2
		const ipAddress2 = '10.0.0.0/16';
		const expected2 = true;
		expect(validateIpStr(ipAddress2)).toEqual(expected2);

		// Test Case 3
		const ipAddress3 = '172.16.0.0/12';
		const expected3 = true;
		expect(validateIpStr(ipAddress3)).toEqual(expected3);

		// Test Case 4
		const ipAddress4 = '255.255.255.0';
		const expected4 = true;
		expect(validateIpStr(ipAddress4)).toEqual(expected4);

		// Test Case 5
		const ipAddress5 = '255.255.256.0';
		const expected5 = false;
		expect(validateIpStr(ipAddress5)).toEqual(expected5);

		// Test Case 6
		const ipAddress6 = '192.168.0.1/33';
		const expected6 = false;
		expect(validateIpStr(ipAddress6)).toEqual(expected6);
	});
});

describe('validateNetmaskStr', () => {
	it('should validate netmask correctly', () => {
		// Test Case 1
		const netmask1 = '255.255.255.0';
		const expected1 = true;
		expect(validateNetmaskStr(netmask1)).toEqual(expected1);

		// Test Case 2
		const netmask2 = '255.255.0.0';
		const expected2 = true;
		expect(validateNetmaskStr(netmask2)).toEqual(expected2);

		// Test Case 3
		const netmask3 = '255.255.254.0';
		const expected3 = true;
		expect(validateNetmaskStr(netmask3)).toEqual(expected3);

		// Test Case 4
		const netmask4 = '0.0.0.0';
		const expected4 = false;
		expect(validateNetmaskStr(netmask4)).toEqual(expected4);

		// Test Case 5
		const netmask5 = '255.255.255.255';
		const expected5 = false;
		expect(validateNetmaskStr(netmask5)).toEqual(expected5);
	});
});

describe('calculateSubnets', () => {
	it('should calculate subnets correctly', () => {
		// Test Case 1
		const subnetAmount1 = 4;
		const ip1 = 178881303; // 10.169.131.23
		const mask1 = 4294967040; // 255.255.255.0

		const expectedSubnets1 = [
			{ ip: 178881280, mask: 4294967232 }, // Subnet 1
			{ ip: 178881344, mask: 4294967232 }, // Subnet 2
			{ ip: 178881408, mask: 4294967232 }, // Subnet 3
			{ ip: 178881472, mask: 4294967232 } // Subnet 4
		];

		expect(createSubnets(subnetAmount1, ip1, mask1)).toEqual(expectedSubnets1);

		// Test Case 2
		const subnetAmount2 = 8;
		const ip2 = 3232235520; // 192.168.0.0
		const mask2 = 4294967040; // 255.255.248.0

		const expectedSubnets2 = [
			{ ip: 3232235520, mask: 4294967264 }, // Subnet 1
			{ ip: 3232235552, mask: 4294967264 }, // Subnet 2
			{ ip: 3232235584, mask: 4294967264 }, // Subnet 3
			{ ip: 3232235616, mask: 4294967264 }, // Subnet 4
			{ ip: 3232235648, mask: 4294967264 }, // Subnet 5
			{ ip: 3232235680, mask: 4294967264 }, // Subnet 6
			{ ip: 3232235712, mask: 4294967264 }, // Subnet 7
			{ ip: 3232235744, mask: 4294967264 } // Subnet 8
		];

		expect(createSubnets(subnetAmount2, ip2, mask2)).toEqual(expectedSubnets2);

        // Test Case 2
		const subnetAmount3 = 5;
		const ip3 = 3232235520; // 192.168.0.0
		const mask3 = 4294967040; // 255.255.248.0

		const expectedSubnets3 = [
			{ ip: 3232235520, mask: 4294967264 }, // Subnet 1
			{ ip: 3232235552, mask: 4294967264 }, // Subnet 2
			{ ip: 3232235584, mask: 4294967264 }, // Subnet 3
			{ ip: 3232235616, mask: 4294967264 }, // Subnet 4
			{ ip: 3232235648, mask: 4294967264 }, // Subnet 5
			{ ip: 3232235680, mask: 4294967264 }, // Subnet 6
			{ ip: 3232235712, mask: 4294967264 }, // Subnet 7
			{ ip: 3232235744, mask: 4294967264 } // Subnet 8
		];

		expect(createSubnets(subnetAmount3, ip3, mask3)).toEqual(expectedSubnets3);
	});
});
