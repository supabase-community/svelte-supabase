<script>
	import { session } from '$app/stores';
	import LogInLinkExample from '$lib/auth/LogInLinkExample.svelte';
</script>

{#if $session.user}
	<span>{$session.user.email}</span>
	<form class="inline" action="/api/auth/logout" method="post">
		<input name="redirect" type="hidden" value="/auth/example"/>
		<button aria-label="log out">Log out</button>
	</form>
{:else}
	<LogInLinkExample/>
{/if}

<style>
	.inline {
		display: inline-block;
	}
</style>
