<script lang="ts">
	export let message: any;

	let dialog: HTMLDialogElement;

	$: if (dialog && message) dialog.showModal();
</script>


<dialog bind:this={dialog}>
    <div>
        <h1>Pendaftaran berhasil</h1>
        <p>{message}</p>
        <a href="/">Kembali</a>
    </div>
</dialog>

<style>
    dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

    dialog > div {
		padding: 1em;
	}

    dialog[open] {
		animation: zoom 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.5);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 300ms ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>