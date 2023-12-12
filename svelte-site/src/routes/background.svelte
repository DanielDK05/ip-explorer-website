<script lang="ts">
	import { base } from '$app/paths';
	import perlin from '$lib/utils/perlinNoise';
	import { onMount } from 'svelte';

	let backgroundStyle: string | undefined;

	function loadFont() {
		return new Promise<void>((resolve, reject) => {
			const font = new FontFace('randygg', 'url(/fonts/randygg.otf)');
			font
				.load()
				.then(() => {
					document.fonts.add(font);
					resolve();
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	function generateMatrixBackground() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const cellSize = 20;
		const width = Math.ceil(window.innerWidth / cellSize);
		const height = Math.ceil(window.innerHeight / cellSize);

		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const perlinArr = perlin(height * cellSize * 0.65, 8, 0.5, 0, width);

		ctx.font = `${cellSize}px randygg`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				ctx.fillStyle = perlinArr[x] > cellSize * y ? '#5e6ebf' : '#293469';
				const value = Math.random() > 0.5 ? 0 : 1;
				ctx.fillText(value.toString(), (x + 0.5) * cellSize, (y + 0.5) * cellSize);
			}
		}

		const backgroundUrl = canvas.toDataURL();

		return `url(${backgroundUrl})`;
	}

	function generatePerlinBackground() {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const cellSize = 2;

		const perlinArr = perlin(255, 16, 0.5, 0, Math.floor(window.innerWidth / cellSize));

		perlinArr.forEach((num: number, index: number) => {
			ctx.fillStyle = `rgb(${num}, ${num}, ${num})`;
			ctx.fillRect(index * cellSize, 10, cellSize, window.innerHeight);
		});

		const backgroundUrl = canvas.toDataURL();

		return `url(${backgroundUrl})`;
	}

	function debounce(func: Function, delay: number) {
		let timeoutId: ReturnType<typeof setTimeout> | null = null;

		return function (...args: any[]) {
			clearTimeout(timeoutId!);
			timeoutId = setTimeout(() => {
				func.apply(null, args);
			}, delay);
		};
	}

	onMount(async () => {
		try {
			await loadFont();
			backgroundStyle = generateMatrixBackground();

			window.addEventListener(
				'resize',
				debounce(() => {
					backgroundStyle = generateMatrixBackground();
				}, 300)
			);
		} catch (error) {
			console.error('Error loading canvas: ', error);
		}
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="{base}/fonts.css" />
</svelte:head>
<div id="background" style="background-image: {backgroundStyle}" />

<style>
	#background {
		top: 0;
		left: 0;
		z-index: 0;
		position: fixed;
		width: 100vw;
		height: 100vh;
		background-position: center;
		background-color: #161b35;
		background-size: cover;
		filter: blur(2px);
	}
</style>
