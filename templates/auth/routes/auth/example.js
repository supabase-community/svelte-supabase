import supabase from '$lib/db';

/** @type {import('./example').RequestHandler} */
export async function get() {
	const { data, error } = await supabase.from('your-table-here').select();

	if (error) {
		return {
			status: 400,
			body: {
				error: error.message
			},
		}
	}

	return {
		body: {
			data,
		}
	};
};
