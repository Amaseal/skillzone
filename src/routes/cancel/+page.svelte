<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import logo from '$lib/assets/skillzone.svg';

	const navItems = [
		{ label: 'Par mums', href: '/#par-mums' },
		{ label: 'Cenas', href: '/#cenas' },
		{ label: 'Kontakti', href: '/#kontakti' },
		{ label: 'Kalendārs', href: '/#kalendars' },
		{ label: 'Galerija', href: '/#galerija' },
		{ label: 'Noteikumi', href: '/noteikumi' }
	];
</script>

<svelte:head>
	<title>Maksājums atcelts | SkillZone.lv</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-white text-slate-900">
	<Navbar items={navItems} brand="SkillZone" logoSrc={logo} />

	<div class="flex-grow flex items-center justify-center px-4 py-20">
		<div class="text-center max-w-lg mx-auto">
			<div class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-10 w-10">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</div>

			<SectionHeading
				eyebrow="Atcelts"
				title="Maksājums neizdevās"
				subtitle="Maksājums tika atcelts vai neizdevās. Lūdzu, mēģiniet vēlreiz vai sazinieties ar mums."
				color="text-slate-900"
			/>

			<div class="mt-8">
				<a
					href="/#cenas"
					class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95"
				>
					Mēģināt vēlreiz
				</a>
			</div>
		</div>
	</div>

	<footer class="border-t border-slate-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-10">
			<div class="flex flex-col items-center justify-center gap-6">
				<img src={logo} alt="SkillZone" class="h-9 w-auto" />
				<p class="text-xs text-slate-500">
					© {new Date().getFullYear()} SkillZone.lv. Visas tiesības aizsargātas.
				</p>
			</div>
		</div>
	</footer>
</div>
