import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    const session = cookies.get('admin_session');
    if (session === 'true') {
        throw redirect(303, '/admin');
    }
};

export const actions: Actions = {
    login: async ({ request, cookies }) => {
        const data = await request.formData();
        const password = data.get('password');

        // Simple password check against env variable
        // In production, use a more secure method or at least a long random string
        if (password === env.ADMIN_PASSWORD) {
            cookies.set('admin_session', 'true', {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 // 1 day
            });
            throw redirect(303, '/admin');
        }

        return fail(400, { incorrect: true });
    }
};
