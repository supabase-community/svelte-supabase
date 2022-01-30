<script>
	import { page } from '$app/stores';

	// get relative URL for this page to redirect back to after logging in
	$: redirect = $page.url.toString().substring($page.url.origin.length);
</script>

<a aria-label='log in' sveltekit:prefetch href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}>Log in</a>
|
<a aria-label='sign up' sveltekit:prefetch href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}>Sign up</a>
