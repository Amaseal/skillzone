<script lang="ts">
	type NavItem = { label: string; href: string };

	export let items: NavItem[] = [];
	export let brand = 'SkillZone';
	export let logoSrc: string | undefined;
</script>

<header class="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
	<div class="container mx-auto flex items-center justify-between px-4 py-3">
		<a href="#top" class="flex items-center gap-3">
			{#if logoSrc}
				<img src={logoSrc} alt={brand} class="h-10 w-auto" />
			{/if}
		</a>

		<nav class="hidden items-center gap-6 md:flex">
			{#each items as item}
				<a href={item.href} class="text-sm font-medium text-slate-700 hover:text-sky-700">
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="md:hidden">
			<!-- Minimal: no mobile menu yet -->
			<a
				href="#kontakti"
				class="rounded-lg bg-lime-400 px-3 py-2 text-xs font-semibold text-slate-950"
			>
				Kontakti
			</a>
		</div>
	</div>
</header>
