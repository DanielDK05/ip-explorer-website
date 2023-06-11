<script lang="ts">
	import { NumericIPToString, StringToNumericIP, getNetworkAddress, getBroadcastAddress, getIpRange, calculateSubnets} from "$lib/utils/ip";

    let ipInput: string = "10.169.131.69";
    let maskInput: string = "255.255.255.0";
    let subnetAmount: number = 0;

    let IP: number | undefined;
  let mask: number | undefined;
  let networkAddress: string | undefined;
  let broadcastAddress: string | undefined;
  let ipRange: {start: string, end: string} | undefined;
  let subnets: {networkAddress: string, broadcastAddress: string, mask: string}[];

  $: {
    IP = StringToNumericIP(ipInput);
    mask = StringToNumericIP(maskInput);

    if (IP && mask) {
      networkAddress =NumericIPToString(getNetworkAddress(IP, mask));
      broadcastAddress = NumericIPToString(getBroadcastAddress(IP, mask));
      const numericIpRange = getIpRange(IP, mask);
      ipRange = {
        start: NumericIPToString(numericIpRange.start),
        end: NumericIPToString(numericIpRange.end)
      };

      subnets = calculateSubnets(subnetAmount, IP, mask).map(subnet => {
        return {
          networkAddress: NumericIPToString(getNetworkAddress(subnet.ip, subnet.mask)),
          broadcastAddress: NumericIPToString(getBroadcastAddress(subnet.ip, subnet.mask)),
          mask: NumericIPToString(subnet.mask)
        }
      })
    } else {
      networkAddress = undefined;
      broadcastAddress = undefined;
      ipRange = undefined;
    }
  }
</script>

<div>
    <h1>IP Explorer</h1>
    <input 
        type="text" 
        bind:value={ipInput} 
        placeholder="type IP here:"
    >
    <input type="text" bind:value={maskInput} placeholder={"type mask here:"}>
    <input type="number" bind:value={subnetAmount} placeholder={"subnet amount:"}>
    <div class="info">
        <p id="ip">IP address: {ipInput}</p>
        <p id="netWorkMask">Network Mask: {maskInput}</p>
        <p id="networkAddress">Network address: {networkAddress}</p>
        <p id="broadcastAddress">Broadcast address: {broadcastAddress}</p>
        <p id="ipRange">IP range: {ipRange && `${ipRange.start}-${ipRange.end}`}</p>
        <div class="subnets">
          <h1>Subnets: </h1>
          {#each subnets as subnet, index}
            <div class="subnet">
              <h2>Subnet {index + 1}</h2>
              <p>Network address: {subnet.networkAddress }</p>
              <p>Broadcast address: {subnet.broadcastAddress}</p>
              <p>Mask: {subnet.mask}</p>
            </div>
          {/each}
        </div>
    </div>
</div> 
