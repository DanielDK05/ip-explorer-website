// export default function perlin(
// 	amplitude: number,
// 	octaves: number,
// 	persistence: number,
// 	lacunarity: number
// ): number[] {
// 	let arr: number[] = [];

// 	for (let i = 0; i < octaves; i++) {
// 		const frequency = Math.pow(lacunarity, i);
// 		const amplitudeMultiplier = Math.pow(persistence, i);
// 		const octaveArr: number[] = [];

// 		for (let j = 0; j < 20; j++) {
// 			const value = Math.random() * 2 - 1; // Generate value between -1 and 1
// 			octaveArr.push(value);
// 		}

// 		const mappedOctaveArr = octaveArr.map((value) => value * amplitudeMultiplier);
// 		arr = arr.map((value, index) => value + mappedOctaveArr[index]);
// 		console.log('perlin', mappedOctaveArr, arr);
// 	}

// 	return arr;
// }
// console.log(arr.map((num) => Math.floor(num)));
// console.log(interpolate(arr.map((num) => Math.floor(num))));

export default function perlin(
	amplitude: number,
	octaves: number,
	persistence: number,
	lacunarity: number,
	length: number
): number[] {
	const arr: number[] = Array(length).fill(0);

	function generateOctave(octave: number, frequency: number, amplitudeMultiplier: number): void {
		if (octave === 0) return;

		for (let i = 0; i < length; i++) {
			const value = Math.random() * 2 - 1; // Generate value between -1 and 1
			arr[i] += value * amplitudeMultiplier;
			arr[i] = Math.max(-amplitude, Math.min(arr[i], amplitude));
		}

		generateOctave(octave - 1, frequency * lacunarity, amplitudeMultiplier * persistence);
	}

	generateOctave(octaves, 1, amplitude);
	return arr;
}

export function mapValue(
	value: number,
	minInput: number,
	maxInput: number,
	minOutput: number,
	maxOutput: number
): number {
	// Clamp the value within the input range
	value = Math.max(minInput, Math.min(maxInput, value));

	// Map the clamped value to the output range
	const inputRange = maxInput - minInput;
	const outputRange = maxOutput - minOutput;
	const normalizedValue = (value - minInput) / inputRange;

	return minOutput + normalizedValue * outputRange;
}
