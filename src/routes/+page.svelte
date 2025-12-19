<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import SectionHeading from '$lib/components/SectionHeading.svelte';
	import PriceCard from '$lib/components/PriceCard.svelte';
	import GalleryGrid from '$lib/components/GalleryGrid.svelte';
	import map from '$lib/assets/map.png';

	import heroImage from '$lib/assets/hero_background.png';

	import logo from '$lib/assets/skillzone.svg';

	const navItems = [
		{ label: 'Par mums', href: '#par-mums' },
		{ label: 'Cenas', href: '#cenas' },
		{ label: 'Kontakti', href: '#kontakti' },
		{ label: 'Kalendārs', href: '#kalendars' },
		{ label: 'Galerija', href: '#galerija' },
		{ label: 'Noteikumi', href: '/noteikumi' }
	];
</script>

<svelte:head>
	<title>SkillZone.lv — hokeja iemaņu treniņu zāle</title>
	<meta
		name="description"
		content="SkillZone.lv — mūsdienīga hokeja iemaņu treniņu zāle ar hokeja trenažieriem un mākslīgo ledu."
	/>
</svelte:head>

<div id="top" class="min-h-screen bg-white text-slate-900">
	<Navbar items={navItems} brand="SkillZone" logoSrc={logo} />

	<!-- HERO -->
	<section
		class="relative isolate h-[100svh] overflow-hidden bg-cover bg-center bg-no-repeat"
		style="background-image: url({heroImage});"
	>
		<div class="container mx-auto flex h-full items-center px-4 py-12 md:py-16">
			<div class="grid w-full items-center gap-12 md:grid-cols-2">
				<div>
					<p
						class="inline-flex items-center gap-2 rounded-full border border-lime-400 bg-lime-300 px-3 py-1 text-xs font-semibold tracking-wide text-slate-950"
					>
						Mākslīgais ledus • Trenažieri • Individuālie treniņi
					</p>
					<h1
						class="mt-6 text-5xl leading-[1.05] font-extrabold tracking-tight text-blue-600 uppercase md:text-8xl"
					>
						Hokeja iemaņu treniņu zāle individuālai meistarībai
					</h1>
					<p class="mt-5 max-w-2xl text-base leading-relaxed text-black md:text-xl">
						Mūsdienīga treniņu vide ar hokeja trenažieriem un mākslīgā ledus laukumu, kas ļauj
						uzlabot slidošanu, metienus, ripas kontroli un koordināciju neatkarīgi no sezonas.
					</p>

					<div class="mt-10 flex flex-col gap-3 sm:flex-row">
						<a
							href="#cenas"
							class="inline-flex items-center justify-center rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-lime-300"
						>
							Apskatīt cenas
						</a>
						<a
							href="#kontakti"
							class="inline-flex items-center justify-center rounded-xl border border-blue-600 px-6 py-3.5 text-sm font-semibold text-blue-600 hover:bg-white/20"
						>
							Sazināties
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- PAR MUMS -->
	<section id="par-mums" class="mx-auto px-4 py-16 md:py-20">
		<div class="container mx-auto">
			<SectionHeading
				eyebrow="Par mums"
				color="text-blue-600"
				subtextColor="text-slate-600"
				title="SkillZone.lv — vieta, kur attīstīt individuālo meistarību"
				subtitle="Specializēta hokeja iemaņu treniņu zāle ar mākslīgo ledu un trenažieriem. Strādājam gan ar komandām, gan individuāliem spēlētājiem."
			/>
			<div class="grid gap-6 md:grid-cols-3">
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-slate-900">Mūsdienīga vide</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-600">
						Dažādi hokeja trenažieri un mākslīgais ledus treniņiem neatkarīgi no sezonas.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-slate-900">Mērķtiecīgi treniņi</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-600">
						Pilnveido slidošanu, metienus, ripas kontroli un koordināciju ar pārdomātiem uzdevumiem.
					</p>
				</div>
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h3 class="text-lg font-semibold text-slate-900">Pieredzējuši treneri</h3>
					<p class="mt-2 text-sm leading-relaxed text-slate-600">
						Individuālās meistarības treneru vadībā — lai spertu nākamo soli savā attīstībā.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CENRĀDIS -->
	<section id="cenas" class="border-t border-slate-200 bg-blue-600">
		<div class="container mx-auto px-4 py-16 md:py-20">
			<SectionHeading eyebrow="Cenrādis" color="text-white" title="Vienkāršas un skaidras cenas" />

			<div class="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
				<PriceCard
					title="Individuāls treniņš ar treneri"
					details="1h"
					price="35,-"
					bullets={['Laukuma izmērs pēc trenera vajadzībām', 'Trenera samaksa', 'Viss inventārs']}
				/>

				<PriceCard
					title="Viss laukums uz stundu"
					details="1h"
					price="120,-"
					highlight={true}
					bullets={['Pilnais laukums', 'Viss inventārs']}
				/>

				<PriceCard
					title="Individuāls treniņš vienam cilvēkam"
					details="1h"
					price="15,-"
					bullets={['Atsevišķi nodalīta treniņu zona', 'Viss inventārs']}
				/>
			</div>
		</div>
	</section>

	<!-- KONTAKTI -->
	<section id="kontakti" class="mx-auto max-w-7xl px-4 py-16 md:py-20">
		<SectionHeading
			eyebrow="Kontakti"
			title="Sazinies un rezervē treniņu"
			subtitle="Zvani vai raksti — palīdzēsim piemeklēt laiku un treniņa veidu."
		/>

		<div class="grid gap-6 md:grid-cols-2">
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="text-lg font-semibold text-slate-900">Telefoni</h3>
				<div class="mt-3 space-y-2 text-sm text-slate-700">
					<p class="text-slate-500">Treneri:</p>
					<p>
						<a class="font-semibold text-sky-700 hover:text-sky-900" href="tel:+37122442315"
							>+371 22 442 315</a
						>
						<span class="text-slate-400"> un </span>
						<a class="font-semibold text-sky-700 hover:text-sky-900" href="tel:+37127830221"
							>+371 27 830 221</a
						>
					</p>
					<p class="text-slate-500">Globāla informācija:</p>
					<p class="text-slate-700">info@skillzone.lv</p>
				</div>
			</div>

			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h3 class="text-lg font-semibold text-slate-900">Adrese</h3>
				<p class="mt-3 text-sm text-slate-700">Brīvības 19, Ogre</p>
				<p class="mt-1 text-xs text-slate-500">Auto ērtāk novietot: Brīvības 17</p>

				<div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
					<!-- Placeholder map: replace with Google Maps embed later -->
					<img
						src={map}
						alt="Karte (placeholder)"
						class="h-56 w-full object-cover"
						loading="lazy"
					/>
				</div>
			</div>
		</div>
	</section>

	<!-- KALENDĀRS -->
	<section id="kalendars" class="border-t border-slate-200 bg-slate-50">
		<div class="mx-auto max-w-7xl px-4 py-16 md:py-20">
			<SectionHeading
				eyebrow="Kalendārs"
				title="Rezervācijas — drīzumā"
				subtitle="Pavisam drīz varēsi apskatīt pieejamos laikus un rezervēt treniņu tieši šeit."
			/>
		</div>
	</section>

	<!-- GALERIJA -->
	<section id="galerija" class="mx-auto max-w-7xl px-4 py-16 md:py-20">
		<SectionHeading eyebrow="Galerija" title="Treniņu vide un process" />
		<GalleryGrid initialCount={6} step={6} />
	</section>

	<footer class="border-t border-slate-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-10">
			<div class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
				<div class="flex items-center gap-3">
					<img src={logo} alt="SkillZone" class="h-9 w-auto" />
				</div>

				<div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
					<a class="text-slate-600 hover:text-slate-900" href="#par-mums">Par mums</a>
					<a class="text-slate-600 hover:text-slate-900" href="#cenas">Cenas</a>
					<a class="text-slate-600 hover:text-slate-900" href="#kontakti">Kontakti</a>
					<a class="text-slate-600 hover:text-slate-900" href="/noteikumi">Noteikumi</a>
				</div>
			</div>

			<p class="mt-8 text-xs text-slate-500">
				© {new Date().getFullYear()} SkillZone.lv. Visas tiesības aizsargātas.
			</p>
		</div>
	</footer>
</div>
