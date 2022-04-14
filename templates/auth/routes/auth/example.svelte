<script>
	import { invalidate } from '$app/navigation';
	import LogInOutFormExample from '$lib/auth/LogInOutFormExample.svelte';

	export let data;
	export let error;

	function handleClick() {
		invalidate('./example');
	}
</script>

<nav>
	<LogInOutFormExample/>
</nav>
<button on:click={handleClick}>Client-side Update</button>
<pre>{error?.toString() || JSON.stringify(data, null, 2)}</pre>

<style>
	nav {
		margin-bottom: 1rem;
	}
</style>
