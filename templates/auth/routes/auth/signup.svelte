<script lang="ts">
	import EmailPasswordFormExample from '$lib/auth/EmailPasswordFormExample.svelte';
</script>

<div class="container">
	<h1>Sign up</h1>
	<EmailPasswordFormExample action="/api/auth/signup" button="Sign Up" let:redirect>
		<p>
			Already a member?
			<a
				sveltekit:prefetch
				aria-label="log in"
				href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
			>
				Log in here
			</a>
		</p>
	</EmailPasswordFormExample>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		width: 25rem;
	}
</style>
