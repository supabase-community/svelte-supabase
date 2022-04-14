<script>
	import { page } from '$app/stores';
	import {getRelativePath} from '$lib/auth/helper';

	// get relative URL for this page to redirect back to after logging in
	$: redirect = getRelativePath($page.url);
</script>

<a aria-label='log in' sveltekit:prefetch href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}>Log in</a>
|
<a aria-label='sign up' sveltekit:prefetch href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}>Sign up</a>
