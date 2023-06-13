<script lang="ts">
	import {
		NumericIPToString,
		StringToNumericIP,
		getNetworkAddress,
		getBroadcastAddress,
		getIpRange,
		createSubnets,
		ipHasCIDR,
		splitIPAndCIDR,
		validateIpStr,
		validateNetmaskStr
	} from '$lib/utils/ip';
	import Background from './background.svelte';

	let ipInput: string = '10.169.131.69';
	let maskInput: string = '255.255.255.0';
	let subnetAmount: number = 0;

	let numIP: number | undefined;
	let numMask: number | undefined;
	let IP: string | undefined;
	let mask: string | undefined;
	let networkAddress: string | undefined;
	let broadcastAddress: string | undefined;
	let ipRange: { start: string; end: string } | undefined;
	let subnets: { networkAddress: string; broadcastAddress: string; mask: string }[] = [];

	function calculateNetwork() {
		if (!validateIpStr(ipInput) || !validateNetmaskStr(maskInput)) return;

		if (ipHasCIDR(ipInput)) {
			const splitIP = splitIPAndCIDR(ipInput);
			if (splitIP) {
				numIP = splitIP.ip;
				numMask = splitIP.mask;
				maskInput = NumericIPToString(numMask);
			}
		} else {
			numIP = StringToNumericIP(ipInput);
			numMask = StringToNumericIP(maskInput);
		}

		if (!numIP || !numMask) return;

		IP = NumericIPToString(numIP);
		mask = NumericIPToString(numMask);
		networkAddress = NumericIPToString(getNetworkAddress(numIP, numMask));
		broadcastAddress = NumericIPToString(getBroadcastAddress(numIP, numMask));
		const numericIpRange = getIpRange(numIP, numMask);
		ipRange = {
			start: NumericIPToString(numericIpRange.start),
			end: NumericIPToString(numericIpRange.end)
		};
	}

	function calculateSubnets() {
		if (!numIP || !numMask) {
			subnets = [];
			return;
		}

		const newSubnets = createSubnets(subnetAmount, numIP, numMask);

		if (!newSubnets) {
			subnets = [];
			return;
		}

		subnets = newSubnets.map((subnet) => {
			return {
				networkAddress: NumericIPToString(getNetworkAddress(subnet.ip, subnet.mask)),
				broadcastAddress: NumericIPToString(getBroadcastAddress(subnet.ip, subnet.mask)),
				mask: NumericIPToString(subnet.mask)
			};
		});
	}

	//TODO: bug, will only be called when values are truthy
	$: ipInput && maskInput && calculateNetwork();
	$: ipInput && maskInput && subnetAmount && calculateSubnets();
</script>

<div id="mainContainer">
	<Background />
	<div id="inputs">
		<h1 id="headline">IP Explorer</h1>
		<input type="text" bind:value={ipInput} placeholder={'type IP here:'} />
		<input type="text" bind:value={maskInput} placeholder={'type mask here:'} />
		<input type="number" bind:value={subnetAmount} placeholder={'subnet amount:'} />
	</div>
	<div id="info">
		<p id="ip">IP address: {IP ? IP : 'Unable to calculate'}</p>
		<p id="networkMask">Network Mask: {mask ? mask : 'Unable to calculate'}</p>
		<p id="networkAddress">
			Network address: {networkAddress ? networkAddress : 'Unable to calculate'}
		</p>
		<p id="broadcastAddress">
			Broadcast address: {broadcastAddress ? broadcastAddress : 'Unable to calculate'}
		</p>
		<p id="ipRange">
			IP range: {ipRange ? `${ipRange.start}-${ipRange.end}` : 'Unable to calculate'}
		</p>
	</div>
	<div id="subnetInfo">
		<h1>Subnets:</h1>
		<div id="subnets">
			{#each subnets as subnet, index}
				<div class="subnet">
					<h2>Subnet {index + 1}:</h2>
					<p>Network address: {subnet.networkAddress}</p>
					<p>Broadcast address: {subnet.broadcastAddress}</p>
					<p>Mask: {subnet.mask}</p>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	#mainContainer {
		background-color: #385b94;
		width: 100vw;
		height: 100vh;

		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2rem;
		padding: 2rem;
		box-sizing: border-box;

		color: #ffffff;
	}

	#mainContainer > div {
		padding: 1rem;
		background-color: rgba(61, 99, 161, 0.6);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		z-index: 1;
		backdrop-filter: blur(5px);
	}

	#headline {
		margin: 0;
	}

	#inputs {
		display: flex;
		flex-direction: column;
		/*justify-content: space-evenly;*/
		gap: 2rem;

		width: 400px;

		grid-column: 1;
		grid-row: 1;
	}

	#inputs input {
		width: 15rem;
		height: 3rem;

		border-radius: 1rem;
		outline: none;
		border: none;
		padding: 0.5rem;
		font-size: 1.2rem;
	}

	#inputs input:focus {
		background-color: #cdcdcd;
		border: none;
	}

	#info {
		grid-column: 1;
		grid-row: 2;

		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	#subnetInfo {
		grid-column: 2;
		grid-row: 1 / span 2;
		overflow: auto;
	}

	#subnets {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 1rem;
	}

	#subnets .subnet {
		box-sizing: border-box;
		padding: 1rem;
		background-color: rgba(61, 99, 161, 0.8);
		box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		z-index: 1;
	}
</style>
