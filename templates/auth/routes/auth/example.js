import supabase from '$lib/db';

/** @type {import('./example').RequestHandler} */
export async function get() {
	// ***************************************************
	// Edit the table name to a table with data in your db
	// (preferably one with RLS and authenticated can select)
	// ***************************************************
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
