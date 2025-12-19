<script lang="ts">
	import { onDestroy } from 'svelte';

	/**
	 * How many thumbnails to show initially.
	 * Use the "Load more" button rather than slicing via a passed-in `count`.
	 */
	export let initialCount = 6;
	/** How many thumbnails to add per "Load more" click. */
	export let step = 6;

	// Originals for lightbox
	const originals = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', {
		eager: true,
		as: 'url'
	}) as Record<string, string>;

	// Enhanced thumbs for fast grids
	const thumbs = import.meta.glob('../assets/images/*.{jpg,jpeg,png,webp}', {
		eager: true,
		query: {
			enhanced: true,
			w: '420'
		}
	});

	const allImages = Object.keys(originals)
		.sort((a, b) => a.localeCompare(b))
		.map((path, i) => {
			const name = path.split('/').pop() ?? `photo-${i + 1}`;
			return {
				key: path,
				name,
				alt: `SkillZone photo ${i + 1}`,
				fullSrc: originals[path],
				thumb: { src: thumbs[path] }
			};
		});

	let visibleCount = Math.min(initialCount, allImages.length);
	$: images = allImages.slice(0, visibleCount).map((img, i) => ({ id: i, ...img }));

	function loadMore() {
		visibleCount = Math.min(visibleCount + step, allImages.length);
	}

	// --- Lightbox state (unchanged) ---
	let lightboxOpen = false;
	let activeIndex = 0;

	function openLightbox(index: number) {
		activeIndex = index;
		lightboxOpen = true;
		lockScroll(true);
	}

	function closeLightbox() {
		lightboxOpen = false;
		lockScroll(false);
	}

	function prev() {
		activeIndex = (activeIndex - 1 + images.length) % images.length;
	}

	function next() {
		activeIndex = (activeIndex + 1) % images.length;
	}

	function onKeydown(e: KeyboardEvent) {
		if (!lightboxOpen) return;

		if (e.key === 'Escape') {
			e.preventDefault();
			closeLightbox();
			return;
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
			return;
		}
		if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
	}

	function lockScroll(lock: boolean) {
		if (typeof document === 'undefined') return;
		document.documentElement.style.overflow = lock ? 'hidden' : '';
	}

	if (typeof window !== 'undefined') {
		window.addEventListener('keydown', onKeydown);
		onDestroy(() => window.removeEventListener('keydown', onKeydown));
	}

	onDestroy(() => lockScroll(false));
</script>

<div class="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
	{#each images as img, i (img.key)}
		<button
			type="button"
			class="group relative h-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ring-0 transition hover:ring-2 hover:ring-sky-500/40"
			onclick={() => openLightbox(i)}
			aria-label={`Atvērt attēlu: ${img.alt}`}
		>
			<!-- Fast thumbnail -->
			<enhanced:img
				src={img.thumb.src.default}
				alt={img.alt}
				class="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03] md:h-56"
				loading="lazy"
			/>
			<div
				class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/55 to-transparent"
			></div>
		</button>
	{/each}
</div>

{#if visibleCount < allImages.length}
	<div class="mt-6 flex justify-center">
		<button
			type="button"
			class="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
			onclick={loadMore}
		>
			Load more
		</button>
	</div>
{/if}

{#if lightboxOpen}
	<!-- Lightbox -->
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4"
		role="dialog"
		aria-modal="true"
		aria-label="Galerija"
		onclick={(e) => {
			if (e.currentTarget === e.target) closeLightbox();
		}}
	>
		<div class="relative w-full max-w-6xl">
			<button
				type="button"
				class="absolute -top-12 right-0 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
				onclick={closeLightbox}
				aria-label="Aizvērt"
			>
				Aizvērt
			</button>

			<button
				type="button"
				class="absolute top-1/2 left-0 -translate-y-1/2 rounded-xl bg-white/10 px-3 py-3 text-white backdrop-blur hover:bg-white/15"
				onclick={prev}
				aria-label="Iepriekšējais"
				disabled={images.length < 2}
			>
				‹
			</button>

			<button
				type="button"
				class="absolute top-1/2 right-0 -translate-y-1/2 rounded-xl bg-white/10 px-3 py-3 text-white backdrop-blur hover:bg-white/15"
				onclick={next}
				aria-label="Nākamais"
				disabled={images.length < 2}
			>
				›
			</button>

			<div class="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl">
				<!-- Full image only loads when lightbox is open -->
				<enhanced:img
					src={images[activeIndex]?.fullSrc}
					alt={images[activeIndex]?.alt}
					class="max-h-[80svh] w-full object-contain"
					loading="eager"
				/>
			</div>

			<div class="mt-3 flex items-center justify-between text-xs text-white/80">
				<p>{images[activeIndex]?.name}</p>
				<p>{activeIndex + 1} / {images.length}</p>
			</div>
		</div>
	</div>
{/if}
