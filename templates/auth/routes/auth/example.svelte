<script context="module">
	import supabase from '$lib/db';

	function queryData() {
		// ***************************************************
		// Edit the table name to a table with data in your db
		// (preferably one with RLS and authenticated can select)
		// ***************************************************
		return supabase.from('your-table-here').select();
	}

	export async function load() {
		const { data, error } = await queryData();
		if (error) return { error: error.message };
		return { props: { rows: data } };
	}
</script>
<script>
	import LogInOutFormExample from '$lib/auth/LogInOutFormExample.svelte';

	export let rows;
	let error;

	async function handleClick() {
		const {data, error: queryError} = await queryData();
		error = queryError;
		rows = data;
	}
</script>

<nav>
	<LogInOutFormExample/>
</nav>
<button on:click={handleClick}>Client-side Update</button>
<pre>{error?.toString() || JSON.stringify(rows, null, 2)}</pre>

<style>
	nav {
		margin-bottom: 1rem;
	}
</style>
