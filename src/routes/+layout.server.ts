import { signInAnonymously } from 'firebase/auth';
import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/firebase_app/database';

export const prerender = true;

export const load: LayoutServerLoad = async ({ locals }) => {
    await signInAnonymously(auth);
    return {
        user: locals.user
    };
};