<script lang="ts">
    import {validateIpString, extractCIDRFromIpStr, ipStrHasCIDR, validateNetmaskStr, matchIpCIDRWithNetmask, extractNetmaskFromIpStr, getNetworkAddress, removeCIDRFromIpStr, getBroadcastAddress, getIpRange} from '../lib/utils/ip';

    let ipInput: string = "10.169.131.69/24";
    let maskInput: string = "255.255.255.0";

    function onIpInputChange(e: Event) {
        const netMask = extractNetmaskFromIpStr((e.target as HTMLInputElement).value);
        if (netMask) maskInput = netMask;
    }
</script>

<div>
    <h1>IP Explorer</h1>
    <p>{validateIpString(ipInput, true) ? 'Valid IP' : 'Invalid IP'}</p>
    <p>{validateNetmaskStr(maskInput) ? 'Valid Netmask' : 'Invalid Netmask'}</p>
    <p>{maskInput && ipStrHasCIDR(ipInput) &&  matchIpCIDRWithNetmask(extractCIDRFromIpStr(ipInput) ?? -1, maskInput) ? 'Netmask and IP matches' : 'Netmask and IP doesnt match'}</p>
    <input 
        type="text" 
        on:input={onIpInputChange} 
        bind:value={ipInput} 
        placeholder="type IP here:"
    >
    <input type="text" bind:value={maskInput} placeholder={"type mask here:"}>
    <div class="info">
        <p id="networkAddress">{getNetworkAddress(ipStrHasCIDR(ipInput) ? removeCIDRFromIpStr(ipInput) ?? ipInput : ipInput, maskInput)}</p>
        <p id="broadcastAddress">{getBroadcastAddress(ipStrHasCIDR(ipInput) ? removeCIDRFromIpStr(ipInput) ?? ipInput : ipInput, maskInput)}</p>
        <p id="ipRange">{getIpRange(removeCIDRFromIpStr(ipInput) ?? ipInput, maskInput)?.start}-{getIpRange(removeCIDRFromIpStr(ipInput) ?? ipInput, maskInput)?.end}</p>
        <p id="netWorkMask">{extractNetmaskFromIpStr(ipInput) ? extractNetmaskFromIpStr(ipInput) : maskInput}</p>
    </div>
</div> 
