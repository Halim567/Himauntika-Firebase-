<script lang="ts">
    import { page } from "$app/stores";
    import { komentarRef, type DataKomentar } from "$lib/firebase_app/database";
    import type { Unsubscribe } from "firebase/auth";
    import { onSnapshot } from "firebase/firestore";
	import { onDestroy, onMount } from "svelte";
    import { superForm } from 'sveltekit-superforms/client';
    import type { PageData } from "./$types";
	import Navbar from "$lib/components/navbar/navbar.svelte";
    
    let Unsubscribe: Unsubscribe;
    let FirestoreData: DataKomentar[] = [];
    let edit: boolean[];
    export let data: PageData;

    const { form, enhance, delayed } = superForm(data.DataKomentar, {
        resetForm: true
    });

    onMount(() => {
        Unsubscribe = onSnapshot(komentarRef, snapshot => {
            FirestoreData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as unknown as DataKomentar));
            edit = FirestoreData.map(() => false);
        });
    });

    onDestroy(() => Unsubscribe);
</script>

<Navbar/>

<div class="konten">
    <p class="konten-paragraf">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam veniam debitis atque porro accusantium impedit aspernatur, quod adipisci nulla sint id commodi sequi rem dignissimos accusamus eum nostrum laboriosam incidunt est architecto, et, aut error! Excepturi delectus vero, illum officia id dignissimos at perspiciatis molestiae placeat libero? Ad ipsam dolore sunt! Id culpa explicabo eius quia alias ipsam dolore iste voluptatem sunt dicta! Necessitatibus doloremque nesciunt dolores tenetur vero repudiandae, perferendis animi a! Officiis velit amet ab obcaecati aspernatur minima labore deserunt quo illo corporis. Assumenda mollitia maiores facere cum eaque veniam incidunt, illo omnis dolorum iusto a sed dolore.</p>
    <div class="komentar">
        <form class="form-komentar" use:enhance action="?/PostKomentar" method="POST">
            <h2>Post Komentar</h2>
            <textarea bind:value={$form.konten} placeholder="Tambahkan komentar..." name="konten" id="konten" cols="10" rows="10"/>
            <div class="bott">
                <button type="submit">Post</button>
                {#if $delayed}
                    <span class="loader"></span>
                {/if}
            </div>
        </form>
        {#each FirestoreData as item, i}
            <div class="kolom-komentar">
                <div class="header-komentar">
                    <h2>Anonymous</h2>
                    <p>{item.dibuat_pada.toDate().toLocaleDateString()}</p>
                    {#if item.edited}
                        <p>(DIEDIT)</p>
                    {/if}
                </div>
                {#if edit[i]}
                    <form class="edit" use:enhance action="?/EditKomentar&id={item.id}" method="POST">
                        <textarea value={item.konten} placeholder="Tambahkan komentar..." name="konten_edit" id="konten_edit" cols="10" rows="10"/>
                        <div class="bott">
                            <button type="submit">Kirim</button>
                            <button on:click={() => edit[i] = !edit[i]} type="button">Batal Edit</button>
                        </div>
                    </form>
                {:else}
                    <p>{item.konten}</p>
                {/if}
                <div class="crud">
                    {#if !edit[i]}
                        <form use:enhance action="?/Likes&id={item.id}" method="POST">
                            <button>like {item.likes}</button>
                        </form>
                        <form use:enhance action="?/Dislikes&id={item.id}" method="POST">
                            <button>dislike {item.dislikes}</button>
                        </form>
                        {#if item.user_id === $page.data.user?.id}
                            <button on:click={() => edit[i] = !edit[i]}>Edit</button>
                            <form use:enhance action="?/HapusKomentar&id={item.id}" method="POST">
                                <button type="submit">Hapus</button>
                            </form>
                        {/if}
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .konten {
        padding: 5rem 10rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .konten-paragraf {
        text-align: justify;
    }

    .komentar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .form-komentar {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        border: 1px solid;
        width: 75%;

        padding: 1rem;
    }

    .edit {
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .edit textarea {
        width: 100%;
    }

    textarea {
        resize: none;
    }

    button {
        cursor: pointer;
    }

    .kolom-komentar {
        width: 75%;
        display: flex;
        flex-direction: column;
        gap: .5rem;
    }

    .header-komentar, .bott {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    .crud {
        display: flex;
        align-items: center;
        gap: .5rem;
    }

    .loader {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: inline-block;
        border-top: 3px solid #06b0ff;
        border-right: 3px solid transparent;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 

</style>