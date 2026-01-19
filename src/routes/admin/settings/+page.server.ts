import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { settings } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getSetting, setSetting } from '$lib/server/settings';

export const load: PageServerLoad = async () => {
    return {
        openingHour: await getSetting('opening_hour', '08:00'),
        closingHour: await getSetting('closing_hour', '21:00'),
        adminEmail: await getSetting('admin_email', 'info@skillzone.lv')
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const openingHour = data.get('openingHour') as string;
        const closingHour = data.get('closingHour') as string;
        const adminEmail = data.get('adminEmail') as string;

        if (openingHour) await setSetting('opening_hour', openingHour);
        if (closingHour) await setSetting('closing_hour', closingHour);
        if (adminEmail) await setSetting('admin_email', adminEmail);

        return { success: true };
    }
};
