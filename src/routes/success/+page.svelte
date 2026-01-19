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
	<title>Maksājums veiksmīgs | SkillZone.lv</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-white text-slate-900">
	<Navbar items={navItems} brand="SkillZone" logoSrc={logo} />

	<div class="flex flex-grow items-center justify-center px-4 py-20">
		<div class="mx-auto max-w-lg text-center">
			<div
				class="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					class="h-10 w-10"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
				</svg>
			</div>

			<SectionHeading
				eyebrow="Paldies!"
				title="Maksājums saņemts"
				subtitle="Jūsu rezervācija ir veiksmīgi apmaksāta. Mēs ar Jums sazināsimies, lai apstiprinātu laiku."
				color="text-slate-900"
			/>

			<div class="mt-8">
				<a
					href="/"
					class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95"
				>
					Atgriezties sākumlapā
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
