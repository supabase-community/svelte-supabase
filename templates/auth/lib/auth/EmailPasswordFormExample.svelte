<script>
	import { page } from '$app/stores';

	export let action = '/api/login';
	export let button;

	$: redirect = $page.url.searchParams.get('redirect') || '';
	$: error = $page.url.searchParams.get('error') || '';
</script>

<form {action} method="post">
	<input name="redirect" type="hidden" value={redirect} />
	<div class="form-group">
		<label for="email">E-mail</label>
		<input name="email" type="email" aria-label="e-mail" required />
	</div>
	<div class="form-group">
		<label for="password">Password</label>
		<input name="password" type="password" aria-label="password" required />
	</div>
	{#if error}
		<div class="error form-group">{error}</div>
	{/if}
	<button>{button}</button>
	<slot {redirect} />
</form>

<style>
	.error {
		background-color: red;
		color: white;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 0.5rem;
	}
</style>
