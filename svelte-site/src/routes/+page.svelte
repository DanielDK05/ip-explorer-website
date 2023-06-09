<script lang="ts">
	import { NumericIPToString, StringToNumericIP, getNetworkAddress, getBroadcastAddress, getIpRange} from "$lib/utils/ip";

    let ipInput: string = "10.169.131.69";
    let maskInput: string = "255.255.255.0";

    let IP: number | undefined;
  let mask: number | undefined;
  let networkAddress: string | undefined;
  let broadcastAddress: string | undefined;
  let ipRange: {start: string, end: string} | undefined;

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
    <div class="info">
        <p id="ip">IP address: {ipInput}</p>
        <p id="netWorkMask">Network Mask: {maskInput}</p>
        <p id="networkAddress">Network address: {networkAddress}</p>
        <p id="broadcastAddress">Broadcast address: {broadcastAddress}</p>
        <p id="ipRange">IP range: {ipRange && `${ipRange.start}-${ipRange.end}`}</p>
    </div>
</div> 
