<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
    import type { PageData } from './$types';
	import Modals from '$lib/components/modals/modals.svelte';
    
    export let data: PageData;

    const { form, enhance, message, errors, delayed } = superForm(data.DataPendaftaran);
</script>

<Modals message={$message} />
<div>
    <form use:enhance action="?/Pendaftaran" method="POST">
        <div>
            <label for="nama">Nama</label>
            <input type="text" name="nama" id="nama" bind:value={$form.nama}>
            {#if $errors.nama}
                <small>{$errors.nama}</small>
            {/if}
        </div>
        <div>
            <label for="nim">NIM</label>
            <input type="text" name="nim" id="nim" bind:value={$form.nim}>
            {#if $errors.nim}
                <small>{$errors.nim}</small>
            {/if}
        </div>
        <div>
            <label for="semester">Semester</label>
            <input type="text" name="semester" id="semester" bind:value={$form.semester}>
            {#if $errors.semester}
                <small>{$errors.semester}</small>
            {/if}
        </div>
        <div>
            <label for="alasan">Alasan</label>
            <input type="text" name="alasan" id="alasan" bind:value={$form.alasan}>
            {#if $errors.alasan}
                <small>{$errors.alasan}</small>
            {/if}
        </div>
        <div>
            <button type="submit">Kirim</button>
            {#if $delayed}
                <p>Loading...</p>
            {/if}
        </div>
    </form>
</div>