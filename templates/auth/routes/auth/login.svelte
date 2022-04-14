<script>
	import EmailPasswordFormExample from '$lib/auth/EmailPasswordFormExample.svelte';
</script>

<div class="container">
	<h1>Log in</h1>
  <EmailPasswordFormExample action="/api/auth/login" button="Log in" let:redirect>
		<p>
			Not a member?
			<a
				sveltekit:prefetch
				aria-label="sign up"
				href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}
			>
				Sign up here
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
