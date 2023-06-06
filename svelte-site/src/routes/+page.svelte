<script lang="ts">
    import {validateIpString} from '../lib/utils/ip';

    let test: string = "type here";
</script>

<div>
    <h1>IP Explorer</h1>
    <p>{validateIpString(test).isValid ? 'Valid IP' : 'Invalid IP'}</p>
    <input type="text" bind:value={test}>
    <div class="info">
        <p id="networkAddress"></p>
        <p id="broadcastAddress"></p>
        <p id="ipRange"></p>
        <p id="broadcastAddress"></p>
    </div>
</div> 
