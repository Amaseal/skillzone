<script>
	import logo from '$lib/assets/skill_zone_hokejs_logo.png';
	import background from '$lib/assets/463871-top-ice-hockey-backgrounds-1920x1200-ipad-pro.jpg';
</script>

<svelte:head>
	<title>Skillzone - hokeja trenniņu arēna</title>
</svelte:head>

<section
	class="flex min-h-screen items-center justify-center bg-cover bg-center"
	style="background-image: url('{background}');"
>
	<div
		class="relative container mx-auto flex flex-col items-center justify-center rounded-xl bg-blue-600/80 p-20 text-center"
	>
		<img src={logo} alt="Skill Zone Hockey Logo" class="mb-6 h-24" />

		<h1 class="mb-5 text-9xl font-bold text-white uppercase">Jau drīzumā!</h1>
		<p class="text-3xl text-white">
			Jau pavisam drīz atvērsies jaunākā hokeja trenniņu arēna ogrē!
		</p>
	</div>
</section>
