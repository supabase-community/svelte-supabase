import { createHandler } from '$lib/auth/helper';

export const post = createHandler('/auth/signup', 'signUp');
