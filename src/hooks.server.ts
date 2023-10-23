import { auth } from "$lib/firebase_app/database";
import type { Handle } from "@sveltejs/kit";
import { onAuthStateChanged } from "firebase/auth";

export const handle: Handle = async ({ event, resolve }) => {
    onAuthStateChanged(auth, user => {
        if (!user) {
            console.log('Tidak ada user');
            return null;
        }
        console.log(user.uid);
        event.locals.user = {
            id: user.uid
        };
    });

    return await resolve(event);
};