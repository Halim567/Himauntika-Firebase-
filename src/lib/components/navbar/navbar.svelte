<script lang="ts">
    const sosmed = [
        {icon: 'fab fa-instagram', link: '/'}, {icon: 'fab fa-facebook', link: '/'}, {icon: 'fab fa-tiktok', link: '/'},
        {icon: 'fab fa-youtube', link: '/'}
    ];
</script>

<nav>
    <div class="konten-kiri">
        <button>//\\</button>
        <div class="logo">
            <img src="" alt="">
            <h1>HIMAUNTIKA</h1>
        </div>
    </div>
    <div class="konten-kanan">
        <div>
            <a href="/pendaftaran">Pendafataran</a>
        </div>
        <div class="sosmed">
            {#each sosmed as item}
                <a href={item.link}><i class={item.icon}></i></a>
            {/each}
        </div>
    </div>
</nav>

<style lang="scss">
    @mixin flex-combo {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    nav {
        @include flex-combo();

        height: 3rem;
        border-bottom: 1px solid;

        .konten-kiri {
            @include flex-combo();

            margin-left: 5rem;

            .logo {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            button {
                border: none;
                outline: none;
                background-color: transparent;
                cursor: pointer;
            }
        }

        .konten-kanan {
            @include flex-combo();

            margin-right: 5rem;
            gap: 3rem;

            .sosmed {
                @include flex-combo();
                gap: 1rem;

                font-size: 1.2rem;
            }
        }
    }
</style>