import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import {
    addDoc, arrayRemove, arrayUnion, deleteDoc, 
    doc, getDoc, increment, serverTimestamp, updateDoc 
} from 'firebase/firestore';
import { database, komentarRef } from '$lib/firebase_app/database';

const ModelData = z.object({
    konten: z.string().optional(),
    konten_edit: z.string().optional()
});

export const load: PageServerLoad = async ({ request }) => {
    const DataKomentar = await superValidate(request, ModelData)
    return { DataKomentar };
};

export const actions: Actions = {
    PostKomentar: async ({ request, locals }) => {
        const DataKomentar = await superValidate(request, ModelData);
        if (!DataKomentar.valid) return fail(400, { message: "Invalid data", DataKomentar });

        if (!DataKomentar.data.konten) return setError(DataKomentar, 'konten', 'Harap isi komentar');

        try {
            await addDoc(komentarRef, {
                user_id: locals.user.id,
                konten: DataKomentar.data.konten,
                likes: 0,
                dislikes: 0,
                likedby: [],
                dislikedby: [],
                edited: false,
                dibuat_pada: serverTimestamp(),
                update_pada: serverTimestamp()
            });
        } catch(err) {
            console.error(err);
            return fail(500, { message: "Terjadi kesalahan. silahkan coba lagi nanti", DataKomentar });
        }

        return message(DataKomentar, 'Berhasil memposting komentar');
    },
    HapusKomentar: async ({ request, url }) => {
        const id = url.searchParams.get('id');
        if (!id) return fail(400, { message: "Invalid id" });

        const DataKomentar = await superValidate(request, ModelData);

        try {
            await deleteDoc(doc(database, 'Komentar', id))
        } catch(err) {
            console.error(err);
            return fail(500, { message: "Terjadi kesalahan. silahkan coba lagi nanti" });
        }
        return { DataKomentar };
    },
    EditKomentar: async ({ request, url }) => {
        const id = url.searchParams.get('id');
        if (!id) return fail(400, { message: "Invalid id" });

        const DataKomentar = await superValidate(request, ModelData);
        if (!DataKomentar.valid) return fail(400, { message: "Invalid data", DataKomentar });

        if (!DataKomentar.data.konten_edit) return setError(DataKomentar, 'konten', 'Harap isi komentar');

        try {
            const q = await getDoc(doc(database, 'Komentar', id));

            if (q.data()?.konten === DataKomentar.data.konten_edit) return;

            await updateDoc(doc(database, 'Komentar', id), {
                konten: DataKomentar.data.konten_edit,
                edited: true,
                update_pada: serverTimestamp()
            });
        } catch(err) {
            console.error(err);
            return fail(500, { message: "Terjadi kesalahan. silahkan coba lagi nanti", DataKomentar });
        }

        return message(DataKomentar, 'Berhasil memposting komentar');
    },
    Likes: async ({  request, url, locals }) => {
        const id = url.searchParams.get('id');
        if (!id) return fail(400, { message: "Invalid id" });

        const DataKomentar = await superValidate(request, ModelData);

        try {
            const q = await getDoc(doc(database, 'Komentar', id));
            
            if (q.data()?.likedby.includes(locals.user.id)) {
                await updateDoc(doc(database, 'Komentar', id), {
                    likes: increment(-1),
                    likedby: arrayRemove(locals.user.id)
                });
                return;
            }

            await updateDoc(doc(database, 'Komentar', id), {
                likes: increment(1),
                likedby: arrayUnion(locals.user.id)
            });
        } catch(err) {
            console.error(err);
            return fail(500, { message: "Terjadi kesalahan. silahkan coba lagi nanti" });
        }
        return { DataKomentar };
    },
    Dislikes: async ({  request, url, locals }) => {
        const id = url.searchParams.get('id');
        if (!id) return fail(400, { message: "Invalid id" });

        const DataKomentar = await superValidate(request, ModelData);

        try {
            const q = await getDoc(doc(database, 'Komentar', id));
            
            if (q.data()?.dislikedby.includes(locals.user.id)) {
                await updateDoc(doc(database, 'Komentar', id), {
                    dislikes: increment(-1),
                    dislikedby: arrayRemove(locals.user.id)
                });
                return;
            }

            await updateDoc(doc(database, 'Komentar', id), {
                dislikes: increment(1),
                dislikedby: arrayUnion(locals.user.id)
            });
        } catch(err) {
            console.error(err);
            return fail(500, { message: "Terjadi kesalahan. silahkan coba lagi nanti" });
        }
        return { DataKomentar };
    }
};