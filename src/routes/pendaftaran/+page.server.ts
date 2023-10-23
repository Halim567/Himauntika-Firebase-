import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';
import { addDoc, getDocs, query, where } from 'firebase/firestore';
import { pendaftarRef } from '$lib/firebase_app/database';

const ModelData = z.object({
    nama: z.string().min(3, "Nama lengkap wajib diisi"),
    nim: z.number().min(3, "NIM Wajib diisi").positive("NIM harus positif").nullable().refine(data => data !== null, { message: "NIM Wajib diisi" }),
    semester: z.number().min(1, "Semester Wajib diisi").positive("Semester harus positif").nullable().refine(data => data !== null, { message: "Semester Wajib diisi" }),
    alasan: z.string().min(10, "Alasan kamu daftar himauntika apa?")
});

export const load: PageServerLoad = async ({ request }) => {
    const DataPendaftaran = await superValidate(request, ModelData);
    return { DataPendaftaran };
};

export const actions: Actions = {
    Pendaftaran: async ({ request }) => {
        const DataPendaftaran = await superValidate(request, ModelData);
        if (!DataPendaftaran.valid || !DataPendaftaran.data.nim || !DataPendaftaran.data.semester) return fail(400, { DataPendaftaran });

        try {
            const nim_sudah_tersedia = await getDocs(query(pendaftarRef, where('nim', '==', DataPendaftaran.data.nim)));
            if (!nim_sudah_tersedia.empty) {
                console.log('NIM Sudah digunakan');
                return setError(DataPendaftaran, 'nim', 'NIM sudah digunakan');
            }

            await addDoc(pendaftarRef, {
                nama: DataPendaftaran.data.nama,
                nim: DataPendaftaran.data.nim,
                semester: DataPendaftaran.data.semester,
                alasan: DataPendaftaran.data.alasan
            });
        } catch(err) {
            console.error(err);
            return fail(500, { message: "Terjadi kesalahan. silahkan coba lagi nanti", DataPendaftaran });
        }

        return message(DataPendaftaran, "Pendaftaran berhasil. silahkan klik tombol \"Kembali\" untuk melanjutkan");
    }
};