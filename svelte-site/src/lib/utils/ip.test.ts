import { describe, it, expect } from 'vitest';
import { validateIpString } from './ip';

describe('test validateIpString()', () => {
	it('should return true', () => {
		const testString1 = '10.169.131.69';
		expect(validateIpString(testString1)).toBe(true);

		const testString2 = '192.168.10.1';
		expect(validateIpString(testString2)).toBe(true);

		const testString3 = '0.0.0.0';
		expect(validateIpString(testString3)).toBe(true);

		const testString4 = '255.255.255.255';
		expect(validateIpString(testString4)).toBe(true);
	});

	it('should return false', () => {
		const testString5 = '192.168.10';
		expect(validateIpString(testString5)).toBe(false);

		const testString6 = '192.168.10.1.2';
		expect(validateIpString(testString6)).toBe(false);

		const testString7 = '256.168.10.1';
		expect(validateIpString(testString7)).toBe(false);

		const testString8 = '192.168.10.-1';
		expect(validateIpString(testString8)).toBe(false);

		const testString9 = '192.168.10.1000';
		expect(validateIpString(testString9)).toBe(false);

		const testString10 = '192.168.10.01';
		expect(validateIpString(testString10)).toBe(false);

		const testString11 = '192.168.10.1.';
		expect(validateIpString(testString11)).toBe(false);

		const testString12 = '.192.168.10.1';
		expect(validateIpString(testString12)).toBe(false);

		const testString13 = '192..168.10.1';
		expect(validateIpString(testString13)).toBe(false);

		const testString14 = '192.168..10.1';
		expect(validateIpString(testString14)).toBe(false);

		const testString15 = '192.168.10..1';
		expect(validateIpString(testString15)).toBe(false);

		const testString16 = '192.168.10.1.';
		expect(validateIpString(testString16)).toBe(false);

		const testString17 = ' 192.168.10.1';
		expect(validateIpString(testString17)).toBe(false);

		const testString18 = '192.168.10.1 ';
		expect(validateIpString(testString18)).toBe(false);
	});
});
