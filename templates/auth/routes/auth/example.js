import supabase from '$lib/db';

/** @type {import('./example').RequestHandler} */
export async function get() {
	const { data, error } = await supabase.from('your-table-here').select();

	if (error) {
		console.error('error', error);

		return {
			status: 500,
		}
	}

	return {
		body: {
			data,
		}
	};
};
